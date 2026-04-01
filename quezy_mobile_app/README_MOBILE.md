# QUEZY Mobile (Kivy Android)

This mobile app connects to the existing Flask backend and keeps the current CSV/Excel storage.

## 1. Backend First (Windows PowerShell)

From workspace root:

```powershell
cd backend
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

## 2. Run Mobile App Locally (Desktop test)

In a new terminal:

```powershell
cd quezy_mobile_app
pip install -r requirements.txt
python main.py
```

## 3. Build Android APK (Recommended via WSL on Windows)

Buildozer Android builds are Linux-based. On Windows, use WSL Ubuntu.

### 3.1 Open WSL and install build prerequisites

```bash
sudo apt update
sudo apt install -y python3-pip git zip unzip openjdk-17-jdk
pip3 install --user --upgrade buildozer cython
```

### 3.2 Go to project and install Python deps

```bash
cd /mnt/c/Users/fazil/Desktop/'back up queue 1'/quezy_mobile_app
pip3 install --user -r requirements.txt
```

### 3.3 Initialize (skip if `buildozer.spec` already exists)

```bash
buildozer init
```

This project already includes a preconfigured `buildozer.spec` for:
- `kivy`
- `requests`
- `plyer`
- GPS + internet permissions

### 3.4 Build debug APK

```bash
buildozer android debug
```

## 4. Output APK Location

After a successful build, the debug APK is generated under:

- `quezy_mobile_app/bin/`

Typical file name:

- `quezy-0.1.0-arm64-v8a_armeabi-v7a-debug.apk`

## 5. Notes

- Keep Flask backend unchanged: CSV/Excel files continue as database.
- Mobile app endpoints used:
  - `/login`
  - `/predict-waiting-time`
  - `/api/bookings`
  - `/get-queue-status`
  - `/booking-history`
  - `/chatbot`
- If GPS permission is denied, clinics still load in default order.
