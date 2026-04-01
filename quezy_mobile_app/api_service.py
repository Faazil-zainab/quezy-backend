from __future__ import annotations

import webbrowser
from typing import Any

import requests

from config import BASE_URL, UPI_LINK

TIMEOUT_SECONDS = 20


def _request(method: str, path: str, json_data: dict[str, Any] | None = None, params: dict[str, Any] | None = None) -> dict[str, Any]:
    url = f"{BASE_URL}{path}"
    try:
        response = requests.request(
            method=method,
            url=url,
            json=json_data,
            params=params,
            timeout=TIMEOUT_SECONDS,
        )
        payload = response.json() if response.content else {}
        if response.ok:
            return payload
        return {
            "success": False,
            "message": payload.get("message", f"HTTP {response.status_code}"),
            "status_code": response.status_code,
        }
    except requests.RequestException as exc:
        return {"success": False, "message": f"Connection error: {exc}"}


def login_user(username: str, password: str) -> dict[str, Any]:
    payload = {"username": username, "password": password}
    response = _request("POST", "/login", json_data=payload)
    if response.get("success"):
        return response

    # Backward-compatible fallback to existing /api/login contract (email + password)
    fallback_payload = {"email": username, "password": password}
    fallback = _request("POST", "/api/login", json_data=fallback_payload)
    if fallback.get("success"):
        return {
            "success": True,
            "message": fallback.get("message", "Login successful"),
            "user": {
                "username": username.split("@")[0] if "@" in username else username,
                "email": username,
                "phone": "",
            },
        }
    return response


def fetch_doctor_profiles() -> dict[str, Any]:
    return _request("GET", "/api/admin/doctor-profiles")


def predict_wait_time(data: dict[str, Any]) -> dict[str, Any]:
    response = _request("POST", "/predict-waiting-time", json_data=data)
    if response.get("success"):
        return response
    return _request("POST", "/api/predict-wait-time", json_data=data)


def create_booking(data: dict[str, Any]) -> dict[str, Any]:
    return _request("POST", "/api/bookings", json_data=data)


def get_queue_status(booking_id: str) -> dict[str, Any]:
    response = _request("GET", "/get-queue-status", params={"booking_id": booking_id})
    if response.get("success"):
        return response

    fallback = _request("GET", f"/api/bookings/{booking_id}")
    if not fallback.get("success"):
        return fallback

    booking = fallback.get("booking", {})
    return {
        "success": True,
        "booking_id": booking.get("bookingId", booking_id),
        "queue_position": booking.get("queuePosition", 0),
        "patients_ahead": booking.get("patientsAhead", 0),
        "waiting_minutes": booking.get("predictedWait", 0),
        "expected_consultation_time": booking.get("expectedConsultation", "--"),
        "status": "Booked",
    }


def get_booking_history(email: str = "", username: str = "") -> dict[str, Any]:
    params: dict[str, Any] = {}
    if email:
        params["email"] = email
    if username:
        params["username"] = username
    return _request("GET", "/booking-history", params=params)


def chatbot_query(message: str) -> dict[str, Any]:
    return _request("POST", "/chatbot", json_data={"message": message})


def open_google_pay() -> None:
    webbrowser.open(UPI_LINK)
