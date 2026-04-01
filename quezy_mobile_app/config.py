from __future__ import annotations

import os
from datetime import datetime, timedelta

BASE_URL = os.getenv("QUEZY_API_BASE_URL", "https://your-backend-domain.onrender.com").rstrip("/")
QUEUE_REFRESH_SECONDS = 30
UPI_LINK = "upi://pay?pa=faazil3468@oksbi"

MEDICAL_PROBLEMS = [
    "Fever",
    "Cold",
    "Cough",
    "Headache",
    "Body Pain",
    "Stomach Pain",
    "Vomiting",
    "Diarrhea",
    "Chest Pain",
    "Breathing Difficulty",
    "Skin Allergy",
    "Acne",
    "Skin Rash",
    "Hair Loss",
    "Fracture",
    "Joint Pain",
    "Back Pain",
    "Knee Pain",
    "Child Fever",
    "Child Cold",
    "Heart Pain",
    "High Blood Pressure",
    "Anxiety",
    "Diabetes",
    "Thyroid Problem",
    "Eye Irritation",
    "Blurred Vision",
    "Ear Pain",
    "Hearing Issue",
    "Tooth Pain",
    "Gum Bleeding",
    "Mental Stress",
    "Pregnancy Check",
    "Period Pain",
    "Kidney Pain",
    "Urine Infection",
    "Seasonal Allergy",
    "Fatigue",
    "Dizziness",
    "Unexplained Weight Loss",
]

CLINIC_COORDINATES = {
    "Apollo Clinic - Adyar": (13.0067, 80.2577),
    "Apollo Clinic - Velachery": (12.9777, 80.2215),
    "Fortis Medical Center - T Nagar": (13.0418, 80.2337),
    "Kauvery Hospital - Alwarpet": (13.0399, 80.2532),
    "MIOT International - Manapakkam": (13.0234, 80.1756),
    "Global Hospitals - Perumbakkam": (12.9009, 80.2088),
    "SIMS Hospital - Vadapalani": (13.0509, 80.2127),
    "Vijaya Hospital - Vadapalani": (13.0517, 80.2092),
    "Prashanth Hospital - Velachery": (12.9802, 80.2184),
    "Dr. Kamakshi Hospital - Pallikaranai": (12.9432, 80.2098),
    "SRM Hospital - Potheri": (12.8231, 80.0428),
    "Rela Institute - Chromepet": (12.9636, 80.1381),
}


def generate_date_options(days: int = 14) -> list[str]:
    today = datetime.now().date()
    return [(today + timedelta(days=i)).isoformat() for i in range(days)]


def generate_time_slots(start_hour: int = 8, end_hour: int = 21) -> list[str]:
    slots: list[str] = []
    for hour in range(start_hour, end_hour + 1):
        for minute in (0, 30):
            suffix = "AM" if hour < 12 else "PM"
            hour12 = 12 if hour % 12 == 0 else hour % 12
            slots.append(f"{hour12}:{minute:02d} {suffix}")
    return slots
