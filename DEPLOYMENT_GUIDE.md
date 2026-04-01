# QUEZY Full Stack Deployment - Complete Guide

## ✅ What's Now Live & Ready

### 1. Backend API (Cloud) - LIVE ✅
**Status:** https://quezy-backend.onrender.com/health  
**Features:**
- Flask REST API running on Render
- ML-powered wait time predictions
- Doctor profiles & clinic management
- Booking system with real-time queue tracking

### 2. Original Kivy Mobile App
**Location:** `quezy_mobile_app/` folder
**Updated:** Now connected to cloud backend
**API URL:** Automatically uses `https://quezy-backend.onrender.com`

### 3. NEW Expo React Native Mobile App
**Location:** `quezy-mobile/` folder  
**Status:** Ready to build APK
**Design:** Matches your web UI exactly (booking form, clinics, doctors, time slots)

---

## 📱 Build Android APK - Two Options

### OPTION 1: Use New Expo React Native App (RECOMMENDED)
**Pros:** Modern, matches web design exactly, easier to maintain  
**Cons:** Need to learn React Native (but code is ready!)

#### Quick Start:
```bash
cd quezy-mobile
npm install
npm run android
```

Or build APK for distribution:
```bash
npm install -g eas-cli
eas login  # Free account at expo.dev
eas build -p android --profile preview
```

See [quezy-mobile/BUILD_APK.md](quezy-mobile/BUILD_APK.md) for full instructions.

### OPTION 2: Use Existing Kivy App
**Pros:** Already familiar with code  
**Cons:** Different UI than web

**File:** `quezy_mobile_app/buildozer.spec`

Current status:
- ✅ Configured for Android
- ✅ Connected to cloud backend  
- ✅ All APIs working

#### Build:
```bash
cd quezy_mobile_app
buildozer android release
```

APK output: `bin/quezy_mobile_app-*.apk`

---

## 🔧 Your 3-Tier Architecture

```
┌─────────────────────────────────────────┐
│     Android Phone (Your Users)          │
│  ┌───────────────────────────────────┐  │
│  │  Mobile App (APK)                 │  │
│  │  - Book appointments              │  │
│  │  - Check queue status             │  │
│  │  - View wait times                │  │
│  └──────────────┬──────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ HTTPS
                  ├─────────────────────────────────┐
                  ▼                                 ▼
    ┌──────────────────────────┐     ┌──────────────────────────┐
    │   Flask Backend (Cloud)  │     │   ML Models              │
    │   https://quezy-...      │     │   - Wait prediction      │
    │   render.com             │     │   - Queue optimization   │
    ├──────────────────────────┤     └──────────────────────────┘
    │   Endpoints:             │
    │   /api/register          │
    │   /api/login             │
    │   /api/bookings          │
    │   /predict-waiting-time  │
    │   /get-queue-status      │
    │   /booking-history       │
    └──────────────────────────┘
             │ Reads/Writes
             ▼
    ┌──────────────────────────┐
    │   Data Storage           │
    │   - users.xlsx           │
    │   - bookings.csv         │
    │   - ML models            │
    └──────────────────────────┘
```

---

## 📋 Your API Endpoints (Live)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/register` | POST | Register new user |
| `/login` | POST | Login (mobile) |
| `/api/bookings` | POST | Create booking |
| `/get-queue-status` | GET | Check queue position |
| `/booking-history` | GET | View past bookings |
| `/predict-waiting-time` | POST | ML wait prediction |
| `/api/admin/doctor-profiles` | GET | List doctors |

**Base URL:** `https://quezy-backend.onrender.com`

---

## 🚀 Next Immediate Steps

1. **Choose your mobile app:** Expo (recommended) or Kivy
2. **Build APK** following Option 1 or Option 2 above
3. **Test on Android phone:**
   - Log in / Register
   - Book appointment
   - Check queue status
   - See wait time prediction
4. **Share APK** with beta users

---

## 💾 Production Notes

### Data Persistence
- **Current:** Uses CSV/XLSX files (resets on server restart)
- **For production:** Migrate to PostgreSQL (I can help)

### Scaling
- Free tier Render works for ~100 concurrent users
- For 1000+ users: Upgrade to paid plan or AWS

### Monitoring
- Backend health: https://quezy-backend.onrender.com/health
- Logs: Check Render dashboard

---

## 📁 Repository Structure

```
quezy-backend (GitHub master)
├── backend/                    ✅ Flask server (LIVE on Render)
├── quezy_mobile_app/           📱 Original Kivy app (ready)
├── quezy-mobile/               ✨ NEW Expo React Native (ready)
├── render.yaml                 🚀 Cloud deployment config
├── src/, package.json, etc.    (Web app in same repo)
└── .gitignore
```

---

## ❓ FAQ

**Q: Can I share the APK with users right now?**  
A: Yes! Build APK and distribute. Backend is live and tested.

**Q: Which mobile app should I use?**  
A: Use Expo (quezy-mobile) - matches web design better.

**Q: Do I need my PC running for the app to work?**  
A: No! Backend runs on Render cloud 24/7.

**Q: Can I add more features?**  
A: Yes! All code is yours to modify. Backend APIs are documented.

**Q: Why is data in CSV and not database?**  
A: Quick MVP setup. For production users, I'll help migrate to PostgreSQL.

---

## 📞 Support

- Backend fails: Check https://quezy-backend.onrender.com/health
- APK build fails: Send error messages from build step
- Feature requests: Modify code and rebuild

---

## Summary: You Have

✅ Live production backend (https://quezy-backend.onrender.com)  
✅ Two mobile apps ready (Kivy + Expo)  
✅ Cloud deployment (auto-updates on git push)  
✅ ML predictions (wait times)  
✅ Full booking system (end-to-end)  

**Next: Choose Expo or Kivy, build APK, test on phone!**
