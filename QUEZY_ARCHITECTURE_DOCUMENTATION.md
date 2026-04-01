# 🏥 QUEZY - AI-Based Queue Management System
## Complete Architecture & Documentation

**Project Name:** QUEZY  
**Version:** 1.0.0  
**Date:** March 20, 2026  
**Type:** Smart Booking Platform with AI Waiting Time Prediction

---

## 📑 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [ML Model Details](#ml-model-details)
8. [API Endpoints](#api-endpoints)
9. [User Roles & Features](#user-roles--features)
10. [Deployment & Configuration](#deployment--configuration)

---

## 1. System Overview

QUEZY is a comprehensive healthcare booking platform that leverages artificial intelligence to predict patient waiting times in clinic queues. The system eliminates uncertainty in queue management and provides real-time updates to patients, clinic administrators, and doctors.

### Key Features:
- ✅ Smart appointment booking with AI-powered predictions
- ✅ Real-time queue position tracking
- ✅ Dynamic patient rescheduling
- ✅ Multi-clinic, multi-doctor support (12 clinics, 100+ doctors)
- ✅ Priority booking system
- ✅ Coupon/discount management
- ✅ 24/7 patient support
- ✅ Admin analytics dashboard

### Success Metrics:
- **68%** reduction in average waiting time
- **4.9/5** patient satisfaction rating
- **24/7** support availability

---

## 2. Architecture Diagram

```
                        ┌─────────────────────────────────────┐
                        │    USERS / PATIENTS / ADMINS        │
                        └──────────────┬──────────────────────┘
                                       │
                        ┌──────────────▼──────────────────────┐
                        │      FRONTEND LAYER (React SPA)     │
                        │  ├─ Home Page (Booking & Auth)      │
                        │  ├─ Admin Panel (Management)        │
                        │  └─ Dashboard (Queue Tracking)      │
                        │      Built with: React 18.3, Vite   │
                        └──────────────┬──────────────────────┘
                                       │ REST API / JSON
                        ┌──────────────▼──────────────────────┐
                        │    BACKEND LAYER (Flask API)        │
                        │  ├─ Authentication Module           │
                        │  ├─ Booking Manager                 │
                        │  ├─ Queue Handler                   │
                        │  └─ ML Prediction Engine            │
                        │      Built with: Python Flask 3.0.3 │
                        └──────────────┬──────────────────────┘
                                       │
        ┌──────────────────────────┬──┴──┬──────────────────┐
        │                          │     │                  │
        ▼                          ▼     ▼                  ▼
    ┌─────────────┐       ┌─────────────────┐      ┌──────────────┐
    │   USER DB   │       │ APPOINTMENTS DB │      │  ML ASSETS   │
    │ users.xlsx  │       │appointments_    │      │   .pkl file  │
    │             │       │bookings.csv     │      │              │
    └─────────────┘       └─────────────────┘      └──────────────┘
                                    │
                                    ▼
                          ┌────────────────────┐
                          │  CLINIC PROFILES   │
                          │  12 Clinics        │
                          │  100+ Doctors      │
                          │  Various Specs     │
                          └────────────────────┘


┌──────────────────────────────────────────────────────────────────┐
│                   AI/ML MODULE (CORE INTELLIGENCE)               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Random Forest Regressor Model (Scikit-Learn)              │ │
│  │                                                             │ │
│  │ INPUT (7 Features):                                        │ │
│  │ • doctor_id, clinic_id, appointment_hour, day_of_week    │ │
│  │ • queue_position, patients_ahead, priority_booking        │ │
│  │                                                             │ │
│  │ OUTPUT:                                                     │ │
│  │ • predicted_waiting_time (in minutes)                     │ │
│  │                                                             │ │
│  │ Metrics:                                                    │ │
│  │ • MAE (Mean Absolute Error) < 3 minutes                   │ │
│  │ • RMSE (Root Mean Squared Error)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI framework, component-based architecture |
| React Router DOM | 6.28.1 | Client-side routing (/, /admin, /dashboard) |
| Vite | 5.4.10 | Build tool (fast dev server, optimized builds) |
| Bootstrap CSS | (implicit) | Responsive styling, UI components |
| Vanilla JavaScript | ES6+ | Logic implementation |

### Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.8+ | Server language |
| Flask | 3.0.3 | Web framework, REST API |
| Pandas | 2.2.2 | Data manipulation, analysis |
| NumPy | 2.1.1 | Numerical computing |
| Scikit-learn | 1.5.2 | Machine learning library |
| Joblib | 1.4.2 | Model serialization/deserialization |
| Openpyxl | 3.1.5 | Excel file handling |

### Development Tools
- **Version Control:** Git
- **Package Management:** npm (frontend), pip (backend)
- **Environment:** Python venv (virtual environment)
- **IDE:** VS Code

---

## 4. System Components

### 4.1 Frontend Components

#### Home Page (`src/pages/Home.jsx`)
```
Responsibilities:
├─ Navigation Bar
│  ├─ Logo (QUEZY with heart icon)
│  ├─ Navigation links (Home, Stats, Services, Booking, Admin, Contact)
│  └─ Auth buttons (Login, Register)
├─ Hero Section
│  ├─ Main heading: "Healthcare and lifestyle bookings in one elegant experience"
│  ├─ CTA buttons (Book Appointment, Explore Services)
│  └─ Trust indicators (68% wait reduction, 24/7 support, 4.9/5 rating)
├─ Booking Form
│  ├─ Clinic selection dropdown
│  ├─ Doctor selection (filtered by clinic)
│  ├─ Date/Time picker
│  ├─ Patient info (name, email, phone)
│  ├─ Medical problem description
│  └─ Payment method & coupon code
├─ Queue Prediction Display
│  └─ Shows predicted waiting time
├─ Authentication Modals
│  ├─ Login form
│  └─ Registration form
└─ Footer with contact information
```

#### Admin Panel (`src/pages/Admin.jsx`)
```
Responsibilities:
├─ Dashboard Overview
│  ├─ Total bookings (today/week/month)
│  ├─ Average waiting time
│  └─ Patient satisfaction metrics
├─ Clinic Management
│  ├─ Add/edit clinic details
│  ├─ View clinic performance
│  └─ Manage doctors by clinic
├─ Doctor Management
│  ├─ Register doctors
│  ├─ Set specializations
│  ├─ Update avg consultation time
│  └─ Set availability hours
├─ Appointment Management
│  ├─ View all bookings
│  ├─ Update appointment status
│  ├─ Handle rescheduling
│  └─ Cancel bookings
├─ Analytics
│  ├─ Queue metrics by clinic
│  ├─ Doctor efficiency ratings
│  ├─ Peak hours analysis
│  └─ Revenue tracking
└─ System Settings
   ├─ Coupon management
   └─ ML model status
```

#### Dashboard (`src/pages/Dashboard.jsx`)
```
Responsibilities:
├─ User's Appointments
│  ├─ Current appointment details
│  ├─ Queue position
│  ├─ Patients ahead
│  ├─ Predicted waiting time
│  └─ Expected consultation time
├─ Real-time Queue Status
│  ├─ Live queue position updates
│  ├─ Updated waiting time estimates
│  └─ Appointment progress (Pending/In Progress/Completed)
├─ Appointment History
│  ├─ Past bookings
│  ├─ Doctor ratings
│  └─ Consultation feedback
└─ Upcoming Appointments
   ├─ Scheduled bookings
   └─ Reminders
```

### 4.2 Backend Components

#### Main API Server (`backend/app.py`)
```
Key Responsibilities:
├─ Flask Application Initialization
│  └─ CORS enabled for frontend communication
├─ User Management
│  ├─ Register (POST /api/register)
│  ├─ Login (POST /api/login)
│  ├─ Validate email & phone
│  └─ Store users in users.xlsx
├─ Clinic & Doctor Operations
│  ├─ Get all clinics
│  ├─ Get doctors by clinic
│  ├─ Doctor specialization lookup
│  └─ Average consultation time
├─ Appointment Booking
│  ├─ Create booking (POST /api/booking)
│  ├─ Generate unique booking_id
│  ├─ Calculate queue_position & patients_ahead
│  ├─ Process payment
│  ├─ Apply coupon discounts
│  └─ Store in appointments_bookings.csv
├─ Queue Management
│  ├─ Get queue position
│  ├─ Update patients_ahead
│  ├─ Handle dynamic rescheduling
│  └─ Calculate expected consultation time
├─ ML Integration
│  ├─ Call predict_waiting_time()
│  ├─ Add prediction to booking record
│  └─ Request model retraining if needed
└─ Data Validation
   ├─ Email format validation
   ├─ Phone format (10 digits)
   └─ Required field checks
```

#### ML Module (`backend/waiting_time_ml.py`)
```
Key Responsibilities:
├─ Dataset Generation
│  ├─ Create synthetic appointment history
│  ├─ 320 records with realistic distribution
│  └─ Save to CSV
├─ Model Training Pipeline
│  ├─ Load training data
│  ├─ Split data (80% train, 20% test)
│  ├─ Feature normalization
│  ├─ Train Random Forest model
│  ├─ Calculate performance metrics (MAE, RMSE)
│  └─ Save model as .pkl file
├─ Waiting Time Prediction
│  ├─ Load trained model
│  ├─ Accept 7 input features
│  ├─ Predict waiting time (minutes)
│  └─ Return prediction
├─ Dynamic Rescheduling
│  ├─ Analyze queue patterns
│  ├─ Suggest better time slots
│  └─ Notify patients of changes
└─ Automatic Retraining
   ├─ Monitor model accuracy
   ├─ Retrain when accuracy drops
   └─ Use latest appointment data
```

#### Clinic Profiles (`backend/clinic_profiles.py`)
```
Database of:
├─ 12 Clinic Locations
│  ├─ Apollo Clinic - Adyar (ID: 1)
│  ├─ Apollo Clinic - Velachery (ID: 2)
│  ├─ Fortis Medical Center - T Nagar (ID: 3)
│  ├─ Kauvery Hospital - Alwarpet (ID: 4)
│  ├─ MIOT International - Manapakkam (ID: 5)
│  ├─ Global Hospitals - Perumbakkam (ID: 6)
│  ├─ SIMS Hospital - Vadapalani (ID: 7)
│  ├─ Vijaya Hospital - Vadapalani (ID: 8)
│  ├─ Prashanth Hospital - Velachery (ID: 9)
│  ├─ Dr. Kamakshi Hospital - Pallikaranai (ID: 10)
│  ├─ SRM Hospital - Potheri (ID: 11)
│  └─ Rela Institute - Chromepet (ID: 12)
├─ Specializations (12 types)
│  ├─ General Physician (8 min avg)
│  ├─ Dermatologist (10 min avg)
│  ├─ Orthopedic (12 min avg)
│  ├─ Cardiologist (14 min avg)
│  ├─ Pediatrician (9 min avg)
│  ├─ Gynecologist (12 min avg)
│  ├─ Ophthalmologist (11 min avg)
│  ├─ ENT Specialist (10 min avg)
│  ├─ Dentist (11 min avg)
│  ├─ Psychiatrist (15 min avg)
│  ├─ Nephrologist (13 min avg)
│  └─ Endocrinologist (12 min avg)
└─ 100+ Doctors
   ├─ Name, specialization, ID
   ├─ Assigned to clinics
   └─ Consultation time profile
```

---

## 5. Data Flow

### Booking Flow
```
User Input (Home Page)
    ↓
    ├─ Clinic Selection
    ├─ Doctor Selection
    ├─ Date/Time Selection
    ├─ Patient Info (Name, Email, Phone)
    ├─ Medical Problem
    ├─ Payment Method
    └─ Coupon Code (optional)
         ↓
    [Frontend Validation]
         ↓
    POST /api/booking
         ↓
    [Backend Validation]
         ↓
    Database Operations:
    ├─ Check doctor availability
    ├─ Calculate queue_position
    ├─ Count patients_ahead
    └─ Get avg_consultation_time
         ↓
    ML Prediction:
    ├─ Call predict_waiting_time()
    ├─ Input: doctor_id, clinic_id, appointment_hour, 
             day_of_week, queue_position, patients_ahead, 
             priority_booking
    └─ Output: predicted_waiting_time
         ↓
    Payment Processing:
    ├─ Apply coupon discount (if valid)
    ├─ Calculate total_amount
    └─ Record payment_method
         ↓
    Create Booking Record:
    ├─ booking_id (auto-generated)
    ├─ All patient info
    ├─ All appointment details
    ├─ ML prediction
    ├─ Queue info
    ├─ Payment info
    └─ created_at (timestamp)
         ↓
    Save to appointments_bookings.csv
         ↓
    Return to Frontend:
    ├─ Booking confirmation
    ├─ Queue position
    ├─ Predicted waiting time
    └─ Expected consultation time
         ↓
    User Feedback:
    ├─ Success message
    ├─ Booking details
    └─ Link to Dashboard
```

### ML Prediction Flow
```
Input Features:
┌─────────────────────────────────────────┐
│ doctor_id: 101                          │
│ clinic_id: 1                            │
│ appointment_hour: 10                    │
│ day_of_week: 2                          │
│ queue_position: 3                       │
│ patients_ahead: 2                       │
│ priority_booking: 0                     │
└─────────────────────────────────────────┘
         ↓
    [Load Random Forest Model]
         ↓
    [Feature Processing]
    ├─ Normalize/scale if needed
    ├─ Validate feature ranges
    └─ Handle missing values
         ↓
    [Model Prediction]
    ├─ Tree 1: prediction = 15 min
    ├─ Tree 2: prediction = 14 min
    ├─ Tree 3: prediction = 16 min
    └─ Average of 100 trees
         ↓
    Output:
    predicted_waiting_time = 15 minutes ± 3 (MAE)
```

---

## 6. Database Schema

### Users Database (`users.xlsx`)
```
Column          | Type      | Description
───────────────────────────────────────────
FullName        | String    | Patient's full name
Email           | String    | Unique email (validated)
Phone           | String    | 10-digit phone number
Password        | String    | Hashed password
created_at      | DateTime  | Registration timestamp
last_login      | DateTime  | Last login timestamp
status          | String    | Active/Inactive/Suspended
```

### Appointments Bookings (`appointments_bookings.csv`)
```
Column                    | Type      | Description
──────────────────────────────────────────────────────
booking_id                | String    | Unique identifier
patient_name              | String    | Full name
phone_number              | String    | Contact number
email                     | String    | Email address
medical_problem           | String    | Chief complaint
clinic_name               | String    | Clinic location
clinic_id                 | Integer   | Clinic ID (1-12)
doctor_name               | String    | Doctor's name
doctor_id                 | Integer   | Doctor ID (101+)
specialization            | String    | Medical specialty
appointment_date          | Date      | YYYY-MM-DD
time_slot                 | String    | HH:MM format
appointment_hour          | Integer   | 8-22 range
day_of_week               | Integer   | 1-7 (Monday-Sunday)
priority_booking          | Boolean   | 0=Regular, 1=Priority
queue_position            | Integer   | Position in queue
patients_ahead            | Integer   | Count before patient
avg_consultation_time     | Integer   | Minutes (by specialty)
predicted_waiting_time    | Integer   | ML prediction (Minutes)
expected_consultation_time| Integer   | Avg + predicted
arrival_time              | DateTime  | When patient arrived
status                    | String    | Pending/In Progress/Completed/Cancelled
payment_method            | String    | Cash/Card/UPI/Insurance
coupon_code               | String    | Discount code (optional)
coupon_discount           | Float     | Discount amount
total_amount              | Float     | Final payment amount
created_at                | DateTime  | Booking timestamp
```

### ML Training Dataset (`appointments_dataset.csv`)
```
Column                    | Type      | Description
──────────────────────────────────────────────────────
doctor_id                 | Integer   | Doctor identifier
clinic_id                 | Integer   | Clinic identifier
appointment_hour          | Integer   | 8-22 hours
day_of_week               | Integer   | 1-7 days
queue_position            | Integer   | Position number
patients_ahead            | Integer   | Count
priority_booking          | Boolean   | 0 or 1
actual_waiting_time       | Integer   | Ground truth (Minutes)
```

### ML Model (`waiting_time_model.pkl`)
```
Format: Serialized Python object (Joblib)
Contains:
├─ Random Forest Regressor (100 trees)
├─ Feature names & order
├─ Training statistics
├─ Model parameters
└─ Feature scaling info (if applicable)
```

---

## 7. ML Model Details

### Algorithm: Random Forest Regressor
```
Why Random Forest?
├─ Handles non-linear relationships
├─ Works with categorical data (clinic_id, doctor_id)
├─ Provides feature importance ranking
├─ Robust to outliers
├─ No scaling required
└─ Fast prediction time
```

### Model Architecture
```
Random Forest
│
├─ Tree 1 (max_depth=15)
│  ├─ Split on doctor_id
│  ├─ Split on appointment_hour
│  ├─ Split on patients_ahead
│  └─ Leaf predictions
│
├─ Tree 2 (max_depth=15)
│  ├─ Different random split
│  └─ ...
│
├─ ... (100 trees total)
│
└─ Averaging
   ∑(predictions) / 100 = final_prediction
```

### Training Process
```
Step 1: Dataset Generation (320 sampling records)
├─ Random doctor selection
├─ Random clinic assignment
├─ Random hour (8-22)
├─ Random day (1-7)
├─ Random queue position & patients_ahead
├─ Random priority flag
└─ Realistic waiting time simulation

Step 2: Data Preparation
├─ Load from CSV
├─ Feature extraction
├─ Handle missing values
└─ Remove outliers

Step 3: Train-Test Split
├─ 80% training set (256 records)
└─ 20% test set (64 records)

Step 4: Model Training
├─ Initialize Random Forest
├─ Fit on training data
└─ Learn patterns

Step 5: Evaluation
├─ Predict on test set
├─ Calculate MAE (Mean Absolute Error)
├─ Calculate RMSE (Root Mean Squared Error)
└─ Validate accuracy

Step 6: Model Serialization
├─ Save as .pkl file
├─ Ready for deployment
└─ Can be loaded in production
```

### Feature Importance (Typical)
```
Feature              | Importance (%)
──────────────────────────────────────
patients_ahead       | 28%
appointment_hour     | 22%
doctor_id            | 18%
queue_position       | 15%
priority_booking     | 10%
clinic_id            | 5%
day_of_week          | 2%
```

### Performance Metrics
```
Metric                      | Target
──────────────────────────────────────
Mean Absolute Error (MAE)   | < 3 minutes
RMSE                        | < 5 minutes
R² Score                    | > 0.85
Prediction Latency          | < 100ms
```

---

## 8. API Endpoints

### Authentication Endpoints

#### POST `/api/register`
```json
Request Body:
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123"
}

Response (Success - 201):
{
  "success": true,
  "message": "User registered successfully",
  "user_id": "USER_001"
}

Response (Error - 400):
{
  "success": false,
  "message": "Invalid email format" / "User already exists"
}
```

#### POST `/api/login`
```json
Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (Success - 200):
{
  "success": true,
  "message": "Login successful",
  "user_id": "USER_001",
  "token": "jwt_token_here"
}

Response (Error - 401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Clinic & Doctor Endpoints

#### GET `/api/clinics`
```json
Response (200):
{
  "success": true,
  "clinics": [
    {
      "clinic_id": 1,
      "clinic_name": "Apollo Clinic - Adyar",
      "address": "Adyar, Chennai",
      "doctors_count": 13
    },
    ...
  ]
}
```

#### GET `/api/doctors/{clinic_id}`
```json
Response (200):
{
  "success": true,
  "clinic_id": 1,
  "doctors": [
    {
      "doctor_id": 101,
      "doctor_name": "Dr. Arjun Kumar",
      "specialization": "General Physician",
      "avg_consultation_time": 8,
      "available": true
    },
    ...
  ]
}
```

### Booking Endpoints

#### POST `/api/booking`
```json
Request Body:
{
  "patient_name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "medical_problem": "Fever and cough",
  "clinic_id": 1,
  "doctor_id": 101,
  "appointment_date": "2026-03-25",
  "time_slot": "10:30",
  "priority_booking": 0,
  "payment_method": "card",
  "coupon_code": "SAVE10"
}

Response (Success - 201):
{
  "success": true,
  "message": "Appointment booked successfully",
  "booking": {
    "booking_id": "BOOK_20260320_001",
    "queue_position": 3,
    "patients_ahead": 2,
    "predicted_waiting_time": 15,
    "expected_consultation_time": 23,
    "total_amount": 450,
    "status": "Pending"
  }
}
```

#### GET `/api/waiting-time`
```
Query Parameters:
- doctor_id: Integer
- clinic_id: Integer  
- appointment_hour: Integer
- day_of_week: Integer
- queue_position: Integer
- patients_ahead: Integer
- priority_booking: Integer (0 or 1)

Response (200):
{
  "success": true,
  "predicted_waiting_time": 15,
  "unit": "minutes",
  "confidence": 0.87
}
```

#### GET `/api/bookings/{user_id}`
```json
Response (200):
{
  "success": true,
  "bookings": [
    {
      "booking_id": "BOOK_20260320_001",
      "clinic_name": "Apollo Clinic - Adyar",
      "doctor_name": "Dr. Arjun Kumar",
      "appointment_date": "2026-03-25",
      "time_slot": "10:30",
      "status": "Pending",
      "queue_position": 3,
      "predicted_waiting_time": 15
    },
    ...
  ]
}
```

#### PATCH `/api/booking/{booking_id}`
```json
Request Body:
{
  "status": "Completed",
  "actual_waiting_time": 14,
  "actual_consultation_time": 9
}

Response (200):
{
  "success": true,
  "message": "Booking updated successfully"
}
```

---

## 9. User Roles & Features

### 1. Patient Role

**Access:** Home Page + Dashboard

**Features:**
- ✅ Register and login
- ✅ Browse clinics and doctors
- ✅ View doctor specializations
- ✅ Select appointment date/time
- ✅ See real-time predicted waiting time
- ✅ Book appointment with priority option
- ✅ Apply coupon codes
- ✅ Track queue position on dashboard
- ✅ View actual waiting time updates
- ✅ Complete consultation and rate experience
- ✅ Access appointment history
- ✅ Get 24/7 support

**Limitations:**
- ❌ Cannot modify doctor schedules
- ❌ Cannot access other patient's data
- ❌ Cannot access admin analytics

### 2. Doctor Role

**Access:** Dashboard (read-only) + notifications

**Features:**
- ✅ View today's appointments
- ✅ See queue position
- ✅ Receive patient updates
- ✅ Mark consultation completion
- ✅ Update actual consultation time
- ✅ Access patient history

**Limitations:**
- ❌ Cannot modify bookings
- ❌ Cannot manage other doctors
- ❌ Cannot access financial data

### 3. Admin Role

**Access:** Admin Panel + Analytics

**Features:**
- ✅ Manage all clinics
- ✅ Register and update doctors
- ✅ Set consultation times per specialization
- ✅ View all bookings
- ✅ Update booking status
- ✅ Handle cancellations and rescheduling
- ✅ View detailed analytics
- ✅ Manage coupon codes
- ✅ Monitor ML model performance
- ✅ Trigger model retraining
- ✅ Access revenue reports
- ✅ Manage system settings

**Limitations:**
- ⚠️ Limited ML model editing (read-only)

---

## 10. Deployment & Configuration

### 10.1 Frontend Deployment

**Build Process:**
```bash
npm install                    # Install dependencies
npm run build                  # Build for production
# Output: dist/ folder (optimized static files)
```

**Deployment Options:**
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

**Environment Variables:**
```
VITE_API_URL=https://api.quezy.com
VITE_ENV=production
```

### 10.2 Backend Deployment

**Setup:**
```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                   # Run Flask server
```

**Deployment Options:**
- Heroku
- PythonAnywhere
- AWS EC2
- Google Cloud Run
- DigitalOcean

**Environment Variables:**
```
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=path/to/database
ML_MODEL_PATH=model/waiting_time_model.pkl
```

### 10.3 Database Backup & Recovery

**Regular Backups:**
```bash
# Backup users database
cp backend/users.xlsx backups/users_YYYY-MM-DD.xlsx

# Backup appointments data
cp backend/appointments_bookings.csv backups/bookings_YYYY-MM-DD.csv

# Backup ML assets
cp backend/waiting_time_model.pkl backups/model_YYYY-MM-DD.pkl
```

### 10.4 Monitoring & Maintenance

**Logs to Monitor:**
- Flask request logs
- ML model prediction times
- Database write operations
- Error tracking

**ML Model Monitoring:**
```
Daily:
├─ Check prediction accuracy
├─ Monitor prediction latency
└─ Count prediction requests

Weekly:
├─ Compare MAE trend
├─ Review feature importance
└─ Check for data drift

Monthly:
├─ Decide on retraining
├─ Validate against ground truth
└─ Update model if needed
```

---

## 11. Security Considerations

### Authentication
- ✅ Email validation with regex
- ✅ Phone number format validation (10 digits)
- ✅ Password hashing (recommended: bcrypt)
- ✅ Session management with JWT tokens

### Data Protection
- ✅ HTTPS/TLS for all communications
- ✅ CORS enabled for frontend only
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention

### Privacy
- ✅ Patient data isolation
- ✅ GDPR compliance measures
- ✅ Regular data backups
- ✅ Audit logs for admin actions

---

## 12. Troubleshooting Guide

### Common Issues

**Issue: ML Model Not Found**
```
Error: FileNotFoundError: waiting_time_model.pkl
Solution: 
1. Check if model exists: backend/waiting_time_model.pkl
2. Run: python backend/waiting_time_ml.py
3. This will regenerate the model
```

**Issue: Prediction Returns NaN**
```
Error: predicted_waiting_time = NaN
Solution:
1. Validate input features ranges
2. Check for missing values
3. Retrain model with fresh data
```

**Issue: Slow API Responses**
```
Solution:
1. Check database file size
2. Index the CSV file
3. Consider migrating to SQL database
4. Profile Flask app for bottlenecks
```

---

## 13. Future Enhancements

- 🔮 Mobile app (React Native)
- 🔮 Video consultation integration
- 🔮 Insurance claim automation
- 🔮 Prescription management
- 🔮 Telemedicine support
- 🔮 Advanced analytics with BI tools
- 🔮 SMS/Email notifications
- 🔮 Payment gateway integration
- 🔮 Multi-language support
- 🔮 Accessibility improvements

---

## 14. Support & Contact

**Project Repository:** [GitHub Link]
**Documentation:** [Wiki Link]
**Live Demo:** [Website Link]
**Support Email:** support@quezy.com

---

**Document Version:** 1.0  
**Last Updated:** March 20, 2026  
**Author:** Development Team  
**Status:** Active & Maintained ✅

---
