from __future__ import annotations

from kivy.app import App
from kivy.uix.screenmanager import ScreenManager

from booking_screen import BookingScreen
from confirmation_screen import ConfirmationScreen
from login_screen import LoginScreen
from profile_screen import ProfileScreen
from queue_status_screen import QueueStatusScreen


class QuezyApp(App):
    def build(self):
        self.title = "QUEZY Mobile"
        self.current_user: dict = {}
        self.selected_booking: dict = {}
        self.last_prediction: dict = {}
        self.doctor_profiles: list[dict] = []

        manager = ScreenManager()
        manager.add_widget(LoginScreen(name="login"))
        manager.add_widget(BookingScreen(name="booking"))
        manager.add_widget(ConfirmationScreen(name="confirmation"))
        manager.add_widget(QueueStatusScreen(name="queue_status"))
        manager.add_widget(ProfileScreen(name="profile"))
        manager.current = "login"
        return manager


if __name__ == "__main__":
    QuezyApp().run()
