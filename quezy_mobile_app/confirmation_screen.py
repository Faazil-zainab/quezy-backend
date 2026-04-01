from __future__ import annotations

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import Screen

from api_service import open_google_pay


class ConfirmationScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        root = BoxLayout(orientation="vertical", padding=16, spacing=10)
        root.add_widget(Label(text="Booking Confirmation", font_size=24, size_hint_y=None, height=44))

        self.booking_id = Label(text="Booking ID: --", size_hint_y=None, height=32)
        self.queue_pos = Label(text="Queue Position: --", size_hint_y=None, height=32)
        self.patients_ahead = Label(text="Patients Ahead: --", size_hint_y=None, height=32)
        self.predicted_wait = Label(text="Predicted Wait: --", size_hint_y=None, height=32)
        self.expected_time = Label(text="Expected Consultation: --", size_hint_y=None, height=32)

        pay_button = Button(text="Pay with Google Pay", size_hint_y=None, height=44)
        pay_button.bind(on_press=lambda _x: open_google_pay())

        queue_button = Button(text="Go to Queue Status", size_hint_y=None, height=44)
        queue_button.bind(on_press=lambda _x: self._go_queue_status())

        profile_button = Button(text="View Profile", size_hint_y=None, height=44)
        profile_button.bind(on_press=lambda _x: self._go_profile())

        new_booking_button = Button(text="Book Another", size_hint_y=None, height=44)
        new_booking_button.bind(on_press=lambda _x: self._book_another())

        self.status_label = Label(text="", size_hint_y=None, height=40)

        for widget in [
            self.booking_id,
            self.queue_pos,
            self.patients_ahead,
            self.predicted_wait,
            self.expected_time,
            pay_button,
            queue_button,
            profile_button,
            new_booking_button,
            self.status_label,
        ]:
            root.add_widget(widget)

        self.add_widget(root)

    def on_pre_enter(self, *args):
        app = App.get_running_app()
        booking = getattr(app, "selected_booking", {})

        self.booking_id.text = f"Booking ID: {booking.get('bookingId', '--')}"
        self.queue_pos.text = f"Queue Position: {booking.get('queuePosition', '--')}"
        self.patients_ahead.text = f"Patients Ahead: {booking.get('patientsAhead', '--')}"
        self.predicted_wait.text = f"Predicted Wait: {booking.get('predictedWait', '--')} min"
        self.expected_time.text = f"Expected Consultation: {booking.get('expectedConsultation', '--')}"
        self.status_label.text = ""
        return super().on_pre_enter(*args)

    def _go_queue_status(self):
        app = App.get_running_app()
        if not getattr(app, "selected_booking", {}).get("bookingId"):
            self.status_label.text = "No booking found"
            return
        self.manager.current = "queue_status"

    def _go_profile(self):
        self.manager.current = "profile"

    def _book_another(self):
        self.manager.current = "booking"
