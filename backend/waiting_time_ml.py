from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split

from clinic_profiles import DOCTOR_PROFILES

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "appointments_dataset.csv"
MODEL_PATH = BASE_DIR / "waiting_time_model.pkl"

FEATURE_COLUMNS = [
    "doctor_id",
    "clinic_id",
    "appointment_hour",
    "day_of_week",
    "queue_position",
    "patients_ahead",
    "priority_booking",
]
TARGET_COLUMN = "actual_waiting_time"


@dataclass
class TrainingResult:
    model_path: Path
    dataset_path: Path
    mae: float
    rmse: float


def generate_appointments_dataset(
    output_path: Path = DATASET_PATH,
    rows: int = 320,
    random_seed: int = 42,
) -> pd.DataFrame:
    """Generate simulated appointment history and save it as CSV."""
    if rows < 200 or rows > 500:
        raise ValueError("rows must be between 200 and 500")

    rng = np.random.default_rng(random_seed)
    data_rows: List[Dict[str, int]] = []

    for _ in range(rows):
        doctor_profile = dict(rng.choice(DOCTOR_PROFILES))
        doctor_id = int(doctor_profile["doctor_id"])
        clinic_id = int(doctor_profile["clinic_id"])
        avg_consultation_time = int(doctor_profile["avg_consultation_time"])

        appointment_hour = int(rng.integers(8, 22))
        day_of_week = int(rng.integers(1, 8))
        queue_position = int(rng.integers(1, 21))
        patients_ahead = int(rng.integers(0, queue_position))
        priority_booking = int(rng.choice([0, 1], p=[0.72, 0.28]))

        priority_adjustment = 5 if priority_booking == 1 else 0
        peak_adjustment = 4 if appointment_hour in {10, 11, 17, 18} else 0
        weekend_adjustment = 3 if day_of_week in {6, 7} else 0

        actual_waiting_time = (
            (patients_ahead * avg_consultation_time)
            + peak_adjustment
            + weekend_adjustment
            - priority_adjustment
        )
        actual_waiting_time = max(int(actual_waiting_time), 0)

        data_rows.append(
            {
                "doctor_id": doctor_id,
                "clinic_id": clinic_id,
                "appointment_hour": appointment_hour,
                "day_of_week": day_of_week,
                "queue_position": queue_position,
                "patients_ahead": patients_ahead,
                "avg_consultation_time": avg_consultation_time,
                "priority_booking": priority_booking,
                "actual_waiting_time": actual_waiting_time,
            }
        )

    df = pd.DataFrame(data_rows)
    df.to_csv(output_path, index=False)
    return df


def train_waiting_time_model(
    dataset_path: Path = DATASET_PATH,
    model_path: Path = MODEL_PATH,
    test_size: float = 0.2,
    random_seed: int = 42,
) -> TrainingResult:
    df = pd.read_csv(dataset_path)
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_seed,
    )

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=random_seed,
        min_samples_leaf=1,
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = float(np.sqrt(mean_squared_error(y_test, predictions)))

    joblib.dump(
        {
            "model": model,
            "feature_columns": FEATURE_COLUMNS,
            "trained_at": datetime.now(UTC).isoformat(),
        },
        model_path,
    )

    return TrainingResult(
        model_path=model_path,
        dataset_path=dataset_path,
        mae=float(mae),
        rmse=rmse,
    )


def _load_model(model_path: Path = MODEL_PATH):
    bundle = joblib.load(model_path)
    return bundle["model"], bundle["feature_columns"]


def predict_waiting_time(
    queue_position: int,
    patients_ahead: int,
    appointment_hour: int,
    priority_booking: int,
    doctor_id: int,
    clinic_id: int,
    day_of_week: int | None = None,
    model_path: Path = MODEL_PATH,
) -> Dict[str, str | float | int]:
    if day_of_week is None:
        day_of_week = datetime.now().weekday() + 1

    model, feature_columns = _load_model(model_path)
    sample = pd.DataFrame(
        [
            {
                "doctor_id": int(doctor_id),
                "clinic_id": int(clinic_id),
                "appointment_hour": int(appointment_hour),
                "day_of_week": int(day_of_week),
                "queue_position": int(queue_position),
                "patients_ahead": int(patients_ahead),
                "priority_booking": int(priority_booking),
            }
        ]
    )[feature_columns]

    predicted_waiting_time = float(model.predict(sample)[0])
    predicted_waiting_time = max(0.0, round(predicted_waiting_time, 2))

    base_time = datetime.now().replace(
        hour=int(appointment_hour),
        minute=0,
        second=0,
        microsecond=0,
    )
    expected_time = base_time + timedelta(minutes=predicted_waiting_time)

    return {
        "queue_position": int(queue_position),
        "patients_ahead": int(patients_ahead),
        "predicted_waiting_time": predicted_waiting_time,
        "expected_consultation_time": expected_time.strftime("%I:%M %p"),
    }


def apply_dynamic_rescheduling(
    upcoming_appointments: pd.DataFrame,
    additional_delay_minutes: int,
) -> pd.DataFrame:
    if "predicted_waiting_time" not in upcoming_appointments.columns:
        raise ValueError("upcoming_appointments must include 'predicted_waiting_time' column")

    updated = upcoming_appointments.copy()
    updated["predicted_waiting_time"] = updated["predicted_waiting_time"].astype(float) + int(additional_delay_minutes)
    updated["new_waiting_time"] = updated["predicted_waiting_time"]
    return updated


def build_and_train_pipeline(rows: int = 320) -> TrainingResult:
    generate_appointments_dataset(rows=rows)
    return train_waiting_time_model()


if __name__ == "__main__":
    result = build_and_train_pipeline(rows=320)
    print("Dataset generated:", result.dataset_path)
    print("Model saved:", result.model_path)
    print(f"MAE: {result.mae:.2f}")
    print(f"RMSE: {result.rmse:.2f}")

    sample_prediction = predict_waiting_time(
        queue_position=5,
        patients_ahead=4,
        appointment_hour=11,
        priority_booking=0,
        doctor_id=101,
        clinic_id=3,
        day_of_week=2,
    )
    print("Sample prediction:", sample_prediction)
