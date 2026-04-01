from __future__ import annotations

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import Screen
from kivy.uix.textinput import TextInput

from api_service import login_user


class LoginScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        root = BoxLayout(orientation="vertical", padding=24, spacing=12)
        root.add_widget(Label(text="QUEZY Login", font_size=28, size_hint_y=None, height=50))

        self.username_input = TextInput(
            hint_text="Username or Email",
            multiline=False,
            size_hint_y=None,
            height=48,
        )
        self.password_input = TextInput(
            hint_text="Password",
            password=True,
            multiline=False,
            size_hint_y=None,
            height=48,
        )

        login_button = Button(text="Login", size_hint_y=None, height=48)
        login_button.bind(on_press=self.on_login)

        self.status_label = Label(text="", color=(1, 0.3, 0.3, 1), size_hint_y=None, height=42)

        root.add_widget(self.username_input)
        root.add_widget(self.password_input)
        root.add_widget(login_button)
        root.add_widget(self.status_label)
        self.add_widget(root)

    def on_login(self, _instance):
        username = self.username_input.text.strip()
        password = self.password_input.text

        if not username or not password:
            self.status_label.text = "Invalid login credentials"
            return

        result = login_user(username, password)
        if not result.get("success"):
            self.status_label.text = "Invalid login credentials"
            return

        app = App.get_running_app()
        user = result.get("user", {})
        app.current_user = {
            "username": user.get("username") or username,
            "email": user.get("email") or (username if "@" in username else ""),
            "phone": user.get("phone", ""),
        }

        self.password_input.text = ""
        self.status_label.text = ""
        self.manager.current = "booking"
