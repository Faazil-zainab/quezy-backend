from __future__ import annotations

from math import atan2, cos, radians, sin, sqrt

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import Screen
from kivy.uix.scrollview import ScrollView
from kivy.uix.spinner import Spinner
from kivy.uix.textinput import TextInput

from api_service import (
    chatbot_query,
    create_booking,
    fetch_doctor_profiles,
    open_google_pay,
    predict_wait_time,
)
from config import CLINIC_COORDINATES, MEDICAL_PROBLEMS, generate_date_options, generate_time_slots

try:
    from plyer import gps  # type: ignore

    GPS_AVAILABLE = True
except Exception:
    gps = None
    GPS_AVAILABLE = False

PROBLEM_TO_SPECIALIZATION = {
    "Fever": "General Physician",
    "Cold": "General Physician",
    "Cough": "General Physician",
    "Headache": "General Physician",
    "Body Pain": "General Physician",
    "Stomach Pain": "General Physician",
    "Vomiting": "General Physician",
    "Diarrhea": "General Physician",
    "Chest Pain": "Cardiologist",
    "Breathing Difficulty": "General Physician",
    "Skin Allergy": "Dermatologist",
    "Acne": "Dermatologist",
    "Skin Rash": "Dermatologist",
    "Hair Loss": "Dermatologist",
    "Fracture": "Orthopedic",
    "Joint Pain": "Orthopedic",
    "Back Pain": "Orthopedic",
    "Knee Pain": "Orthopedic",
    "Child Fever": "Pediatrician",
    "Child Cold": "Pediatrician",
    "Heart Pain": "Cardiologist",
    "High Blood Pressure": "Cardiologist",
    "Anxiety": "Psychiatrist",
    "Diabetes": "Endocrinologist",
    "Thyroid Problem": "Endocrinologist",
    "Eye Irritation": "Ophthalmologist",
    "Blurred Vision": "Ophthalmologist",
    "Ear Pain": "ENT Specialist",
    "Hearing Issue": "ENT Specialist",
    "Tooth Pain": "Dentist",
    "Gum Bleeding": "Dentist",
    "Mental Stress": "Psychiatrist",
    "Pregnancy Check": "Gynecologist",
    "Period Pain": "Gynecologist",
    "Kidney Pain": "Nephrologist",
    "Urine Infection": "Nephrologist",
    "Seasonal Allergy": "General Physician",
    "Fatigue": "General Physician",
    "Dizziness": "General Physician",
    "Unexplained Weight Loss": "Endocrinologist",
}


class BookingScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.clinic_doctors: dict[str, list[dict]] = {}
        self._gps_started = False

        root = BoxLayout(orientation="vertical", padding=12, spacing=10)
        title = Label(text="Book Appointment", size_hint_y=None, height=40, font_size=24)
        root.add_widget(title)

        scroll = ScrollView()
        content = BoxLayout(orientation="vertical", spacing=10, size_hint_y=None)
        content.bind(minimum_height=content.setter("height"))

        self.name_input = TextInput(hint_text="Full Name", multiline=False, size_hint_y=None, height=44)
        self.email_input = TextInput(hint_text="Email", multiline=False, size_hint_y=None, height=44)
        self.phone_input = TextInput(hint_text="Phone Number", multiline=False, size_hint_y=None, height=44)

        self.problem_spinner = Spinner(
            text="Select Problem",
            values=MEDICAL_PROBLEMS,
            size_hint_y=None,
            height=44,
        )
        self.clinic_spinner = Spinner(text="Select Nearby Clinic", values=(), size_hint_y=None, height=44)
        self.doctor_spinner = Spinner(text="Select Doctor", values=(), size_hint_y=None, height=44)
        self.date_spinner = Spinner(text="Select Date", values=generate_date_options(), size_hint_y=None, height=44)
        self.time_spinner = Spinner(text="Select Time Slot", values=generate_time_slots(), size_hint_y=None, height=44)

        self.queue_label = Label(text="Queue position: --", size_hint_y=None, height=30)
        self.wait_label = Label(text="Predicted waiting time: -- min", size_hint_y=None, height=30)
        self.consult_label = Label(text="Expected consultation time: --", size_hint_y=None, height=30)

        predict_button = Button(text="Predict Waiting Time", size_hint_y=None, height=44)
        predict_button.bind(on_press=self.request_prediction)

        self.chat_input = TextInput(hint_text="Ask symptom question for doctor advice", multiline=False, size_hint_y=None, height=44)
        chat_button = Button(text="Ask Chatbot", size_hint_y=None, height=42)
        chat_button.bind(on_press=self.ask_chatbot)
        self.chat_result = Label(text="", size_hint_y=None, height=60)

        pay_button = Button(text="Open Google Pay", size_hint_y=None, height=44)
        pay_button.bind(on_press=lambda _x: open_google_pay())

        book_button = Button(text="Confirm Booking", size_hint_y=None, height=48)
        book_button.bind(on_press=self.confirm_booking)

        profile_button = Button(text="View Profile", size_hint_y=None, height=44)
        profile_button.bind(on_press=lambda _x: self._go_profile())

        self.status_label = Label(text="", size_hint_y=None, height=52, color=(1, 0.2, 0.2, 1))

        for widget in [
            self.name_input,
            self.email_input,
            self.phone_input,
            self.problem_spinner,
            self.clinic_spinner,
            self.doctor_spinner,
            self.date_spinner,
            self.time_spinner,
            predict_button,
            self.queue_label,
            self.wait_label,
            self.consult_label,
            self.chat_input,
            chat_button,
            self.chat_result,
            pay_button,
            book_button,
            profile_button,
            self.status_label,
        ]:
            content.add_widget(widget)

        scroll.add_widget(content)
        root.add_widget(scroll)
        self.add_widget(root)

        self.problem_spinner.bind(text=self._on_problem_or_clinic_change)
        self.clinic_spinner.bind(text=self._on_problem_or_clinic_change)
        self.doctor_spinner.bind(text=self._on_doctor_selected)

    def on_pre_enter(self, *args):
        self._prefill_user_fields()
        self._load_clinic_and_doctor_data()
        self._start_gps_if_available()
        self.status_label.text = ""
        return super().on_pre_enter(*args)

    def _prefill_user_fields(self):
        app = App.get_running_app()
        user = getattr(app, "current_user", {})
        self.name_input.text = user.get("username", "")
        self.email_input.text = user.get("email", "")
        self.phone_input.text = user.get("phone", "")

    def _load_clinic_and_doctor_data(self):
        app = App.get_running_app()
        if getattr(app, "doctor_profiles", None):
            self._hydrate_clinic_map(app.doctor_profiles)
            return

        result = fetch_doctor_profiles()
        if not result.get("success"):
            self.status_label.text = result.get("message", "Unable to load clinics")
            return

        app.doctor_profiles = result.get("doctors", [])
        self._hydrate_clinic_map(app.doctor_profiles)

    def _hydrate_clinic_map(self, doctors: list[dict]):
        clinic_map: dict[str, list[dict]] = {}
        for doctor in doctors:
            clinic_name = str(doctor.get("clinic_name", "")).strip()
            if not clinic_name:
                continue
            clinic_map.setdefault(clinic_name, []).append(doctor)

        self.clinic_doctors = clinic_map
        clinics = sorted(clinic_map.keys())
        self.clinic_spinner.values = clinics
        if clinics and self.clinic_spinner.text not in clinics:
            self.clinic_spinner.text = clinics[0]
        self._update_doctor_spinner()

    def _on_problem_or_clinic_change(self, *_args):
        self._update_doctor_spinner()

    def _update_doctor_spinner(self):
        clinic_name = self.clinic_spinner.text
        problem = self.problem_spinner.text
        doctors = self.clinic_doctors.get(clinic_name, [])

        specialization = PROBLEM_TO_SPECIALIZATION.get(problem, "")
        if specialization:
            doctors = [d for d in doctors if d.get("specialization") == specialization] or doctors

        labels = [f"{d['doctor_name']} ({d['specialization']})" for d in doctors]
        self.doctor_spinner.values = labels
        self.doctor_spinner.text = labels[0] if labels else "Select Doctor"

    def _on_doctor_selected(self, *_args):
        if self.doctor_spinner.text != "Select Doctor":
            self.request_prediction()

    def _selected_doctor_profile(self) -> dict | None:
        clinic_name = self.clinic_spinner.text
        doctor_label = self.doctor_spinner.text
        doctor_name = doctor_label.split(" (")[0].strip()

        for doctor in self.clinic_doctors.get(clinic_name, []):
            if str(doctor.get("doctor_name", "")).strip() == doctor_name:
                return doctor
        return None

    def request_prediction(self, *_args):
        doctor = self._selected_doctor_profile()
        if not doctor:
            self.status_label.text = "Please select clinic and doctor"
            return

        if self.problem_spinner.text == "Select Problem" or self.date_spinner.text == "Select Date" or self.time_spinner.text == "Select Time Slot":
            self.status_label.text = "Please select problem, date, and time"
            return

        payload = {
            "name": self.name_input.text.strip() or "Preview Patient",
            "phone_number": self.phone_input.text.strip() or "0123456789",
            "email": self.email_input.text.strip() or "preview@example.com",
            "medical_problem": self.problem_spinner.text,
            "clinic_name": self.clinic_spinner.text,
            "doctor_name": str(doctor.get("doctor_name", "")),
            "appointment_date": self.date_spinner.text,
            "time_slot": self.time_spinner.text,
            "patients_ahead": 0,
            "avg_consult_time": int(doctor.get("avg_consultation_time", 10)),
            "delay_minutes": 0,
        }

        result = predict_wait_time(payload)
        if not result.get("success"):
            self.status_label.text = result.get("message", "Prediction failed")
            return

        prediction = result.get("prediction", {})
        queue_pos = prediction.get("queuePosition", prediction.get("queue_position", "--"))
        wait_min = prediction.get("predictedWait", prediction.get("predicted_waiting_time", "--"))
        consult_time = prediction.get("expectedConsultation", prediction.get("expected_consultation_time", "--"))

        self.queue_label.text = f"Queue position: {queue_pos}"
        self.wait_label.text = f"Predicted waiting time: {wait_min} min"
        self.consult_label.text = f"Expected consultation time: {consult_time}"
        self.status_label.text = "Prediction updated"

        app = App.get_running_app()
        app.last_prediction = {
            "queue_position": queue_pos,
            "patients_ahead": prediction.get("patientsAhead", prediction.get("patients_ahead", 0)),
            "waiting_minutes": wait_min,
            "expected_consultation_time": consult_time,
        }

    def confirm_booking(self, *_args):
        doctor = self._selected_doctor_profile()
        if not doctor:
            self.status_label.text = "Please select clinic and doctor"
            return

        name = self.name_input.text.strip()
        email = self.email_input.text.strip()
        phone = self.phone_input.text.strip()

        if not name or not email or not phone:
            self.status_label.text = "Name, email, and phone are required"
            return

        if self.problem_spinner.text == "Select Problem" or self.date_spinner.text == "Select Date" or self.time_spinner.text == "Select Time Slot":
            self.status_label.text = "Please complete appointment details"
            return

        payload = {
            "name": name,
            "phone_number": phone,
            "email": email,
            "medical_problem": self.problem_spinner.text,
            "clinic_name": self.clinic_spinner.text,
            "doctor_name": str(doctor.get("doctor_name", "")),
            "appointment_date": self.date_spinner.text,
            "time_slot": self.time_spinner.text,
            "priority_booking": False,
            "payment_method": "Google Pay",
            "coupon_code": "None",
            "coupon_discount": 0,
            "total_amount": 1200,
        }

        result = create_booking(payload)
        if not result.get("success"):
            self.status_label.text = result.get("message", "Booking failed")
            return

        booking = result.get("booking", {})
        app = App.get_running_app()
        app.selected_booking = booking
        self.status_label.text = "Booking successful"
        self.manager.current = "confirmation"

    def ask_chatbot(self, *_args):
        message = self.chat_input.text.strip()
        if not message:
            self.chat_result.text = "Enter a message for chatbot"
            return

        result = chatbot_query(message)
        if not result.get("success"):
            self.chat_result.text = result.get("message", "Chatbot unavailable")
            return

        doctor = result.get("recommended_doctor", {})
        advice = result.get("advice", "")
        clinic = doctor.get("clinic", "")
        doctor_name = doctor.get("name", "")
        self.chat_result.text = f"Recommended: {doctor_name} ({doctor.get('specialization', '')})\nAdvice: {advice}"

        if clinic in self.clinic_doctors:
            self.clinic_spinner.text = clinic
            self._update_doctor_spinner()
            for label in self.doctor_spinner.values:
                if label.startswith(doctor_name):
                    self.doctor_spinner.text = label
                    break

    def _go_profile(self):
        self.manager.current = "profile"

    def _start_gps_if_available(self):
        if self._gps_started or not GPS_AVAILABLE:
            return
        if not gps:
            return

        try:
            gps.configure(on_location=self._on_location, on_status=self._on_gps_status)
            gps.start(minTime=1000, minDistance=0)
            self._gps_started = True
        except Exception:
            self.status_label.text = "GPS unavailable. Showing default clinics"

    def _on_gps_status(self, stype: str, status: str):
        _ = (stype, status)

    def _on_location(self, **kwargs):
        try:
            user_lat = float(kwargs.get("lat"))
            user_lon = float(kwargs.get("lon"))
        except Exception:
            return

        clinics = list(self.clinic_doctors.keys())
        clinics.sort(key=lambda c: self._distance_to_clinic(user_lat, user_lon, c))
        self.clinic_spinner.values = clinics
        if clinics:
            self.clinic_spinner.text = clinics[0]
            self._update_doctor_spinner()
        self.status_label.text = "Nearby clinics sorted by current location"

        # One location sample is enough for sorting.
        try:
            if gps:
                gps.stop()
        except Exception:
            pass

    def _distance_to_clinic(self, lat: float, lon: float, clinic_name: str) -> float:
        if clinic_name not in CLINIC_COORDINATES:
            return 999999.0
        c_lat, c_lon = CLINIC_COORDINATES[clinic_name]
        return self._haversine_km(lat, lon, c_lat, c_lon)

    @staticmethod
    def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        radius = 6371.0
        d_lat = radians(lat2 - lat1)
        d_lon = radians(lon2 - lon1)
        a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return radius * c
