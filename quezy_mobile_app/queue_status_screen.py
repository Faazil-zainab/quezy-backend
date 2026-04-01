from __future__ import annotations

from kivy.app import App
from kivy.clock import Clock
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import Screen

from api_service import get_queue_status
from config import QUEUE_REFRESH_SECONDS


class QueueStatusScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._refresh_event = None

        root = BoxLayout(orientation="vertical", padding=16, spacing=10)
        root.add_widget(Label(text="Live Queue Status", font_size=24, size_hint_y=None, height=44))

        self.booking_id_label = Label(text="Booking ID: --", size_hint_y=None, height=32)
        self.queue_pos_label = Label(text="Queue Position: --", size_hint_y=None, height=32)
        self.patients_ahead_label = Label(text="Patients Ahead: --", size_hint_y=None, height=32)
        self.waiting_minutes_label = Label(text="Predicted Waiting Time: -- min", size_hint_y=None, height=32)
        self.expected_time_label = Label(text="Expected Consultation Time: --", size_hint_y=None, height=32)
        self.status_label = Label(text="", size_hint_y=None, height=40)

        refresh_button = Button(text="Refresh Now", size_hint_y=None, height=44)
        refresh_button.bind(on_press=lambda _x: self.refresh_queue_status())

        back_button = Button(text="Back to Confirmation", size_hint_y=None, height=44)
        back_button.bind(on_press=lambda _x: self._go_back())

        for widget in [
            self.booking_id_label,
            self.queue_pos_label,
            self.patients_ahead_label,
            self.waiting_minutes_label,
            self.expected_time_label,
            refresh_button,
            back_button,
            self.status_label,
        ]:
            root.add_widget(widget)

        self.add_widget(root)

    def on_pre_enter(self, *args):
        self.refresh_queue_status()
        if self._refresh_event is None:
            self._refresh_event = Clock.schedule_interval(self.refresh_queue_status, QUEUE_REFRESH_SECONDS)
        return super().on_pre_enter(*args)

    def on_leave(self, *args):
        if self._refresh_event is not None:
            self._refresh_event.cancel()
            self._refresh_event = None
        return super().on_leave(*args)

    def refresh_queue_status(self, *_args):
        app = App.get_running_app()
        booking = getattr(app, "selected_booking", {})
        booking_id = booking.get("bookingId")
        if not booking_id:
            self.status_label.text = "No booking selected"
            return

        result = get_queue_status(booking_id)
        if not result.get("success"):
            self.status_label.text = result.get("message", "Unable to fetch queue status")
            return

        self.booking_id_label.text = f"Booking ID: {result.get('booking_id', '--')}"
        self.queue_pos_label.text = f"Queue Position: {result.get('queue_position', '--')}"
        self.patients_ahead_label.text = f"Patients Ahead: {result.get('patients_ahead', '--')}"
        self.waiting_minutes_label.text = f"Predicted Waiting Time: {result.get('waiting_minutes', '--')} min"
        self.expected_time_label.text = (
            f"Expected Consultation Time: {result.get('expected_consultation_time', '--')}"
        )
        self.status_label.text = "Queue updated"

    def _go_back(self):
        self.manager.current = "confirmation"
