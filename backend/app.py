from __future__ import annotations

import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict
from uuid import uuid4

import pandas as pd
from flask import Flask, jsonify, request

from clinic_profiles import DOCTOR_PROFILES, get_doctor_profile
from waiting_time_ml import (
    DATASET_PATH,
    MODEL_PATH,
    apply_dynamic_rescheduling,
    build_and_train_pipeline,
    predict_waiting_time,
)

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("QUEZY_DATA_DIR", str(BASE_DIR)))
DATA_DIR.mkdir(parents=True, exist_ok=True)
USERS_FILE = DATA_DIR / "users.xlsx"
BOOKINGS_FILE = DATA_DIR / "appointments_bookings.csv"
EXPECTED_COLUMNS = ["FullName", "Email", "Phone", "Password"]
BOOKING_COLUMNS = [
    "booking_id",
    "patient_name",
    "phone_number",
    "email",
    "medical_problem",
    "clinic_name",
    "clinic_id",
    "doctor_name",
    "doctor_id",
    "specialization",
    "appointment_date",
    "time_slot",
    "appointment_hour",
    "day_of_week",
    "priority_booking",
    "queue_position",
    "patients_ahead",
    "avg_consultation_time",
    "predicted_waiting_time",
    "expected_consultation_time",
    "arrival_time",
    "status",
    "payment_method",
    "coupon_code",
    "coupon_discount",
    "total_amount",
    "created_at",
]

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_REGEX = re.compile(r"^\d{10}$")

ML_STATUS: Dict[str, Any] = {
    "ready": False,
    "message": "Model not initialized",
    "dataset_path": str(DATASET_PATH),
    "model_path": str(MODEL_PATH),
}


def ensure_ml_assets() -> None:
    global ML_STATUS

    try:
        if not DATASET_PATH.exists() or not MODEL_PATH.exists():
            result = build_and_train_pipeline(rows=320)
            ML_STATUS = {
                "ready": True,
                "message": "Model trained at startup",
                "dataset_path": str(result.dataset_path),
                "model_path": str(result.model_path),
                "mae": result.mae,
                "rmse": result.rmse,
            }
            return

        try:
            predict_waiting_time(
                queue_position=1,
                patients_ahead=0,
                appointment_hour=10,
                priority_booking=0,
                doctor_id=101,
                clinic_id=1,
                day_of_week=1,
            )
        except Exception:
            result = build_and_train_pipeline(rows=320)
            ML_STATUS = {
                "ready": True,
                "message": "Model retrained for current schema",
                "dataset_path": str(result.dataset_path),
                "model_path": str(result.model_path),
                "mae": result.mae,
                "rmse": result.rmse,
            }
            return

        ML_STATUS = {
            "ready": True,
            "message": "Model loaded successfully",
            "dataset_path": str(DATASET_PATH),
            "model_path": str(MODEL_PATH),
        }
    except Exception as exc:
        ML_STATUS = {
            "ready": False,
            "message": f"ML initialization failed: {exc}",
            "dataset_path": str(DATASET_PATH),
            "model_path": str(MODEL_PATH),
        }


def ensure_users_file() -> None:
    if not USERS_FILE.exists():
        pd.DataFrame(columns=EXPECTED_COLUMNS).to_excel(USERS_FILE, index=False)


def ensure_bookings_file() -> None:
    if not BOOKINGS_FILE.exists():
        pd.DataFrame(columns=BOOKING_COLUMNS).to_csv(BOOKINGS_FILE, index=False)


def load_users_df() -> pd.DataFrame:
    ensure_users_file()
    try:
        df = pd.read_excel(USERS_FILE)
    except Exception:
        df = pd.DataFrame(columns=EXPECTED_COLUMNS)

    for column in EXPECTED_COLUMNS:
        if column not in df.columns:
            df[column] = ""
    return df[EXPECTED_COLUMNS].fillna("")


def load_bookings_df() -> pd.DataFrame:
    ensure_bookings_file()
    try:
        df = pd.read_csv(BOOKINGS_FILE)
    except Exception:
        df = pd.DataFrame(columns=BOOKING_COLUMNS)

    for column in BOOKING_COLUMNS:
        if column not in df.columns:
            df[column] = ""
    return df[BOOKING_COLUMNS].fillna("")


def save_users_df(df: pd.DataFrame) -> None:
    df.to_excel(USERS_FILE, index=False)


def save_bookings_df(df: pd.DataFrame) -> None:
    df.to_csv(BOOKINGS_FILE, index=False)


def validate_registration(data: Dict[str, Any]) -> str | None:
    full_name = str(data.get("full_name", "")).strip()
    email = str(data.get("email", "")).strip()
    phone = str(data.get("phone", "")).strip()
    password = str(data.get("password", ""))
    confirm_password = str(data.get("confirm_password", ""))

    if not full_name:
        return "Full Name must not be empty"
    if not EMAIL_REGEX.match(email):
        return "Email must be in valid format"
    if not PHONE_REGEX.match(phone):
        return "Phone number must be exactly 10 digits"
    if len(password) < 6:
        return "Password must be at least 6 characters"
    if password != confirm_password:
        return "Confirm Password must match Password"
    return None


def validate_booking_payload(data: Dict[str, Any], require_contact: bool = True) -> str | None:
    if require_contact and not str(data.get("name", "")).strip():
        return "Full Name is required"
    if require_contact and not PHONE_REGEX.match(str(data.get("phone_number", "")).strip()):
        return "Phone number must be exactly 10 digits"
    if require_contact and not EMAIL_REGEX.match(str(data.get("email", "")).strip()):
        return "Email must be in valid format"
    if not str(data.get("medical_problem", "")).strip():
        return "Medical Problem is required"
    if not str(data.get("clinic_name", "")).strip():
        return "Nearby Clinic is required"
    if not str(data.get("doctor_name", "")).strip():
        return "Service Provider is required"
    if not str(data.get("appointment_date", "")).strip():
        return "Appointment Date is required"
    if not str(data.get("time_slot", "")).strip():
        return "Appointment Time Slot is required"
    return None


def generate_booking_id() -> str:
    return "ATRX" + uuid4().hex[:8].upper()


def parse_time_slot(time_slot: str) -> datetime:
    return datetime.strptime(time_slot.strip(), "%I:%M %p")


def parse_appointment_date(date_value: str) -> datetime:
    return datetime.strptime(date_value.strip(), "%Y-%m-%d")


def format_clock(value: datetime) -> str:
    return value.strftime("%I:%M %p")


def booking_row_to_summary(record: pd.Series) -> Dict[str, Any]:
    priority_booking = bool(int(float(record["priority_booking"] or 0)))
    return {
        "bookingId": str(record["booking_id"]),
        "name": str(record["patient_name"]),
        "phoneNumber": str(record["phone_number"]),
        "email": str(record["email"]),
        "medicalProblem": str(record["medical_problem"]),
        "serviceType": "Clinic Appointment",
        "doctor": str(record["doctor_name"]),
        "clinic": str(record["clinic_name"]),
        "provider": f"{record['doctor_name']} ({record['clinic_name']})",
        "specialization": str(record["specialization"]),
        "bookingDate": str(record["appointment_date"]),
        "timeSlot": str(record["time_slot"]),
        "arrivalTime": str(record["arrival_time"]),
        "queuePosition": int(float(record["queue_position"] or 0)),
        "patientsAhead": int(float(record["patients_ahead"] or 0)),
        "predictedWait": int(round(float(record["predicted_waiting_time"] or 0))),
        "expectedConsultation": str(record["expected_consultation_time"]),
        "priorityBooking": priority_booking,
        "paymentMethod": str(record["payment_method"]),
        "couponCode": str(record["coupon_code"]),
        "couponDiscount": int(float(record["coupon_discount"] or 0)),
        "totalAmount": int(float(record["total_amount"] or 0)),
        "priorityDiscount": 500 if priority_booking else 0,
    }


def build_queue_summary(data: Dict[str, Any], persist: bool) -> Dict[str, Any]:
    clinic_name = str(data.get("clinic_name", "")).strip()
    doctor_name = str(data.get("doctor_name", "")).strip()
    appointment_date = str(data.get("appointment_date", "")).strip()
    time_slot = str(data.get("time_slot", "")).strip()
    medical_problem = str(data.get("medical_problem", "")).strip()
    priority_booking = 1 if bool(data.get("priority_booking", False)) else 0
    requested_booking_id = str(data.get("booking_id", "")).strip()

    doctor_profile = get_doctor_profile(doctor_name, clinic_name)
    if doctor_profile is None:
        raise ValueError("Selected doctor profile is not available for this clinic")

    appointment_date_value = parse_appointment_date(appointment_date)
    appointment_time_value = parse_time_slot(time_slot)
    appointment_timestamp = appointment_date_value.replace(
        hour=appointment_time_value.hour,
        minute=appointment_time_value.minute,
        second=0,
        microsecond=0,
    )

    bookings_df = load_bookings_df()

    if persist and requested_booking_id:
        duplicate_booking_id_rows = bookings_df[
            bookings_df["booking_id"].astype(str).eq(requested_booking_id)
        ]
        if not duplicate_booking_id_rows.empty:
            raise ValueError("Booking already exists")

    if persist:
        duplicate_booking_rows = bookings_df[
            bookings_df["patient_name"].astype(str).str.strip().str.lower().eq(str(data.get("name", "")).strip().lower())
            & bookings_df["doctor_name"].astype(str).str.strip().str.lower().eq(doctor_name.lower())
            & bookings_df["clinic_name"].astype(str).str.strip().str.lower().eq(clinic_name.lower())
            & bookings_df["appointment_date"].astype(str).eq(appointment_date)
            & bookings_df["time_slot"].astype(str).eq(time_slot)
        ]
        if not duplicate_booking_rows.empty:
            raise ValueError("Duplicate booking detected")

    same_slot_bookings = bookings_df[
        bookings_df["doctor_id"].astype(str).eq(str(doctor_profile["doctor_id"]))
        & bookings_df["clinic_id"].astype(str).eq(str(doctor_profile["clinic_id"]))
        & bookings_df["appointment_date"].astype(str).eq(appointment_date)
        & bookings_df["time_slot"].astype(str).eq(time_slot)
    ]

    queue_position = len(same_slot_bookings.index) + 1
    patients_ahead = max(queue_position - 1, 0)
    day_of_week = appointment_date_value.isoweekday()
    appointment_hour = appointment_timestamp.hour
    avg_consultation_time = int(doctor_profile["avg_consultation_time"])

    ml_prediction = predict_waiting_time(
        queue_position=queue_position,
        patients_ahead=patients_ahead,
        appointment_hour=appointment_hour,
        priority_booking=priority_booking,
        doctor_id=int(doctor_profile["doctor_id"]),
        clinic_id=int(doctor_profile["clinic_id"]),
        day_of_week=day_of_week,
    )
    formula_wait = max((patients_ahead * avg_consultation_time) - (5 if priority_booking else 0), 0)
    predicted_waiting_time = max(round((float(ml_prediction["predicted_waiting_time"]) + formula_wait) / 2), 0)

    expected_consultation_time = format_clock(appointment_timestamp + timedelta(minutes=predicted_waiting_time))
    arrival_time = format_clock(appointment_timestamp - timedelta(minutes=5))
    booking_id = requested_booking_id or generate_booking_id()

    summary = {
        "bookingId": booking_id,
        "name": str(data.get("name", "")).strip(),
        "phoneNumber": str(data.get("phone_number", "")).strip(),
        "email": str(data.get("email", "")).strip(),
        "medicalProblem": medical_problem,
        "serviceType": "Clinic Appointment",
        "doctor": doctor_name,
        "clinic": clinic_name,
        "provider": f"{doctor_name} ({clinic_name})",
        "specialization": doctor_profile["specialization"],
        "bookingDate": appointment_date,
        "timeSlot": time_slot,
        "arrivalTime": arrival_time,
        "queuePosition": queue_position,
        "patientsAhead": patients_ahead,
        "predictedWait": predicted_waiting_time,
        "expectedConsultation": expected_consultation_time,
        "priorityBooking": bool(priority_booking),
        "paymentMethod": str(data.get("payment_method", "Not Selected")).strip() or "Not Selected",
        "couponCode": str(data.get("coupon_code", "None")).strip() or "None",
        "couponDiscount": int(float(data.get("coupon_discount", 0) or 0)),
        "totalAmount": int(float(data.get("total_amount", 0) or 0)),
        "priorityDiscount": 500 if priority_booking else 0,
    }

    if persist:
        new_row = {
            "booking_id": booking_id,
            "patient_name": summary["name"],
            "phone_number": summary["phoneNumber"],
            "email": summary["email"],
            "medical_problem": summary["medicalProblem"],
            "clinic_name": clinic_name,
            "clinic_id": int(doctor_profile["clinic_id"]),
            "doctor_name": doctor_name,
            "doctor_id": int(doctor_profile["doctor_id"]),
            "specialization": doctor_profile["specialization"],
            "appointment_date": appointment_date,
            "time_slot": time_slot,
            "appointment_hour": appointment_hour,
            "day_of_week": day_of_week,
            "priority_booking": priority_booking,
            "queue_position": queue_position,
            "patients_ahead": patients_ahead,
            "avg_consultation_time": avg_consultation_time,
            "predicted_waiting_time": predicted_waiting_time,
            "expected_consultation_time": expected_consultation_time,
            "arrival_time": arrival_time,
            "status": "Booked",
            "payment_method": summary["paymentMethod"],
            "coupon_code": summary["couponCode"],
            "coupon_discount": summary["couponDiscount"],
            "total_amount": summary["totalAmount"],
            "created_at": datetime.now().isoformat(),
        }
        save_bookings_df(pd.concat([bookings_df, pd.DataFrame([new_row])], ignore_index=True))

    return summary


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    return response


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"success": True, "status": "ok", "ml_ready": ML_STATUS.get("ready", False)}), 200


@app.route("/api/register", methods=["POST", "OPTIONS"])
def register_user():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}
        validation_error = validate_registration(data)
        if validation_error:
            return jsonify({"success": False, "message": validation_error}), 400

        full_name = str(data.get("full_name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        phone = str(data.get("phone", "")).strip()
        password = str(data.get("password", ""))

        users_df = load_users_df()
        existing_emails = users_df["Email"].astype(str).str.strip().str.lower()
        if (existing_emails == email).any():
            return jsonify({"success": False, "message": "User already registered"}), 409

        new_row = {"FullName": full_name, "Email": email, "Phone": phone, "Password": password}
        save_users_df(pd.concat([users_df, pd.DataFrame([new_row])], ignore_index=True))
        return jsonify({"success": True, "message": "Registration successful"}), 201
    except Exception as exc:
        return jsonify({"success": False, "message": f"Server error: {exc}"}), 500


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login_user():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))

        if not EMAIL_REGEX.match(email):
            return jsonify({"success": False, "message": "Email must be in valid format"}), 400
        if not password:
            return jsonify({"success": False, "message": "Password is required"}), 400

        users_df = load_users_df()
        matched = users_df[
            users_df["Email"].astype(str).str.strip().str.lower().eq(email)
            & users_df["Password"].astype(str).eq(password)
        ]
        if matched.empty:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        return jsonify({"success": True, "message": "Login successful", "redirect_url": "/"})
    except Exception as exc:
        return jsonify({"success": False, "message": f"Server error: {exc}"}), 500


@app.route("/api/predict-wait-time", methods=["POST", "OPTIONS"])
def api_predict_wait_time():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    if not ML_STATUS.get("ready"):
        return jsonify({"success": False, "message": ML_STATUS.get("message", "ML model is not ready")}), 503

    try:
        data = request.get_json(silent=True) or {}
        validation_error = validate_booking_payload(data, require_contact=False)
        if validation_error:
            return jsonify({"success": False, "message": validation_error}), 400

        preview_payload = {
            "booking_id": "PREVIEW",
            "name": str(data.get("name", "Preview Patient")).strip() or "Preview Patient",
            "phone_number": str(data.get("phone_number", "0123456789")).strip() or "0123456789",
            "email": str(data.get("email", "preview@example.com")).strip() or "preview@example.com",
            "medical_problem": str(data.get("medical_problem", "General Consultation")).strip() or "General Consultation",
            "clinic_name": str(data.get("clinic_name", "")).strip(),
            "doctor_name": str(data.get("doctor_name", "")).strip(),
            "appointment_date": str(data.get("appointment_date", "")).strip(),
            "time_slot": str(data.get("time_slot", "")).strip(),
            "priority_booking": bool(data.get("priority_booking", False)),
        }
        prediction = build_queue_summary(preview_payload, persist=False)
        return jsonify({"success": True, "prediction": prediction}), 200
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"success": False, "message": f"Prediction failed: {exc}"}), 500


@app.route("/api/bookings", methods=["POST", "OPTIONS"])
def api_create_booking():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    if not ML_STATUS.get("ready"):
        return jsonify({"success": False, "message": ML_STATUS.get("message", "ML model is not ready")}), 503

    try:
        data = request.get_json(silent=True) or {}
        print("Booking request received:", data)
        validation_error = validate_booking_payload(data, require_contact=True)
        if validation_error:
            return jsonify({"success": False, "message": validation_error}), 400

        booking_summary = build_queue_summary(data, persist=True)
        return jsonify({"success": True, "booking": booking_summary}), 201
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"success": False, "message": f"Booking failed: {exc}"}), 500


@app.route("/api/bookings/<booking_id>", methods=["GET"])
def api_get_booking(booking_id: str):
    bookings_df = load_bookings_df()
    matched = bookings_df[bookings_df["booking_id"].astype(str).eq(str(booking_id))]
    if matched.empty:
        return jsonify({"success": False, "message": "Booking not found"}), 404

    return jsonify({"success": True, "booking": booking_row_to_summary(matched.iloc[0])}), 200


@app.route("/api/admin/doctor-profiles", methods=["GET"])
def api_admin_doctor_profiles():
    return jsonify({"success": True, "doctors": DOCTOR_PROFILES}), 200


@app.route("/api/admin/appointments", methods=["GET"])
def api_admin_appointments():
    bookings_df = load_bookings_df()

    doctor_name = str(request.args.get("doctor_name", "")).strip()
    clinic_name = str(request.args.get("clinic_name", "")).strip()
    appointment_date = str(request.args.get("appointment_date", "")).strip()

    if doctor_name:
        bookings_df = bookings_df[bookings_df["doctor_name"].astype(str).eq(doctor_name)]
    if clinic_name:
        bookings_df = bookings_df[bookings_df["clinic_name"].astype(str).eq(clinic_name)]
    if appointment_date:
        bookings_df = bookings_df[bookings_df["appointment_date"].astype(str).eq(appointment_date)]

    bookings_df = bookings_df.sort_values(by=["appointment_date", "time_slot", "queue_position"], ascending=[True, True, True])
    # Drop duplicate booking IDs to prevent repeated rows in admin view for legacy data.
    bookings_df = bookings_df.drop_duplicates(subset=["booking_id"], keep="first")
    appointments = [booking_row_to_summary(row) for _, row in bookings_df.iterrows()]
    return jsonify({"success": True, "appointments": appointments}), 200


@app.route("/api/reschedule", methods=["POST", "OPTIONS"])
def api_reschedule():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}
        additional_delay = int(data.get("additional_delay_minutes", data.get("additional_doctor_delay", 0)))
        doctor_name = str(data.get("doctor_name", "")).strip()
        clinic_name = str(data.get("clinic_name", "")).strip()
        appointment_date = str(data.get("appointment_date", "")).strip()

        bookings_df = load_bookings_df()
        if doctor_name:
            bookings_df = bookings_df[bookings_df["doctor_name"].astype(str).eq(doctor_name)]
        if clinic_name:
            bookings_df = bookings_df[bookings_df["clinic_name"].astype(str).eq(clinic_name)]
        if appointment_date:
            bookings_df = bookings_df[bookings_df["appointment_date"].astype(str).eq(appointment_date)]

        if bookings_df.empty:
            return jsonify({"success": False, "message": "No upcoming appointments found to reschedule"}), 404

        updated_subset = apply_dynamic_rescheduling(bookings_df.copy(), additional_delay)
        full_df = load_bookings_df()

        for _, row in updated_subset.iterrows():
            booking_id = str(row.get("booking_id", "")).strip()
            if not booking_id:
                continue
            booking_mask = full_df["booking_id"].astype(str).eq(booking_id)
            if not booking_mask.any():
                continue

            new_waiting_time = float(row["predicted_waiting_time"])
            full_df.loc[booking_mask, "predicted_waiting_time"] = new_waiting_time

            for idx in full_df.index[booking_mask]:
                appointment_date_raw = str(full_df.at[idx, "appointment_date"]).strip()
                time_slot_raw = str(full_df.at[idx, "time_slot"]).strip()
                appointment_date_value = parse_appointment_date(appointment_date_raw)
                time_value = parse_time_slot(time_slot_raw)
                appointment_timestamp = appointment_date_value.replace(
                    hour=time_value.hour,
                    minute=time_value.minute,
                    second=0,
                    microsecond=0,
                )
                full_df.at[idx, "expected_consultation_time"] = format_clock(
                    appointment_timestamp + timedelta(minutes=new_waiting_time)
                )

        save_bookings_df(full_df)
        return jsonify(
            {
                "success": True,
                "additional_delay_minutes": additional_delay,
                "updated_appointments": full_df.to_dict(orient="records"),
            }
        ), 200
    except Exception as exc:
        return jsonify({"success": False, "message": f"Rescheduling failed: {exc}"}), 500


@app.route("/api/ml-status", methods=["GET"])
def ml_status():
    return jsonify({"success": True, "ml": ML_STATUS}), 200


@app.route("/login", methods=["POST", "OPTIONS"])
def mobile_login():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}
        username = str(data.get("username", data.get("email", ""))).strip()
        password = str(data.get("password", ""))

        if not username or not password:
            return jsonify({"success": False, "message": "Invalid login credentials"}), 401

        users_df = load_users_df()
        username_normalized = username.lower()
        matched = users_df[
            (
                users_df["Email"].astype(str).str.strip().str.lower().eq(username_normalized)
                | users_df["FullName"].astype(str).str.strip().str.lower().eq(username_normalized)
            )
            & users_df["Password"].astype(str).eq(password)
        ]

        if matched.empty:
            return jsonify({"success": False, "message": "Invalid login credentials"}), 401

        row = matched.iloc[0]
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        "username": str(row["FullName"]),
                        "email": str(row["Email"]),
                        "phone": str(row["Phone"]),
                    },
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"success": False, "message": f"Server error: {exc}"}), 500


@app.route("/predict-waiting-time", methods=["POST", "OPTIONS"])
def mobile_predict_waiting_time():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}

        if all(
            key in data
            for key in ["clinic_name", "doctor_name", "appointment_date", "time_slot", "medical_problem"]
        ):
            preview_payload = {
                "booking_id": "PREVIEW",
                "name": str(data.get("name", "Preview Patient")).strip() or "Preview Patient",
                "phone_number": str(data.get("phone_number", "0123456789")).strip() or "0123456789",
                "email": str(data.get("email", "preview@example.com")).strip() or "preview@example.com",
                "medical_problem": str(data.get("medical_problem", "General Consultation")).strip() or "General Consultation",
                "clinic_name": str(data.get("clinic_name", "")).strip(),
                "doctor_name": str(data.get("doctor_name", "")).strip(),
                "appointment_date": str(data.get("appointment_date", "")).strip(),
                "time_slot": str(data.get("time_slot", "")).strip(),
                "priority_booking": bool(data.get("priority_booking", False)),
            }
            prediction = build_queue_summary(preview_payload, persist=False)
            return jsonify({"success": True, "prediction": prediction}), 200

        patients_ahead = int(data.get("patients_ahead", 0) or 0)
        avg_consult_time = int(data.get("avg_consult_time", 10) or 10)
        delay_minutes = int(data.get("delay_minutes", 0) or 0)
        queue_position = int(data.get("queue_position", patients_ahead + 1) or (patients_ahead + 1))

        predicted_waiting_time = max((patients_ahead * avg_consult_time) + delay_minutes, 0)
        expected_consultation_time = format_clock(datetime.now() + timedelta(minutes=predicted_waiting_time))

        return (
            jsonify(
                {
                    "success": True,
                    "prediction": {
                        "queuePosition": queue_position,
                        "patientsAhead": patients_ahead,
                        "predictedWait": predicted_waiting_time,
                        "expectedConsultation": expected_consultation_time,
                    },
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"success": False, "message": f"Prediction failed: {exc}"}), 500


@app.route("/get-queue-status", methods=["GET"])
def mobile_get_queue_status():
    booking_id = str(request.args.get("booking_id", "")).strip()
    if not booking_id:
        return jsonify({"success": False, "message": "booking_id is required"}), 400

    bookings_df = load_bookings_df()
    matched = bookings_df[bookings_df["booking_id"].astype(str).eq(booking_id)]
    if matched.empty:
        return jsonify({"success": False, "message": "Booking not found"}), 404

    record = matched.iloc[0]
    summary = booking_row_to_summary(record)
    return (
        jsonify(
            {
                "success": True,
                "booking_id": summary["bookingId"],
                "queue_position": summary["queuePosition"],
                "patients_ahead": summary["patientsAhead"],
                "waiting_minutes": summary["predictedWait"],
                "expected_consultation_time": summary["expectedConsultation"],
                "status": str(record.get("status", "Booked")),
            }
        ),
        200,
    )


@app.route("/booking-history", methods=["GET"])
def mobile_booking_history():
    email = str(request.args.get("email", "")).strip().lower()
    username = str(request.args.get("username", "")).strip().lower()

    if not email and not username:
        return jsonify({"success": False, "message": "email or username is required"}), 400

    bookings_df = load_bookings_df()
    if email:
        bookings_df = bookings_df[bookings_df["email"].astype(str).str.strip().str.lower().eq(email)]
    else:
        bookings_df = bookings_df[bookings_df["patient_name"].astype(str).str.strip().str.lower().eq(username)]

    bookings_df = bookings_df.sort_values(by=["appointment_date", "time_slot"], ascending=[False, False])
    history = [booking_row_to_summary(row) for _, row in bookings_df.iterrows()]

    today = datetime.now().strftime("%Y-%m-%d")
    upcoming = [item for item in history if str(item.get("bookingDate", "")) >= today]
    return jsonify({"success": True, "history": history, "upcoming": upcoming}), 200


@app.route("/chatbot", methods=["POST", "OPTIONS"])
def mobile_chatbot():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    try:
        data = request.get_json(silent=True) or {}
        text = str(data.get("message", "")).strip().lower()
        if not text:
            return jsonify({"success": False, "message": "message is required"}), 400

        chatbot_rules = [
            (["chest pain", "heart pain", "bp", "hypertension"], "Cardiologist", "Chest symptoms need urgent cardiology review."),
            (["skin", "rash", "acne", "allergy"], "Dermatologist", "Avoid triggers and consult a dermatologist for persistent issues."),
            (["fracture", "joint", "knee", "back pain"], "Orthopedic", "Limit movement and consult an orthopedic specialist."),
            (["tooth", "gum"], "Dentist", "Dental pain should be evaluated by a dentist soon."),
            (["anxiety", "stress", "panic", "mental"], "Psychiatrist", "Mental health symptoms improve with early specialist support."),
            (["pregnancy", "period"], "Gynecologist", "Consult a gynecologist for personalized care and follow-up."),
            (["kidney", "urine", "uti"], "Nephrologist", "Hydrate and see a nephrologist for proper assessment."),
            (["eye", "vision"], "Ophthalmologist", "Eye symptoms should be examined by an ophthalmologist."),
            (["ear", "hearing"], "ENT Specialist", "ENT specialists can diagnose ear and hearing issues accurately."),
            (["child", "baby", "infant"], "Pediatrician", "For child symptoms, pediatric consultation is recommended."),
            (["diabetes", "thyroid", "weight loss"], "Endocrinologist", "Endocrine symptoms need a specialist evaluation and tests."),
            (["fever", "cold", "cough", "headache", "dizziness", "fatigue", "vomiting", "diarrhea"], "General Physician", "Monitor hydration and rest. See a physician if symptoms persist."),
        ]

        specialization = "General Physician"
        advice = "Consult a general physician for a full assessment."
        for keywords, spec, rule_advice in chatbot_rules:
            if any(keyword in text for keyword in keywords):
                specialization = spec
                advice = rule_advice
                break

        matching_doctors = [d for d in DOCTOR_PROFILES if str(d.get("specialization", "")) == specialization]
        selected_doctor = matching_doctors[0] if matching_doctors else DOCTOR_PROFILES[0]

        return (
            jsonify(
                {
                    "success": True,
                    "recommended_doctor": {
                        "name": selected_doctor["doctor_name"],
                        "clinic": selected_doctor["clinic_name"],
                        "specialization": selected_doctor["specialization"],
                    },
                    "advice": advice,
                }
            ),
            200,
        )
    except Exception as exc:
        return jsonify({"success": False, "message": f"Chatbot failed: {exc}"}), 500


ensure_ml_assets()
ensure_users_file()
ensure_bookings_file()


if __name__ == "__main__":
    ensure_ml_assets()
    ensure_users_file()
    ensure_bookings_file()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=False)
