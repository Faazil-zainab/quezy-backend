from __future__ import annotations

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import Screen
from kivy.uix.scrollview import ScrollView

from api_service import get_booking_history


class ProfileScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        root = BoxLayout(orientation="vertical", padding=12, spacing=8)
        root.add_widget(Label(text="Profile", font_size=24, size_hint_y=None, height=44))

        self.username_label = Label(text="Username: --", size_hint_y=None, height=30)
        self.email_label = Label(text="Email: --", size_hint_y=None, height=30)
        self.phone_label = Label(text="Phone: --", size_hint_y=None, height=30)

        self.history_container = BoxLayout(orientation="vertical", spacing=6, size_hint_y=None)
        self.history_container.bind(minimum_height=self.history_container.setter("height"))
        history_scroll = ScrollView()
        history_scroll.add_widget(self.history_container)

        refresh_button = Button(text="Refresh History", size_hint_y=None, height=42)
        refresh_button.bind(on_press=lambda _x: self._load_history())

        back_button = Button(text="Back to Booking", size_hint_y=None, height=42)
        back_button.bind(on_press=lambda _x: self._go_booking())

        logout_button = Button(text="Logout", size_hint_y=None, height=42)
        logout_button.bind(on_press=lambda _x: self._logout())

        self.status_label = Label(text="", size_hint_y=None, height=38)

        for widget in [
            self.username_label,
            self.email_label,
            self.phone_label,
            refresh_button,
            history_scroll,
            back_button,
            logout_button,
            self.status_label,
        ]:
            root.add_widget(widget)

        self.add_widget(root)

    def on_pre_enter(self, *args):
        app = App.get_running_app()
        user = getattr(app, "current_user", {})
        self.username_label.text = f"Username: {user.get('username', '--')}"
        self.email_label.text = f"Email: {user.get('email', '--')}"
        self.phone_label.text = f"Phone: {user.get('phone', '--')}"
        self._load_history()
        return super().on_pre_enter(*args)

    def _load_history(self):
        app = App.get_running_app()
        user = getattr(app, "current_user", {})
        result = get_booking_history(email=user.get("email", ""), username=user.get("username", ""))

        self.history_container.clear_widgets()
        if not result.get("success"):
            self.status_label.text = result.get("message", "Unable to load booking history")
            return

        history = result.get("history", [])
        upcoming = result.get("upcoming", [])

        self.history_container.add_widget(
            Label(text=f"Upcoming Appointments: {len(upcoming)}", size_hint_y=None, height=28)
        )

        if not history:
            self.history_container.add_widget(Label(text="No booking history found.", size_hint_y=None, height=28))
            self.status_label.text = ""
            return

        self.history_container.add_widget(Label(text="Booking History", size_hint_y=None, height=28))
        for booking in history:
            booking_id = booking.get("bookingId", "--")
            clinic = booking.get("clinic", "--")
            doctor = booking.get("doctor", "--")
            date = booking.get("bookingDate", "--")
            time_slot = booking.get("timeSlot", "--")
            row = f"{booking_id} | {date} {time_slot} | {clinic} | {doctor}"
            self.history_container.add_widget(Label(text=row, size_hint_y=None, height=28))

        self.status_label.text = "History loaded"

    def _go_booking(self):
        self.manager.current = "booking"

    def _logout(self):
        app = App.get_running_app()
        app.current_user = {}
        app.selected_booking = {}
        app.last_prediction = {}
        self.manager.current = "login"
