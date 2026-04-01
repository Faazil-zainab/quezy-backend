export default function initializeHomePage() {
const serviceTypeSelect = document.getElementById("serviceType");
const clinicFields = document.getElementById("clinicFields");
const restaurantFields = document.getElementById("restaurantFields");
const salonFields = document.getElementById("salonFields");
const medicineFields = document.getElementById("medicineFields");

const problemSelect = document.getElementById("problemSelect");
const doctorSuggestion = document.getElementById("doctorSuggestion");
const nearbyClinicSelect = document.getElementById("nearbyClinic");
const clinicHint = document.getElementById("clinicHint");
const serviceProviderClinic = document.getElementById("serviceProviderClinic");

const assistantToggle = document.getElementById("assistantToggle");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantMessages = document.getElementById("assistantMessages");

const bookingForm = document.getElementById("bookingForm");
const bookingConfirmation = document.getElementById("bookingConfirmation");
const bookAnotherBtn = document.getElementById("bookAnotherBtn");
const bookingQr = document.getElementById("bookingQr");
const confirmBookingBtn = document.getElementById("confirmBookingBtn");

const fullNameInput = document.getElementById("fullName");
const phoneNumberInput = document.getElementById("phoneNumber");
const emailAddressInput = document.getElementById("emailAddress");
const couponCodeInput = document.getElementById("couponCode");
const couponFeedback = document.getElementById("couponFeedback");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const priorityBookingInput = document.getElementById("priorityBooking");
const paymentMethodInput = document.getElementById("paymentMethod");
const totalAmountInput = document.getElementById("totalAmount");
const priceBreakdown = document.getElementById("priceBreakdown");

const clinicDateInput = document.getElementById("clinicDate");
const clinicTimeInput = document.getElementById("clinicTime");
const predictedWaitingTimeOutput = document.getElementById("predictedWaitingTime");
const expectedConsultationTimeOutput = document.getElementById("expectedConsultationTime");
const waitPredictionSpinner = document.getElementById("waitPredictionSpinner");
const waitPredictionMessage = document.getElementById("waitPredictionMessage");
const adminClinicSelect = document.getElementById("adminClinicSelect");
const adminDoctorSelect = document.getElementById("adminDoctorSelect");
const adminAppointmentDateInput = document.getElementById("adminAppointmentDate");
const adminDelayMinutesInput = document.getElementById("adminDelayMinutes");
const adminRefreshAppointmentsBtn = document.getElementById("adminRefreshAppointmentsBtn");
const adminApplyDelayBtn = document.getElementById("adminApplyDelayBtn");
const adminDelayMessage = document.getElementById("adminDelayMessage");
const adminAppointmentsTableBody = document.getElementById("adminAppointmentsTableBody");
const restaurantProviderInput = document.getElementById("restaurantProvider");
const restaurantDateInput = document.getElementById("restaurantDate");
const restaurantPeopleInput = document.getElementById("restaurantPeople");
const restaurantTimeInput = document.getElementById("restaurantTime");
const salonProviderInput = document.getElementById("salonProvider");
const salonServiceInput = document.getElementById("salonService");
const salonDateInput = document.getElementById("salonDate");
const salonTimeInput = document.getElementById("salonTime");
const medicineRequestInput = document.getElementById("medicineRequest");
const medicineDateInput = document.getElementById("medicineDate");
const medicineTimeInput = document.getElementById("medicineTime");
const doctorAdvice = document.getElementById("doctorAdvice");

const displayBookingId = document.getElementById("displayBookingId");
const confirmName = document.getElementById("confirmName");
const confirmDoctor = document.getElementById("confirmDoctor");
const confirmClinic = document.getElementById("confirmClinic");
const confirmMedicalProblem = document.getElementById("confirmMedicalProblem");
const confirmDate = document.getElementById("confirmDate");
const confirmTime = document.getElementById("confirmTime");
const confirmArrivalTime = document.getElementById("confirmArrivalTime");
const confirmQueuePosition = document.getElementById("confirmQueuePosition");
const confirmPatientsAhead = document.getElementById("confirmPatientsAhead");
const confirmAmount = document.getElementById("confirmAmount");
const confirmPriorityDiscount = document.getElementById("confirmPriorityDiscount");
const confirmPredictedWait = document.getElementById("confirmPredictedWait");
const confirmExpectedConsultation = document.getElementById("confirmExpectedConsultation");
const confirmPaymentMethod = document.getElementById("confirmPaymentMethod");
const confirmCoupon = document.getElementById("confirmCoupon");

const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const printConfirmationBtn = document.getElementById("printConfirmationBtn");

const loginModalElement = document.getElementById("loginModal");
const registerModalElement = document.getElementById("registerModal");
const loginFormModal = document.getElementById("loginFormModal");
const registerFormModal = document.getElementById("registerFormModal");
const openLoginFromRegister = document.getElementById("openLoginFromRegister");
const openRegisterFromLogin = document.getElementById("openRegisterFromLogin");
const registerFormMessage = document.getElementById("registerFormMessage");
const loginFormMessage = document.getElementById("loginFormMessage");
const authButtons = document.getElementById("authButtons");
const profileDropdown = document.getElementById("profileDropdown");
const profileToggleName = document.getElementById("profileToggleName");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const bookingCountElement = document.getElementById("bookingCount");
const logoutBtn = document.getElementById("logoutBtn");

const API_BASE_URL = "http://127.0.0.1:5000";

const SERVICE_BASE_PRICES = {
    clinic: 1200,
    restaurant: 900,
    salon: 800,
    medicine: 500
};

const SALON_SERVICE_ADDONS = {
    Haircut: 150,
    Facial: 250,
    "Hair Spa": 300
};

const PRIORITY_DISCOUNT_VALUE = 500;
const STORAGE_KEY = "quezy_latest_booking";
const WAIT_PREDICTION_STORAGE_KEY = "quezy_wait_prediction";
const GPAY_PENDING_BOOKING_KEY = "quezy_pending_gpay_booking";
const BOOKING_HISTORY_KEY = "quezy_booking_history";
const USER_PROFILES_KEY = "quezy_user_profiles";
const UPI_RECEIVER_ID = "faazil3468@oksbi";
const UPI_RECEIVER_NAME = "QUEZY";

const SESSION_KEYS = {
    isLoggedIn: "isLoggedIn",
    username: "username",
    email: "email",
    phone: "phone",
    bookingCount: "bookingCount"
};

let waitPredictionDebounceId = null;
let bookingPollingIntervalId = null;

let appliedCouponCode = "";

function setFormMessage(element, text, isError = false) {
    if (!element) {
        return;
    }

    element.textContent = text;
    element.classList.remove("text-danger", "text-success");
    element.classList.add(isError ? "text-danger" : "text-success");
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}

function getParsedStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch (error) {
        return fallback;
    }
}

function setStoredJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Failed to store ${key}`, error);
    }
}

function getStoredProfiles() {
    return getParsedStorage(USER_PROFILES_KEY, {});
}

function saveProfileFromRegistration(payload) {
    if (!payload || !payload.email) {
        return;
    }

    const key = String(payload.email).trim().toLowerCase();
    if (!key) {
        return;
    }

    const profiles = getStoredProfiles();
    profiles[key] = {
        username: payload.full_name || key.split("@")[0] || "User",
        email: key,
        phone: payload.phone || "Not provided"
    };
    setStoredJson(USER_PROFILES_KEY, profiles);
}

function getProfileByEmail(email) {
    const key = String(email || "").trim().toLowerCase();
    if (!key) {
        return null;
    }

    const profiles = getStoredProfiles();
    return profiles[key] || null;
}

function getBookingHistory() {
    const history = getParsedStorage(BOOKING_HISTORY_KEY, []);
    return Array.isArray(history) ? history : [];
}

function appendBookingHistory(details) {
    const history = getBookingHistory();
    const entry = {
        bookingId: details.bookingId || "--",
        name: details.name || "--",
        email: details.email || "--",
        phone: details.phoneNumber || details.phone_number || "--",
        clinic: details.clinic || details.clinic_name || "--",
        doctor: details.doctor || details.doctor_name || details.provider || "--",
        bookingDate: details.bookingDate || details.appointmentDate || details.appointment_date || "--",
        timeSlot: details.timeSlot || details.time_slot || "--",
        totalAmount: details.totalAmount || details.total_amount || "--",
        status: details.status || "Booked",
        createdAt: details.createdAt || details.created_at || new Date().toISOString()
    };

    history.unshift(entry);
    setStoredJson(BOOKING_HISTORY_KEY, history);
}

function getBookingCount() {
    const count = Number(localStorage.getItem(SESSION_KEYS.bookingCount) || "0");
    return Number.isFinite(count) && count > 0 ? count : 0;
}

function incrementBookingCount() {
    const nextCount = getBookingCount() + 1;
    localStorage.setItem(SESSION_KEYS.bookingCount, String(nextCount));
    if (bookingCountElement) {
        bookingCountElement.textContent = String(nextCount);
    }
}

function setSessionOnLogin(email) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const profile = getProfileByEmail(normalizedEmail);
    const username = (profile && profile.username) || normalizedEmail.split("@")[0] || "User";
    const phone = (profile && profile.phone) || "Not provided";

    localStorage.setItem(SESSION_KEYS.isLoggedIn, "true");
    localStorage.setItem(SESSION_KEYS.username, username);
    localStorage.setItem(SESSION_KEYS.email, normalizedEmail);
    localStorage.setItem(SESSION_KEYS.phone, phone);

    if (localStorage.getItem(SESSION_KEYS.bookingCount) === null) {
        localStorage.setItem(SESSION_KEYS.bookingCount, "0");
    }
}

function syncNavbarAuthState() {
    const isLoggedIn = localStorage.getItem(SESSION_KEYS.isLoggedIn) === "true";

    if (authButtons) {
        authButtons.classList.toggle("d-none", isLoggedIn);
    }
    if (profileDropdown) {
        profileDropdown.classList.toggle("d-none", !isLoggedIn);
    }

    if (!isLoggedIn) {
        return;
    }

    const username = localStorage.getItem(SESSION_KEYS.username) || "User";
    const email = localStorage.getItem(SESSION_KEYS.email) || "--";
    const phone = localStorage.getItem(SESSION_KEYS.phone) || "--";

    if (profileToggleName) profileToggleName.textContent = username;
    if (profileName) profileName.textContent = username;
    if (profileEmail) profileEmail.textContent = email;
    if (profilePhone) profilePhone.textContent = phone;
    if (bookingCountElement) bookingCountElement.textContent = String(getBookingCount());

    if (fullNameInput && !fullNameInput.value.trim()) {
        fullNameInput.value = username;
    }
    if (emailAddressInput && !emailAddressInput.value.trim()) {
        emailAddressInput.value = email === "--" ? "" : email;
    }
    if (phoneNumberInput && !phoneNumberInput.value.trim()) {
        phoneNumberInput.value = phone === "--" || phone === "Not provided" ? "" : phone;
    }
}

function clearSessionAndRedirectToLogin() {
    localStorage.removeItem(SESSION_KEYS.isLoggedIn);
    localStorage.removeItem(SESSION_KEYS.username);
    localStorage.removeItem(SESSION_KEYS.email);
    localStorage.removeItem(SESSION_KEYS.phone);
    localStorage.removeItem(SESSION_KEYS.bookingCount);
    syncNavbarAuthState();
    window.location.href = "/login.html";
}

function openLoginModalIfRequested() {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldOpenLogin = searchParams.get("open") === "login";
    if (!shouldOpenLogin || !window.bootstrap || !loginModalElement) {
        return;
    }

    bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
}

function setupPasswordToggle(buttonId, inputId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", () => {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";
    });
}

function switchBootstrapModal(fromElement, toElement) {
    if (!fromElement || !toElement || !window.bootstrap) {
        return;
    }

    const fromModal = bootstrap.Modal.getOrCreateInstance(fromElement);
    const toModal = bootstrap.Modal.getOrCreateInstance(toElement);

    fromElement.addEventListener(
        "hidden.bs.modal",
        () => {
            toModal.show();
        },
        { once: true }
    );

    fromModal.hide();
}

const DEFAULT_CLINIC_NAMES = [
    "Apollo Clinic - Adyar",
    "Apollo Clinic - Velachery",
    "Fortis Medical Center - T Nagar",
    "Kauvery Hospital - Alwarpet",
    "MIOT International - Manapakkam",
    "Global Hospitals - Perumbakkam",
    "SIMS Hospital - Vadapalani",
    "Vijaya Hospital - Vadapalani",
    "Prashanth Hospital - Velachery",
    "Dr. Kamakshi Hospital - Pallikaranai",
    "SRM Hospital - Potheri",
    "Rela Institute - Chromepet"
];

const clinicDoctorDirectory = {
    "Apollo Clinic - Adyar": [
        { name: "Dr. Arjun Kumar",       specialization: "General Physician" },
        { name: "Dr. Meera Sharma",      specialization: "General Physician" },
        { name: "Dr. Rohan Patel",       specialization: "Dermatologist" },
        { name: "Dr. Vikram Singh",      specialization: "Orthopedic" },
        { name: "Dr. Ravi Nair",         specialization: "Cardiologist" },
        { name: "Dr. Priya Nair",        specialization: "Pediatrician" },
        { name: "Dr. Kavita Joshi",      specialization: "Gynecologist" },
        { name: "Dr. Sandeep Iyer",      specialization: "Ophthalmologist" },
        { name: "Dr. Arvind Rao",        specialization: "ENT Specialist" },
        { name: "Dr. Sameer Khan",       specialization: "Dentist" },
        { name: "Dr. Manish Tiwari",     specialization: "Psychiatrist" },
        { name: "Dr. Deepak Kulkarni",   specialization: "Nephrologist" },
        { name: "Dr. Rohit Sethi",       specialization: "Endocrinologist" }
    ],
    "Apollo Clinic - Velachery": [
        { name: "Dr. Suresh Babu",       specialization: "General Physician" },
        { name: "Dr. Sneha Reddy",       specialization: "Dermatologist" },
        { name: "Dr. Nandini Krishnan",  specialization: "Dermatologist" },
        { name: "Dr. Rajesh Kumar",      specialization: "Orthopedic" },
        { name: "Dr. Ajay Verma",        specialization: "Cardiologist" },
        { name: "Dr. Ankit Das",         specialization: "Pediatrician" },
        { name: "Dr. Pooja Malhotra",    specialization: "Gynecologist" },
        { name: "Dr. Nisha Bansal",      specialization: "Ophthalmologist" },
        { name: "Dr. Ritu Agarwal",      specialization: "ENT Specialist" },
        { name: "Dr. Alka Gupta",        specialization: "Dentist" },
        { name: "Dr. Shalini Desai",     specialization: "Psychiatrist" },
        { name: "Dr. Anjali Menon",      specialization: "Nephrologist" },
        { name: "Dr. Pankaj Arora",      specialization: "Endocrinologist" }
    ],
    "Fortis Medical Center - T Nagar": [
        { name: "Dr. Ramesh Babu",       specialization: "General Physician" },
        { name: "Dr. Divya Suresh",      specialization: "Dermatologist" },
        { name: "Dr. Sandeep Rao",       specialization: "Orthopedic" },
        { name: "Dr. Neha Kapoor",       specialization: "Cardiologist" },
        { name: "Dr. Meenakshi Rajan",   specialization: "Pediatrician" },
        { name: "Dr. Lakshmi Narayan",   specialization: "Gynecologist" },
        { name: "Dr. Kiran Reddy",       specialization: "Ophthalmologist" },
        { name: "Dr. Sunil Mathur",      specialization: "ENT Specialist" },
        { name: "Dr. Preethi Sharma",    specialization: "Dentist" },
        { name: "Dr. Vikram Menon",      specialization: "Psychiatrist" },
        { name: "Dr. Srinivasan Kumar",  specialization: "Nephrologist" },
        { name: "Dr. Uma Shankar",       specialization: "Endocrinologist" }
    ],
    "Kauvery Hospital - Alwarpet": [
        { name: "Dr. Balaji Suresh",     specialization: "General Physician" },
        { name: "Dr. Ananya Sharma",     specialization: "Dermatologist" },
        { name: "Dr. Rajan Pillai",      specialization: "Orthopedic" },
        { name: "Dr. Jayaram Pillai",    specialization: "Cardiologist" },
        { name: "Dr. Radha Krishnan",    specialization: "Pediatrician" },
        { name: "Dr. Priya Menon",       specialization: "Gynecologist" },
        { name: "Dr. Roshini Nair",      specialization: "Ophthalmologist" },
        { name: "Dr. Suresh Menon",      specialization: "ENT Specialist" },
        { name: "Dr. Kritika Verma",     specialization: "Dentist" },
        { name: "Dr. Asha Pillai",       specialization: "Psychiatrist" },
        { name: "Dr. Gokul Raj",         specialization: "Nephrologist" },
        { name: "Dr. Nirmala Devi",      specialization: "Endocrinologist" }
    ],
    "MIOT International - Manapakkam": [
        { name: "Dr. Muthu Krishnan",    specialization: "General Physician" },
        { name: "Dr. Kavitha Rajan",     specialization: "Dermatologist" },
        { name: "Dr. Rahul Mehta",       specialization: "Orthopedic" },
        { name: "Dr. Suresh Pillai",     specialization: "Cardiologist" },
        { name: "Dr. Baby Vasantha",     specialization: "Pediatrician" },
        { name: "Dr. Sumitha Ravi",      specialization: "Gynecologist" },
        { name: "Dr. Praveen Kumar",     specialization: "Ophthalmologist" },
        { name: "Dr. Arvind Rao",        specialization: "ENT Specialist" },
        { name: "Dr. Gomathi Priya",     specialization: "Dentist" },
        { name: "Dr. Kannan Suresh",     specialization: "Psychiatrist" },
        { name: "Dr. Sowmya Rajan",      specialization: "Nephrologist" },
        { name: "Dr. Natarajan Iyer",    specialization: "Endocrinologist" }
    ],
    "Global Hospitals - Perumbakkam": [
        { name: "Dr. Naresh Verma",      specialization: "General Physician" },
        { name: "Dr. Priya Sharma",      specialization: "Dermatologist" },
        { name: "Dr. Vinod Nair",        specialization: "Orthopedic" },
        { name: "Dr. Rajan Kumar",       specialization: "Cardiologist" },
        { name: "Dr. Vasudev Kumar",     specialization: "Pediatrician" },
        { name: "Dr. Usha Krishnan",     specialization: "Gynecologist" },
        { name: "Dr. Sathish Kumar",     specialization: "Ophthalmologist" },
        { name: "Dr. Ramya Suresh",      specialization: "ENT Specialist" },
        { name: "Dr. Lakshman Rao",      specialization: "Dentist" },
        { name: "Dr. Nina Sharma",       specialization: "Psychiatrist" },
        { name: "Dr. Anjali Menon",      specialization: "Nephrologist" },
        { name: "Dr. Kiran Menon",       specialization: "Endocrinologist" }
    ],
    "SIMS Hospital - Vadapalani": [
        { name: "Dr. Ganesh Babu",       specialization: "General Physician" },
        { name: "Dr. Ranjita Kumar",     specialization: "Dermatologist" },
        { name: "Dr. Vivek Sharma",      specialization: "Orthopedic" },
        { name: "Dr. Ramesh Rao",        specialization: "Cardiologist" },
        { name: "Dr. Jayanthi Rajan",    specialization: "Pediatrician" },
        { name: "Dr. Nithya Ravi",       specialization: "Gynecologist" },
        { name: "Dr. Abinaya Nair",      specialization: "Ophthalmologist" },
        { name: "Dr. Mohan Pillai",      specialization: "ENT Specialist" },
        { name: "Dr. Sameer Khan",       specialization: "Dentist" },
        { name: "Dr. Deepthi Verma",     specialization: "Psychiatrist" },
        { name: "Dr. Suresh Raj",        specialization: "Nephrologist" },
        { name: "Dr. Shyama Ravi",       specialization: "Endocrinologist" }
    ],
    "Vijaya Hospital - Vadapalani": [
        { name: "Dr. Senthil Kumar",     specialization: "General Physician" },
        { name: "Dr. Meghna Iyer",       specialization: "Dermatologist" },
        { name: "Dr. Bala Subramaniam",  specialization: "Orthopedic" },
        { name: "Dr. Harish Rajan",      specialization: "Cardiologist" },
        { name: "Dr. Vijayalakshmi",     specialization: "Pediatrician" },
        { name: "Dr. Sowmya Pillai",     specialization: "Gynecologist" },
        { name: "Dr. Sandeep Iyer",      specialization: "Ophthalmologist" },
        { name: "Dr. Ritu Agarwal",      specialization: "ENT Specialist" },
        { name: "Dr. Alka Gupta",        specialization: "Dentist" },
        { name: "Dr. Bharat Verma",      specialization: "Psychiatrist" },
        { name: "Dr. Kala Raman",        specialization: "Nephrologist" },
        { name: "Dr. Sudha Krishnan",    specialization: "Endocrinologist" }
    ],
    "Prashanth Hospital - Velachery": [
        { name: "Dr. Prakash Menon",     specialization: "General Physician" },
        { name: "Dr. Swati Nair",        specialization: "Dermatologist" },
        { name: "Dr. Gopal Sharma",      specialization: "Orthopedic" },
        { name: "Dr. Venkat Raman",      specialization: "Cardiologist" },
        { name: "Dr. Ankit Das",         specialization: "Pediatrician" },
        { name: "Dr. Kavita Joshi",      specialization: "Gynecologist" },
        { name: "Dr. Radhika Kumar",     specialization: "Ophthalmologist" },
        { name: "Dr. Sanjay Suresh",     specialization: "ENT Specialist" },
        { name: "Dr. Namita Rao",        specialization: "Dentist" },
        { name: "Dr. Manish Tiwari",     specialization: "Psychiatrist" },
        { name: "Dr. Bhavana Sharma",    specialization: "Nephrologist" },
        { name: "Dr. Gupta Krishnan",    specialization: "Endocrinologist" }
    ],
    "Dr. Kamakshi Hospital - Pallikaranai": [
        { name: "Dr. Madura Pillai",     specialization: "General Physician" },
        { name: "Dr. Thilaga Rajan",     specialization: "Dermatologist" },
        { name: "Dr. Raja Gopal",        specialization: "Orthopedic" },
        { name: "Dr. Vishwas Kumar",     specialization: "Cardiologist" },
        { name: "Dr. Hema Subramaniam",  specialization: "Pediatrician" },
        { name: "Dr. Anitha Rao",        specialization: "Gynecologist" },
        { name: "Dr. Vijay Nair",        specialization: "Ophthalmologist" },
        { name: "Dr. Lalitha Menon",     specialization: "ENT Specialist" },
        { name: "Dr. Kamal Raju",        specialization: "Dentist" },
        { name: "Dr. Shalini Desai",     specialization: "Psychiatrist" },
        { name: "Dr. Rajeev Kumar",      specialization: "Nephrologist" },
        { name: "Dr. Rohit Sethi",       specialization: "Endocrinologist" }
    ],
    "SRM Hospital - Potheri": [
        { name: "Dr. Subramaniam Raj",   specialization: "General Physician" },
        { name: "Dr. Pavithra Kumar",    specialization: "Dermatologist" },
        { name: "Dr. Dinesh Babu",       specialization: "Orthopedic" },
        { name: "Dr. Siva Subramanian",  specialization: "Cardiologist" },
        { name: "Dr. Padmavathy Rajan",  specialization: "Pediatrician" },
        { name: "Dr. Saranya Krishnan",  specialization: "Gynecologist" },
        { name: "Dr. Mahesh Reddy",      specialization: "Ophthalmologist" },
        { name: "Dr. Vignesh Raman",     specialization: "ENT Specialist" },
        { name: "Dr. Sindhu Prakash",    specialization: "Dentist" },
        { name: "Dr. Ramya Pillai",      specialization: "Psychiatrist" },
        { name: "Dr. Arun Nair",         specialization: "Nephrologist" },
        { name: "Dr. Suba Lakshmi",      specialization: "Endocrinologist" }
    ],
    "Rela Institute - Chromepet": [
        { name: "Dr. Vasanth Kumar",     specialization: "General Physician" },
        { name: "Dr. Nithya Suresh",     specialization: "Dermatologist" },
        { name: "Dr. Madhan Kumar",      specialization: "Orthopedic" },
        { name: "Dr. Venkatesan Raj",    specialization: "Cardiologist" },
        { name: "Dr. Rekha Pillai",      specialization: "Pediatrician" },
        { name: "Dr. Umarani Krishnan",  specialization: "Gynecologist" },
        { name: "Dr. Bharathi Nair",     specialization: "Ophthalmologist" },
        { name: "Dr. Ashok Menon",       specialization: "ENT Specialist" },
        { name: "Dr. Priya Sundar",      specialization: "Dentist" },
        { name: "Dr. Shanthi Verma",     specialization: "Psychiatrist" },
        { name: "Dr. Sreekanth Rajan",   specialization: "Nephrologist" },
        { name: "Dr. Meena Subramanian", specialization: "Endocrinologist" }
    ]
};

const clinicCoordinates = {
    "Apollo Clinic - Adyar":              { latitude: 13.0067, longitude: 80.2577 },
    "Apollo Clinic - Velachery":          { latitude: 12.9777, longitude: 80.2215 },
    "Fortis Medical Center - T Nagar":    { latitude: 13.0418, longitude: 80.2337 },
    "Kauvery Hospital - Alwarpet":        { latitude: 13.0399, longitude: 80.2532 },
    "MIOT International - Manapakkam":    { latitude: 13.0234, longitude: 80.1756 },
    "Global Hospitals - Perumbakkam":     { latitude: 12.9009, longitude: 80.2088 },
    "SIMS Hospital - Vadapalani":         { latitude: 13.0509, longitude: 80.2127 },
    "Vijaya Hospital - Vadapalani":       { latitude: 13.0517, longitude: 80.2092 },
    "Prashanth Hospital - Velachery":     { latitude: 12.9802, longitude: 80.2184 },
    "Dr. Kamakshi Hospital - Pallikaranai": { latitude: 12.9432, longitude: 80.2098 },
    "SRM Hospital - Potheri":             { latitude: 12.8231, longitude: 80.0428 },
    "Rela Institute - Chromepet":         { latitude: 12.9636, longitude: 80.1381 }
};

function setClinicHintText(message, isError = false) {
    if (!clinicHint) {
        return;
    }

    clinicHint.textContent = message;
    clinicHint.classList.toggle("text-danger", isError);
}

function doctorDisplayLabel(doctor, clinicName) {
    return `${doctor.name} - ${doctor.specialization} (${clinicName})`;
}

function doctorSuggestionLabel(doctor) {
    return `${doctor.name} - ${doctor.specialization}`;
}

function extractDoctorNameFromProvider(providerLabel) {
    if (!providerLabel) {
        return "";
    }
    return providerLabel.split(" - ")[0].trim();
}

function resetWaitPredictionDisplay(message = "Fill clinic details to see live waiting-time prediction.") {
    if (predictedWaitingTimeOutput) {
        predictedWaitingTimeOutput.textContent = "--";
    }
    if (expectedConsultationTimeOutput) {
        expectedConsultationTimeOutput.textContent = "--";
    }
    const summaryEl = document.getElementById("waitPredictionSummary");
    if (summaryEl) summaryEl.classList.add("d-none");
    if (waitPredictionMessage) {
        waitPredictionMessage.textContent = message;
        waitPredictionMessage.classList.remove("text-danger", "text-warning");
        waitPredictionMessage.classList.add("text-muted");
    }

    if (waitPredictionSpinner) {
        waitPredictionSpinner.classList.add("d-none");
    }
}

function setWaitPredictionLoading(isLoading) {
    if (!waitPredictionSpinner) {
        return;
    }

    waitPredictionSpinner.classList.toggle("d-none", !isLoading);
}

function setAdminDelayMessage(message, type = "muted") {
    if (!adminDelayMessage) {
        return;
    }

    adminDelayMessage.textContent = message;
    adminDelayMessage.classList.remove("text-muted", "text-danger", "text-success", "text-warning");
    adminDelayMessage.classList.add(
        type === "error" ? "text-danger" : type === "success" ? "text-success" : type === "warning" ? "text-warning" : "text-muted"
    );
}

function renderAdminAppointmentsTable(appointments) {
    if (!adminAppointmentsTableBody) {
        return;
    }

    adminAppointmentsTableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
        adminAppointmentsTableBody.innerHTML = '<tr><td colspan="6" class="text-muted text-center py-3">No appointments found for this doctor and date.</td></tr>';
        return;
    }

    adminAppointmentsTableBody.innerHTML = appointments
        .map((appointment) => `
            <tr>
                <td>${appointment.bookingId}</td>
                <td>${appointment.name}</td>
                <td>${appointment.timeSlot}</td>
                <td>${appointment.queuePosition}</td>
                <td>${appointment.predictedWait} min</td>
                <td>${appointment.expectedConsultation}</td>
            </tr>
        `)
        .join("");
}

function populateAdminClinicOptions() {
    if (!adminClinicSelect) {
        return;
    }

    adminClinicSelect.innerHTML = '<option value="">Select clinic</option>';
    DEFAULT_CLINIC_NAMES.forEach((clinicName) => {
        const option = document.createElement("option");
        option.value = clinicName;
        option.textContent = clinicName;
        adminClinicSelect.appendChild(option);
    });
}

function populateAdminDoctorOptions(clinicName) {
    if (!adminDoctorSelect) {
        return;
    }

    adminDoctorSelect.innerHTML = '<option value="">Select doctor</option>';
    (clinicDoctorDirectory[clinicName] || []).forEach((doctor) => {
        const option = document.createElement("option");
        option.value = doctor.name;
        option.textContent = `${doctor.name} - ${doctor.specialization}`;
        adminDoctorSelect.appendChild(option);
    });
}

async function loadAdminAppointments() {
    if (!adminClinicSelect || !adminDoctorSelect || !adminAppointmentDateInput) {
        return;
    }

    const clinicName = adminClinicSelect.value;
    const doctorName = adminDoctorSelect.value;
    const appointmentDate = adminAppointmentDateInput.value;

    if (!clinicName || !doctorName || !appointmentDate) {
        renderAdminAppointmentsTable([]);
        setAdminDelayMessage("Select a clinic, doctor, and date to preview upcoming appointments.", "muted");
        return;
    }

    try {
        const params = new URLSearchParams({
            clinic_name: clinicName,
            doctor_name: doctorName,
            appointment_date: appointmentDate,
        });
        const response = await fetch(`${API_BASE_URL}/api/admin/appointments?${params.toString()}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            setAdminDelayMessage((data && data.message) || "Unable to load appointments.", "error");
            renderAdminAppointmentsTable([]);
            return;
        }

        renderAdminAppointmentsTable(data.appointments || []);
        setAdminDelayMessage(`Loaded ${data.appointments.length} appointment(s) for ${doctorName}.`, "success");
    } catch (error) {
        setAdminDelayMessage("Unable to connect to backend for doctor dashboard data.", "error");
        renderAdminAppointmentsTable([]);
    }
}

async function applyAdminDelayUpdate() {
    if (!adminClinicSelect || !adminDoctorSelect || !adminAppointmentDateInput || !adminDelayMinutesInput) {
        return;
    }

    const clinicName = adminClinicSelect.value;
    const doctorName = adminDoctorSelect.value;
    const appointmentDate = adminAppointmentDateInput.value;
    const delayMinutes = Math.max(Number(adminDelayMinutesInput.value || 0), 0);

    if (!clinicName || !doctorName || !appointmentDate || delayMinutes < 1) {
        setAdminDelayMessage("Select a clinic, doctor, date, and a delay of at least 1 minute.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/reschedule`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clinic_name: clinicName,
                doctor_name: doctorName,
                appointment_date: appointmentDate,
                additional_delay_minutes: delayMinutes,
            }),
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            setAdminDelayMessage((data && data.message) || "Unable to apply delay update.", "error");
            return;
        }

        setAdminDelayMessage(`Applied a ${delayMinutes}-minute delay for ${doctorName}.`, "warning");
        await loadAdminAppointments();
    } catch (error) {
        setAdminDelayMessage("Unable to connect to backend for delay update.", "error");
    }
}

function stopBookingPolling() {
    if (bookingPollingIntervalId) {
        window.clearInterval(bookingPollingIntervalId);
        bookingPollingIntervalId = null;
    }
}

function saveWaitPredictionToLocal() {
    try {
        const payload = {
            predicted_waiting_time: predictedWaitingTimeOutput ? predictedWaitingTimeOutput.textContent : "--",
            expected_consultation_time: expectedConsultationTimeOutput ? expectedConsultationTimeOutput.textContent : "--",
            message: waitPredictionMessage ? waitPredictionMessage.textContent : "",
            updated_at: new Date().toISOString(),
        };
        localStorage.setItem(WAIT_PREDICTION_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.error("Wait prediction save failed", error);
    }
}

function restoreWaitPredictionFromLocal() {
    try {
        const raw = localStorage.getItem(WAIT_PREDICTION_STORAGE_KEY);
        if (!raw) {
            return;
        }

        const saved = JSON.parse(raw);
        if (!saved) {
            return;
        }

        if (predictedWaitingTimeOutput && saved.predicted_waiting_time) {
            predictedWaitingTimeOutput.textContent = saved.predicted_waiting_time;
        }
        if (expectedConsultationTimeOutput && saved.expected_consultation_time) {
            expectedConsultationTimeOutput.textContent = saved.expected_consultation_time;
        }
        if (waitPredictionMessage && saved.message) {
            waitPredictionMessage.textContent = saved.message;
            waitPredictionMessage.classList.remove("text-danger", "text-warning", "text-success");
            waitPredictionMessage.classList.add("text-muted");
        }
    } catch (error) {
        console.error("Wait prediction restore failed", error);
    }
}

function setWaitPredictionMessage(message, mode = "info") {
    if (!waitPredictionMessage) {
        return;
    }

    waitPredictionMessage.textContent = message;
    waitPredictionMessage.classList.remove("text-muted", "text-danger", "text-warning", "text-success");

    if (mode === "error") {
        waitPredictionMessage.classList.add("text-danger");
        return;
    }

    if (mode === "warning") {
        waitPredictionMessage.classList.add("text-warning");
        return;
    }

    if (mode === "success") {
        waitPredictionMessage.classList.add("text-success");
        return;
    }

    waitPredictionMessage.classList.add("text-muted");
}

function buildWaitPredictionPayload() {
    if (!nearbyClinicSelect || !serviceProviderClinic || !clinicTimeInput || !clinicDateInput || !problemSelect) {
        return null;
    }

    const clinicName = nearbyClinicSelect.value;
    const providerLabel = serviceProviderClinic.value;
    const appointmentDate = clinicDateInput.value;
    const medicalProblem = problemSelect.options[problemSelect.selectedIndex]?.text || "";

    if (!clinicName || !providerLabel || !appointmentDate || !medicalProblem || !problemSelect.value) {
        return null;
    }

    return {
        clinic_name: clinicName,
        doctor_name: extractDoctorNameFromProvider(providerLabel),
        medical_problem: medicalProblem,
        appointment_date: appointmentDate,
        time_slot: clinicTimeInput.value,
        priority_booking: !!(priorityBookingInput && priorityBookingInput.checked),
    };
}

function updateWaitPredictionOutput(waitMinutes, expectedTimeText) {
    if (predictedWaitingTimeOutput) {
        predictedWaitingTimeOutput.textContent = String(waitMinutes);
    }
    if (expectedConsultationTimeOutput) {
        expectedConsultationTimeOutput.textContent = expectedTimeText;
    }

    saveWaitPredictionToLocal();
}

function computeExpectedTimeFromHour(appointmentHour, waitMinutes) {
    const now = new Date();
    const consultation = new Date(now);
    consultation.setHours(appointmentHour, 0, 0, 0);
    consultation.setMinutes(consultation.getMinutes() + Number(waitMinutes));
    return consultation.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

async function requestDynamicReschedule(basePredictedWait, addedDelayMinutes, appointmentHour) {
    return null;
}

async function requestLiveWaitPrediction() {
    if (!serviceTypeSelect || serviceTypeSelect.value !== "clinic") {
        return;
    }

    const payload = buildWaitPredictionPayload();
    if (!payload) {
        resetWaitPredictionDisplay();
        return;
    }

    setWaitPredictionLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/predict-wait-time`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success || !data.prediction) {
            const message = (data && data.message) || "Unable to predict waiting time right now.";
            setWaitPredictionMessage(message, "error");
            return;
        }

        const predictedMinutes = Math.max(Math.round(Number(data.prediction.predictedWait || 0)), 0);
        const expectedTime = String(data.prediction.expectedConsultation || "--");
        const queuePos = data.prediction.queuePosition ?? "--";
        const patientsAhead = data.prediction.patientsAhead ?? "--";

        updateWaitPredictionOutput(predictedMinutes, expectedTime);

        // Plain-language summary in the prediction panel
        const summaryEl = document.getElementById("waitPredictionSummary");
        if (summaryEl) {
            const aheadText = patientsAhead === 0
                ? "You are <strong>first in line</strong> — no one is ahead of you."
                : `<strong>${patientsAhead} patient${patientsAhead !== 1 ? "s" : ""}</strong> are ahead of you in the queue.`;
            summaryEl.innerHTML =
                `You are <strong>#${queuePos}</strong> in the queue. ${aheadText} ` +
                `You will wait about <strong>${predictedMinutes} minutes</strong> in the waiting area, ` +
                `and the doctor is expected to see you at <strong>${expectedTime}</strong>.`;
            summaryEl.classList.remove("d-none");
        }

        setWaitPredictionMessage("Live estimate based on current bookings.", "success");
    } catch (error) {
        setWaitPredictionMessage("Prediction service unavailable. Ensure backend is running.", "error");
    } finally {
        setWaitPredictionLoading(false);
    }
}

async function fetchLatestBookingStatus(bookingId, silent = false) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
        const data = await response.json();
        if (!response.ok || !data.success || !data.booking) {
            return null;
        }

        renderBookingConfirmation(data.booking, { persist: !silent, startPolling: false });
        return data.booking;
    } catch (error) {
        return null;
    }
}

function startBookingPolling(bookingId) {
    stopBookingPolling();
    bookingPollingIntervalId = window.setInterval(() => {
        fetchLatestBookingStatus(bookingId, true);
    }, 15000);
}

function scheduleLiveWaitPrediction() {
    if (waitPredictionDebounceId) {
        clearTimeout(waitPredictionDebounceId);
    }

    waitPredictionDebounceId = window.setTimeout(() => {
        requestLiveWaitPrediction();
    }, 300);
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(toRadians(lat1))
            * Math.cos(toRadians(lat2))
            * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function getClinicsByDistance(userLatitude, userLongitude) {
    return [...DEFAULT_CLINIC_NAMES].sort((clinicA, clinicB) => {
        const locationA = clinicCoordinates[clinicA];
        const locationB = clinicCoordinates[clinicB];

        if (!locationA || !locationB) {
            return 0;
        }

        const distanceA = haversineDistanceKm(userLatitude, userLongitude, locationA.latitude, locationA.longitude);
        const distanceB = haversineDistanceKm(userLatitude, userLongitude, locationB.latitude, locationB.longitude);
        return distanceA - distanceB;
    });
}

function populateClinicOptions(clinicNames, selectedClinic = "") {
    if (!nearbyClinicSelect) {
        return;
    }

    nearbyClinicSelect.innerHTML = "<option value=\"\">Select nearby clinic</option>";

    clinicNames.forEach((clinicName) => {
        const option = document.createElement("option");
        option.value = clinicName;
        option.textContent = clinicName;
        nearbyClinicSelect.appendChild(option);
    });

    if (selectedClinic && clinicNames.includes(selectedClinic)) {
        nearbyClinicSelect.value = selectedClinic;
    }
}

function populateDoctorsForClinic(clinicName, preferredSpecialization = "") {
    if (!serviceProviderClinic) {
        return "";
    }

    const allDoctors = clinicDoctorDirectory[clinicName] || [];
    const doctors = preferredSpecialization
        ? allDoctors.filter((doctor) => doctor.specialization === preferredSpecialization)
        : allDoctors;

    serviceProviderClinic.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = doctors.length > 0
        ? "Select doctor"
        : preferredSpecialization
            ? "No specialist available"
            : "No doctors available";
    serviceProviderClinic.appendChild(placeholder);

    doctors.forEach((doctor) => {
        const optionLabel = doctorDisplayLabel(doctor, clinicName);
        const option = document.createElement("option");
        option.value = optionLabel;
        option.textContent = optionLabel;
        serviceProviderClinic.appendChild(option);
    });

    if (!doctors.length) {
        return "";
    }

    const selectedLabel = doctorDisplayLabel(doctors[0], clinicName);
    serviceProviderClinic.value = selectedLabel;
    return selectedLabel;
}

function getFirstClinicForSpecialization(specialization) {
    return DEFAULT_CLINIC_NAMES.find((clinicName) =>
        (clinicDoctorDirectory[clinicName] || []).some((doctor) => doctor.specialization === specialization)
    ) || DEFAULT_CLINIC_NAMES[0];
}

function initializeNearbyClinics() {
    if (!nearbyClinicSelect) {
        return;
    }

    const applyClinicList = (clinicNames, hintMessage) => {
        const safeClinics = clinicNames.length ? clinicNames : DEFAULT_CLINIC_NAMES;
        populateClinicOptions(safeClinics, safeClinics[0]);
        const selectedDoctorLabel = populateDoctorsForClinic(safeClinics[0]);

        if (doctorSuggestion) {
            doctorSuggestion.value = selectedDoctorLabel;
        }

        setClinicHintText(hintMessage, false);
    };

    if (!("geolocation" in navigator)) {
        applyClinicList(DEFAULT_CLINIC_NAMES, "Location unavailable. Showing default nearby clinics.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const clinicsByDistance = getClinicsByDistance(position.coords.latitude, position.coords.longitude);
            applyClinicList(clinicsByDistance, "Nearby clinics are sorted by your current location.");
        },
        () => {
            applyClinicList(DEFAULT_CLINIC_NAMES, "Location permission denied. Showing default nearby clinics.");
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function getCurrentProblemSpecialization() {
    const problemKey = problemSelect ? problemSelect.value : "";
    if (!problemKey) {
        return "";
    }
    return problemSpecializationMap[problemKey] || "";
}

function updateClinicDoctorSuggestion() {
    const clinicName = nearbyClinicSelect ? nearbyClinicSelect.value : "";
    const problemKey = problemSelect ? problemSelect.value : "";
    const specialization = getCurrentProblemSpecialization();

    if (!clinicName) {
        if (serviceProviderClinic) {
            serviceProviderClinic.innerHTML = "<option value=\"\">Select clinic first</option>";
        }
        if (doctorSuggestion) {
            doctorSuggestion.value = "";
        }
        resetWaitPredictionDisplay();
        return;
    }

    const selectedDoctorLabel = populateDoctorsForClinic(clinicName, specialization);
    const matchedDoctors = (clinicDoctorDirectory[clinicName] || []).filter((doctor) =>
        specialization ? doctor.specialization === specialization : true
    );

    if (!matchedDoctors.length && specialization) {
        // Fallback: find the nearest clinic that has the required specialization
        const fallbackClinic = DEFAULT_CLINIC_NAMES.find((name) =>
            name !== clinicName
            && (clinicDoctorDirectory[name] || []).some((doctor) => doctor.specialization === specialization)
        );

        if (fallbackClinic) {
            const fallbackDoctors = (clinicDoctorDirectory[fallbackClinic] || []).filter(
                (doctor) => doctor.specialization === specialization
            );
            if (serviceProviderClinic) {
                serviceProviderClinic.innerHTML = "";
                const placeholder = document.createElement("option");
                placeholder.value = "";
                placeholder.textContent = "Select doctor (nearest clinic)";
                serviceProviderClinic.appendChild(placeholder);
                fallbackDoctors.forEach((doctor) => {
                    const optionLabel = doctorDisplayLabel(doctor, fallbackClinic);
                    const option = document.createElement("option");
                    option.value = optionLabel;
                    option.textContent = optionLabel;
                    serviceProviderClinic.appendChild(option);
                });
                const firstLabel = doctorDisplayLabel(fallbackDoctors[0], fallbackClinic);
                serviceProviderClinic.value = firstLabel;
                if (doctorSuggestion) {
                    doctorSuggestion.value = doctorSuggestionLabel(fallbackDoctors[0]);
                }
            }
            if (doctorAdvice) {
                doctorAdvice.textContent = `No specialist in selected clinic. Showing doctors from ${fallbackClinic}.`;
                doctorAdvice.classList.add("text-warning");
                doctorAdvice.classList.remove("text-danger");
            }
            setClinicHintText(`Nearest available specialist found at ${fallbackClinic}.`, false);
            scheduleLiveWaitPrediction();
        } else {
            if (doctorSuggestion) {
                doctorSuggestion.value = "";
            }
            if (doctorAdvice) {
                doctorAdvice.textContent = "No specialist available for this problem in any clinic.";
                doctorAdvice.classList.add("text-danger");
                doctorAdvice.classList.remove("text-warning");
            }
            setClinicHintText("No specialist available for this problem.", true);
        }
        return;
    }

    if (doctorAdvice) {
        doctorAdvice.classList.remove("text-warning");
    }

    if (doctorAdvice) {
        doctorAdvice.classList.remove("text-danger");
        if (problemKey) {
            doctorAdvice.textContent = problemAdviceMap[problemKey] || "Consult the recommended specialist for detailed diagnosis and treatment.";
        } else {
            doctorAdvice.textContent = "Select a problem to get specialist guidance.";
        }
    }

    if (matchedDoctors.length > 0) {
        if (doctorSuggestion) {
            doctorSuggestion.value = doctorSuggestionLabel(matchedDoctors[0]);
        }
        setClinicHintText("Select a nearby clinic to see available doctors.", false);
        scheduleLiveWaitPrediction();
        return;
    }

    if (doctorSuggestion) {
        doctorSuggestion.value = selectedDoctorLabel ? selectedDoctorLabel.replace(/ \(.+\)$/, "") : "";
    }
    setClinicHintText("Select a nearby clinic to see available doctors.", false);
    scheduleLiveWaitPrediction();
}

const problemSpecializationMap = {
    fever: "General Physician",
    cold: "General Physician",
    cough: "General Physician",
    headache: "General Physician",
    bodypain: "General Physician",
    stomachpain: "General Physician",
    vomiting: "General Physician",
    diarrhea: "General Physician",
    chestpain: "Cardiologist",
    breathing: "General Physician",
    skinalergy: "Dermatologist",
    acne: "Dermatologist",
    rash: "Dermatologist",
    hairloss: "Dermatologist",
    fracture: "Orthopedic",
    jointpain: "Orthopedic",
    backpain: "Orthopedic",
    kneepain: "Orthopedic",
    childfever: "Pediatrician",
    childcold: "Pediatrician",
    heartpain: "Cardiologist",
    bp: "Cardiologist",
    anxiety: "Psychiatrist",
    diabetes: "Endocrinologist",
    thyroid: "Endocrinologist",
    eyeirritation: "Ophthalmologist",
    vision: "Ophthalmologist",
    earpain: "ENT Specialist",
    hearing: "ENT Specialist",
    toothpain: "Dentist",
    gumbleed: "Dentist",
    mentalstress: "Psychiatrist",
    pregnancy: "Gynecologist",
    periodpain: "Gynecologist",
    kidneypain: "Nephrologist",
    urineinfection: "Nephrologist",
    allergy: "General Physician",
    fatigue: "General Physician",
    dizziness: "General Physician",
    weightloss: "Endocrinologist"
};

const problemLabelMap = {
    fever: "Fever",
    cold: "Cold",
    cough: "Cough",
    headache: "Headache",
    bodypain: "Body Pain",
    stomachpain: "Stomach Pain",
    vomiting: "Vomiting",
    diarrhea: "Diarrhea",
    chestpain: "Chest Pain",
    breathing: "Breathing Difficulty",
    skinalergy: "Skin Allergy",
    acne: "Acne",
    rash: "Skin Rash",
    hairloss: "Hair Loss",
    fracture: "Fracture",
    jointpain: "Joint Pain",
    backpain: "Back Pain",
    kneepain: "Knee Pain",
    childfever: "Child Fever",
    childcold: "Child Cold",
    heartpain: "Heart Pain",
    bp: "High Blood Pressure",
    anxiety: "Anxiety",
    diabetes: "Diabetes",
    thyroid: "Thyroid Problem",
    eyeirritation: "Eye Irritation",
    vision: "Blurred Vision",
    earpain: "Ear Pain",
    hearing: "Hearing Issue",
    toothpain: "Tooth Pain",
    gumbleed: "Gum Bleeding",
    mentalstress: "Mental Stress",
    pregnancy: "Pregnancy Check",
    periodpain: "Period Pain",
    kidneypain: "Kidney Pain",
    urineinfection: "Urine Infection",
    allergy: "Seasonal Allergy",
    fatigue: "Fatigue",
    dizziness: "Dizziness",
    weightloss: "Unexplained Weight Loss"
};

const problemKeywordMap = {
    fever: ["fever", "high temperature", "temperature", "body hot"],
    cold: ["cold", "runny nose", "sneezing", "blocked nose"],
    cough: ["cough", "dry cough", "wet cough", "throat irritation"],
    headache: ["headache", "migraine", "head pain"],
    chestpain: ["chest pain", "tightness in chest", "heart pain"],
    skinalergy: ["skin allergy", "itchy skin", "rash", "red patches"],
    acne: ["acne", "pimple", "pimples", "breakout"],
    rash: ["rash", "skin rash"],
    hairloss: ["hair loss", "hair fall"],
    fracture: ["fracture", "broken bone"],
    jointpain: ["joint pain", "knee pain", "back pain"],
    backpain: ["back pain", "lower back pain"],
    kneepain: ["knee pain", "knee swelling"],
    bodypain: ["body pain", "body ache"],
    stomachpain: ["stomach pain", "abdominal pain"],
    vomiting: ["vomiting", "nausea"],
    diarrhea: ["diarrhea", "loose motion"],
    breathing: ["breathing difficulty", "shortness of breath"],
    childfever: ["child fever", "kid fever"],
    childcold: ["child cold", "kid cold"],
    heartpain: ["heart pain", "pain near heart"],
    bp: ["high blood pressure", "bp high", "hypertension"],
    anxiety: ["anxiety", "panic", "stressed", "mental stress"],
    diabetes: ["diabetes", "sugar", "blood sugar"],
    thyroid: ["thyroid", "thyroid problem"],
    eyeirritation: ["eye irritation", "itchy eye", "red eyes"],
    vision: ["blurred vision", "blurry vision"],
    earpain: ["ear pain", "ear ache"],
    hearing: ["hearing issue", "hearing loss"],
    toothpain: ["tooth pain", "toothache"],
    gumbleed: ["gum bleeding", "bleeding gums"],
    mentalstress: ["mental stress", "stressed"],
    pregnancy: ["pregnancy", "pregnancy check"],
    periodpain: ["period pain", "menstrual pain", "cramps"],
    kidneypain: ["kidney pain", "flank pain"],
    urineinfection: ["urine infection", "uti", "burning urination"],
    allergy: ["seasonal allergy", "allergy"],
    fatigue: ["fatigue", "tired", "weakness"],
    dizziness: ["dizziness", "dizzy", "lightheaded"],
    weightloss: ["weight loss", "unexplained weight loss"]
};

const problemAdviceMap = {
    fever: "Drink fluids and rest. Consult a physician if fever lasts more than 2 to 3 days.",
    cold: "Warm fluids and steam inhalation can help. See a physician if symptoms worsen.",
    cough: "Stay hydrated and avoid irritants. Persistent cough should be checked by a physician.",
    headache: "Rest in a calm environment and hydrate. Recurrent headaches need medical review.",
    bodypain: "Gentle rest and hydration are useful. Consult a doctor if pain is persistent.",
    stomachpain: "Eat light and hydrate. Seek care if pain is severe or recurring.",
    vomiting: "Take oral fluids in small amounts. Consult a doctor if vomiting continues.",
    diarrhea: "Maintain hydration and electrolyte intake. Seek care if it lasts over 24 hours.",
    chestpain: "Seek immediate medical attention from a cardiologist.",
    breathing: "Breathing issues require urgent medical assessment if persistent.",
    skinalergy: "Avoid known triggers and consult a dermatologist if irritation persists.",
    acne: "Maintain skin hygiene and consult a dermatologist if acne persists.",
    rash: "Keep the skin clean and dry. Persistent rash should be examined by a dermatologist.",
    hairloss: "Nutritional and hormonal causes are common. Consult a dermatologist for evaluation.",
    fracture: "Immobilize the affected area and consult an orthopedic specialist immediately.",
    jointpain: "Avoid strain and use support. Persistent pain should be evaluated by orthopedics.",
    backpain: "Maintain posture and avoid heavy lifting. Persistent pain needs orthopedic review.",
    kneepain: "Reduce impact activity and seek orthopedic advice for ongoing pain.",
    childfever: "Monitor temperature closely and consult a pediatrician promptly.",
    childcold: "Keep the child hydrated and warm. Consult a pediatrician for persistent symptoms.",
    heartpain: "Potentially serious. Seek immediate cardiology care.",
    bp: "Monitor pressure regularly and consult a cardiologist for management.",
    diabetes: "Track sugar levels and follow diet/medication guidance from an endocrinologist.",
    thyroid: "Thyroid issues require endocrine evaluation and blood test follow-up.",
    eyeirritation: "Avoid rubbing eyes and consult an ophthalmologist if irritation continues.",
    vision: "Blurred vision should be assessed by an ophthalmologist as early as possible.",
    earpain: "Avoid self-medication and consult an ENT specialist for proper diagnosis.",
    hearing: "Hearing issues should be evaluated by an ENT specialist quickly.",
    toothpain: "Maintain oral hygiene and consult a dentist for treatment.",
    gumbleed: "Use gentle brushing and visit a dentist to check gum health.",
    mentalstress: "Maintain sleep routine and seek support from a psychiatrist if persistent.",
    anxiety: "Breathing exercises can help. Consult a psychiatrist for ongoing anxiety.",
    pregnancy: "Schedule regular prenatal checks with a gynecologist.",
    periodpain: "Use heat and hydration. Consult a gynecologist if pain is severe.",
    kidneypain: "Hydration and urgent nephrology review are advised for persistent pain.",
    urineinfection: "Increase fluids and consult a nephrologist for appropriate treatment.",
    allergy: "Avoid triggers and consult a physician if symptoms recur.",
    fatigue: "Check sleep, hydration, and nutrition. Consult a physician if fatigue continues.",
    dizziness: "Sit or lie down and hydrate. Recurrent dizziness needs medical evaluation.",
    weightloss: "Unexplained weight loss needs prompt endocrine and physician assessment."
};

function formatTimeSlot(minutesFromMidnight) {
    const hour24 = Math.floor(minutesFromMidnight / 60);
    const minute = minutesFromMidnight % 60;
    const meridian = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${meridian}`;
}

function populateHalfHourSlots(selectElement, startHour = 8, endHour = 21) {
    if (!selectElement) {
        return;
    }

    const existingValue = selectElement.value;
    selectElement.innerHTML = "<option value=\"\">Select slot</option>";

    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
        const label = formatTimeSlot(minutes);
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        selectElement.appendChild(option);
    }

    if (existingValue) {
        selectElement.value = existingValue;
    }
}

function initializeServiceTimeSlots() {
    [clinicTimeInput, restaurantTimeInput, salonTimeInput].forEach((timeSelect) => {
        populateHalfHourSlots(timeSelect, 8, 21);
    });
}

function resetServicePanels() {
    [clinicFields, restaurantFields, salonFields, medicineFields].forEach((section) => {
        if (section) {
            section.classList.remove("active");
        }
    });
}

function toggleServicePanel(value) {
    resetServicePanels();

    if (value === "clinic" && clinicFields) clinicFields.classList.add("active");
    if (value === "restaurant" && restaurantFields) restaurantFields.classList.add("active");
    if (value === "salon" && salonFields) salonFields.classList.add("active");
    if (value === "medicine" && medicineFields) medicineFields.classList.add("active");

    updatePricePreview();
}

if (serviceTypeSelect) {
    serviceTypeSelect.addEventListener("change", (event) => {
        toggleServicePanel(event.target.value);
    });
}

function syncDoctorFieldsFromProblem(problemKey) {
    if (!problemKey) {
        updateClinicDoctorSuggestion();
        return;
    }

    const specialization = problemSpecializationMap[problemKey] || "General Physician";
    let clinicName = nearbyClinicSelect ? nearbyClinicSelect.value : "";

    if (!clinicName || !(clinicDoctorDirectory[clinicName] || []).some((doctor) => doctor.specialization === specialization)) {
        clinicName = getFirstClinicForSpecialization(specialization);
        if (nearbyClinicSelect) {
            nearbyClinicSelect.value = clinicName;
        }
    }

    updateClinicDoctorSuggestion();
}

if (problemSelect) {
    problemSelect.addEventListener("change", () => {
        const problemKey = problemSelect.value;

        if (!problemKey) {
            if (doctorSuggestion) doctorSuggestion.value = "";
            updateClinicDoctorSuggestion();
            if (doctorAdvice) {
                doctorAdvice.textContent = "Select a problem to get specialist guidance.";
                doctorAdvice.classList.remove("text-danger");
            }
            return;
        }

        syncDoctorFieldsFromProblem(problemKey);

        if (doctorAdvice) {
            doctorAdvice.textContent = problemAdviceMap[problemKey] || "Consult the recommended specialist for detailed diagnosis and treatment.";
        }
    });
}

if (nearbyClinicSelect) {
    nearbyClinicSelect.addEventListener("change", () => {
        updateClinicDoctorSuggestion();
    });
}

if (adminClinicSelect) {
    adminClinicSelect.addEventListener("change", () => {
        populateAdminDoctorOptions(adminClinicSelect.value);
        renderAdminAppointmentsTable([]);
        setAdminDelayMessage("Select a doctor and date to preview upcoming appointments.", "muted");
    });
}

if (adminDoctorSelect) {
    adminDoctorSelect.addEventListener("change", () => {
        loadAdminAppointments();
    });
}

if (adminAppointmentDateInput) {
    adminAppointmentDateInput.addEventListener("change", () => {
        loadAdminAppointments();
    });
}

if (adminRefreshAppointmentsBtn) {
    adminRefreshAppointmentsBtn.addEventListener("click", () => {
        loadAdminAppointments();
    });
}

if (adminApplyDelayBtn) {
    adminApplyDelayBtn.addEventListener("click", () => {
        applyAdminDelayUpdate();
    });
}

if (serviceProviderClinic && doctorSuggestion) {
    serviceProviderClinic.addEventListener("change", () => {
        const doctorName = serviceProviderClinic.value;
        doctorSuggestion.value = doctorName ? doctorName.replace(/ \(.+\)$/, "") : "";
        scheduleLiveWaitPrediction();
    });
}

[clinicDateInput, clinicTimeInput, priorityBookingInput].forEach((input) => {
    if (!input) {
        return;
    }

    const eventName = input.tagName === "INPUT" ? "input" : "change";
    input.addEventListener(eventName, () => {
        scheduleLiveWaitPrediction();
    });
});

function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function detectProblemFromMessage(message) {
    const text = normalizeText(message);

    if (!text) return null;

    let bestProblem = null;
    let bestScore = 0;

    Object.entries(problemKeywordMap).forEach(([problemKey, keywords]) => {
        let score = 0;
        keywords.forEach((keyword) => {
            const normalizedKeyword = normalizeText(keyword);
            if (text.includes(normalizedKeyword)) {
                score += normalizedKeyword.includes(" ") ? 2 : 1;
            }
        });

        if (score > bestScore) {
            bestProblem = problemKey;
            bestScore = score;
        }
    });

    return bestProblem;
}

function getBasicAdvice(problemLabel, specialization) {
    if (specialization === "Cardiologist") {
        return `${problemLabel} can be serious. Please avoid exertion and seek urgent medical attention if pain persists.`;
    }

    if (specialization === "Psychiatrist") {
        return `${problemLabel} can improve with support. Maintain sleep routine and consult a specialist for persistent symptoms.`;
    }

    if (specialization === "General Physician") {
        return `${problemLabel} is often manageable with hydration, rest, and monitoring. Consult a doctor if it worsens.`;
    }

    return `${problemLabel} should be evaluated by a ${specialization}. Keep hydrated and seek care if symptoms continue.`;
}

function appendMessage(text, type) {
    if (!assistantMessages) return;

    const message = document.createElement("div");
    message.className = `chat-message ${type === "user" ? "user-message" : "bot-message"}`;
    message.textContent = text;
    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function openAssistant() {
    if (!assistantPanel) return;

    assistantPanel.classList.add("open");
    if (assistantInput) assistantInput.focus();
}

function closeAssistant() {
    if (!assistantPanel) return;
    assistantPanel.classList.remove("open");
}

if (assistantToggle) {
    assistantToggle.addEventListener("click", () => {
        if (!assistantPanel) return;
        assistantPanel.classList.contains("open") ? closeAssistant() : openAssistant();
    });
}

if (assistantClose) {
    assistantClose.addEventListener("click", closeAssistant);
}

document.addEventListener("click", (event) => {
    if (!assistantPanel || !assistantToggle) return;

    const widget = document.querySelector(".assistant-widget");
    if (assistantPanel.classList.contains("open") && widget && !widget.contains(event.target)) {
        closeAssistant();
    }
});

if (assistantForm) {
    assistantForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!assistantInput) return;

        const userMessage = assistantInput.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, "user");

        const detectedProblemKey = detectProblemFromMessage(userMessage);
        if (!detectedProblemKey) {
            appendMessage("I am not fully sure about the condition yet. Please share more symptoms or consult a General Physician.", "bot");
            assistantInput.value = "";
            return;
        }

        const problemLabel = problemLabelMap[detectedProblemKey] || "your symptoms";
        const specialization = problemSpecializationMap[detectedProblemKey] || "General Physician";
        const advice = getBasicAdvice(problemLabel, specialization);

        if (serviceTypeSelect) {
            serviceTypeSelect.value = "clinic";
            toggleServicePanel("clinic");
        }

        if (problemSelect) {
            problemSelect.value = detectedProblemKey;
            syncDoctorFieldsFromProblem(detectedProblemKey);
        }

        appendMessage(`Detected: ${problemLabel}. Recommended specialist: ${specialization}. ${advice}`, "bot");
        assistantInput.value = "";
    });
}

setupPasswordToggle("toggleRegisterPassword", "registerPassword");
setupPasswordToggle("toggleRegisterConfirmPassword", "registerConfirmPassword");
setupPasswordToggle("toggleLoginPassword", "loginPassword");

if (openLoginFromRegister) {
    openLoginFromRegister.addEventListener("click", (event) => {
        event.preventDefault();
        switchBootstrapModal(registerModalElement, loginModalElement);
    });
}

if (openRegisterFromLogin) {
    openRegisterFromLogin.addEventListener("click", (event) => {
        event.preventDefault();
        switchBootstrapModal(loginModalElement, registerModalElement);
    });
}

if (registerFormModal) {
    registerFormModal.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullName = document.getElementById("registerFullName");
        const email = document.getElementById("registerEmail");
        const phone = document.getElementById("registerPhone");
        const password = document.getElementById("registerPassword");
        const confirmPassword = document.getElementById("registerConfirmPassword");

        const payload = {
            full_name: fullName ? fullName.value.trim() : "",
            email: email ? email.value.trim() : "",
            phone: phone ? phone.value.trim() : "",
            password: password ? password.value : "",
            confirm_password: confirmPassword ? confirmPassword.value : ""
        };

        if (!payload.full_name) {
            setFormMessage(registerFormMessage, "Full Name must not be empty", true);
            return;
        }

        if (!isValidEmail(payload.email)) {
            setFormMessage(registerFormMessage, "Email must be in valid format", true);
            return;
        }

        if (!isValidPhone(payload.phone)) {
            setFormMessage(registerFormMessage, "Phone number must be exactly 10 digits", true);
            return;
        }

        if (payload.password.length < 6) {
            setFormMessage(registerFormMessage, "Password must be at least 6 characters", true);
            return;
        }

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
            confirmPassword.reportValidity();
            setFormMessage(registerFormMessage, "Confirm Password must match Password", true);
            return;
        }

        if (confirmPassword) {
            confirmPassword.setCustomValidity("");
        }

        setFormMessage(registerFormMessage, "Creating account...", false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setFormMessage(registerFormMessage, data.message || "Registration failed", true);
                return;
            }

            saveProfileFromRegistration(payload);

            setFormMessage(registerFormMessage, data.message || "Account created successfully", false);

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 600);
        } catch (error) {
            setFormMessage(registerFormMessage, "Unable to connect to server", true);
        }
    });
}

if (loginFormModal) {
    loginFormModal.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail");
        const password = document.getElementById("loginPassword");

        const payload = {
            email: email ? email.value.trim() : "",
            password: password ? password.value : ""
        };

        if (!isValidEmail(payload.email)) {
            setFormMessage(loginFormMessage, "Email must be in valid format", true);
            return;
        }

        if (!payload.password) {
            setFormMessage(loginFormMessage, "Password is required", true);
            return;
        }

        setFormMessage(loginFormMessage, "Logging in...", false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setFormMessage(loginFormMessage, data.message || "Invalid email or password", true);
                return;
            }

            setSessionOnLogin(payload.email);
            syncNavbarAuthState();

            setFormMessage(loginFormMessage, data.message || "Login successful", false);

            setTimeout(() => {
                window.location.href = "/booking.html";
            }, 400);
        } catch (error) {
            setFormMessage(loginFormMessage, "Unable to connect to server", true);
        }
    });
}

function getServiceLabel(serviceType) {
    const map = {
        clinic: "Clinic",
        restaurant: "Restaurant Reservation",
        salon: "Salon Visit",
        medicine: "Medicine"
    };

    return map[serviceType] || "Not Selected";
}

function generateBookingId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "ATRX";

    for (let i = 0; i < 7; i += 1) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
}

function validateBookingInputs(serviceType) {
    const name = (fullNameInput && fullNameInput.value.trim()) || "";
    const phone = (phoneNumberInput && phoneNumberInput.value.trim()) || "";
    const email = (emailAddressInput && emailAddressInput.value.trim()) || "";
    const paymentMethod = (paymentMethodInput && paymentMethodInput.value) || "";

    if (!name) return "Full Name is required.";
    if (!isValidPhone(phone)) return "Phone Number must be exactly 10 digits.";
    if (!isValidEmail(email)) return "Email must be in valid format.";
    if (!paymentMethod) return "Please choose a payment method.";

    if (serviceType === "clinic") {
        if (!problemSelect || !problemSelect.value) return "Select your medical problem.";
        if (!nearbyClinicSelect || !nearbyClinicSelect.value) return "Select a nearby clinic.";
        if (!serviceProviderClinic || !serviceProviderClinic.value) return "Select a service provider.";
        if (!clinicDateInput || !clinicDateInput.value) return "Select an appointment date.";
        if (!clinicTimeInput || !clinicTimeInput.value) return "Select an appointment time slot.";
        return null;
    }

    if (serviceType === "restaurant") {
        if (!restaurantProviderInput || !restaurantProviderInput.value) return "Select a restaurant.";
        if (!restaurantDateInput || !restaurantDateInput.value) return "Select reservation date.";
        if (!restaurantTimeInput || !restaurantTimeInput.value) return "Select reservation slot.";
        const people = Number((restaurantPeopleInput && restaurantPeopleInput.value) || 0);
        if (!Number.isFinite(people) || people < 1) return "Number of people must be at least 1.";
        return null;
    }

    if (serviceType === "salon") {
        if (!salonProviderInput || !salonProviderInput.value) return "Select a salon.";
        if (!salonServiceInput || !salonServiceInput.value) return "Select a salon service.";
        if (!salonDateInput || !salonDateInput.value) return "Select service date.";
        if (!salonTimeInput || !salonTimeInput.value) return "Select service time slot.";
        return null;
    }

    if (serviceType === "medicine") {
        if (!medicineRequestInput || !medicineRequestInput.value.trim()) return "Enter medicine request details.";
        if (!medicineDateInput || !medicineDateInput.value) return "Select delivery date.";
        if (!medicineTimeInput || !medicineTimeInput.value) return "Select delivery slot.";
        return null;
    }

    return "Please choose a valid service type.";
}

function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function buildUpiLink({ amount, bookingId, patientName }) {
    const amountValue = Math.max(Number(amount) || 0, 0);
    const safePatientName = (patientName || "Patient").trim() || "Patient";
    const params = new URLSearchParams({
        pa: UPI_RECEIVER_ID,
        pn: UPI_RECEIVER_NAME,
        am: String(amountValue),
        cu: "INR",
        tn: `ClinicAppointmentBooking-${bookingId}`,
    });
    return `upi://pay?${params.toString()}`;
}

function showQrPaymentModal(upiLink, bookingDetails) {
    const pendingPayment = {
        paymentStatus: "Pending",
        bookingId: bookingDetails.bookingId,
        patientName: bookingDetails.patientName,
        doctorName: bookingDetails.doctorName,
        clinicName: bookingDetails.clinicName,
        amountToPay: bookingDetails.amountToPay,
        appointmentDate: bookingDetails.appointmentDate,
        appointmentTime: bookingDetails.appointmentTime,
        paymentMethod: "Google Pay - QR",
        createdAt: new Date().toISOString(),
        clinicPayload: bookingDetails.clinicPayload,
        upiLink: upiLink,
    };

    try {
        sessionStorage.setItem(GPAY_PENDING_BOOKING_KEY, JSON.stringify(pendingPayment));
    } catch (error) {
        setWaitPredictionMessage("Unable to store payment data.", "error");
        return;
    }

    const qrModal = document.getElementById("qrPaymentModal");
    if (qrModal && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(qrModal);
        modal.show();
    }
}

function handoffToGooglePayForClinic() {
    const bookingId = generateBookingId();
    const clinicPayload = getClinicBookingPayload();
    clinicPayload.booking_id = bookingId;

    const bookingDetails = {
        bookingId,
        patientName: clinicPayload.name,
        doctorName: clinicPayload.doctor_name,
        clinicName: clinicPayload.clinic_name,
        amountToPay: clinicPayload.total_amount,
        appointmentDate: clinicPayload.appointment_date,
        appointmentTime: clinicPayload.time_slot,
        clinicPayload,
    };

    const upiLink = buildUpiLink({
        amount: bookingDetails.amountToPay,
        bookingId,
        patientName: bookingDetails.patientName,
    });

    if (isMobileDevice()) {
        const pendingPayment = {
            paymentStatus: "Successful",
            ...bookingDetails,
            paymentMethod: "Google Pay - Mobile",
            createdAt: new Date().toISOString(),
            upiLink,
        };

        try {
            sessionStorage.setItem(GPAY_PENDING_BOOKING_KEY, JSON.stringify(pendingPayment));
        } catch (error) {
            setWaitPredictionMessage("Unable to open payment flow right now.", "error");
            return;
        }

        setWaitPredictionMessage("Opening Google Pay...", "success");
        setTimeout(() => {
            window.location.href = upiLink;
        }, 300);

        setTimeout(() => {
            window.location.href = "/confirmation.html?source=gpay_mobile";
        }, 2000);
    } else {
        setWaitPredictionMessage("Scan QR code with your phone to complete payment.", "info");
        showQrPaymentModal(upiLink, bookingDetails);
    }
}

function getCouponEvaluation(code, baseAmount, serviceType) {
    const coupon = code.toUpperCase();

    if (!coupon) {
        return { isValid: false, discount: 0, message: "No coupon applied." };
    }

    if (coupon === "ATR50") {
        if (baseAmount < 500) {
            return { isValid: false, discount: 0, message: "ATR50 requires minimum INR 500." };
        }
        return { isValid: true, discount: 50, message: "ATR50 applied: INR 50 off." };
    }

    if (coupon === "HEALTH10") {
        if (!(serviceType === "clinic" || serviceType === "medicine")) {
            return { isValid: false, discount: 0, message: "HEALTH10 valid only for Clinic and Medicine." };
        }
        if (baseAmount < 800) {
            return { isValid: false, discount: 0, message: "HEALTH10 requires minimum INR 800." };
        }
        const discount = Math.min(Math.round(baseAmount * 0.1), 300);
        return { isValid: true, discount, message: `HEALTH10 applied: INR ${discount} off.` };
    }

    if (coupon === "WELCOME100") {
        if (baseAmount < 1000) {
            return { isValid: false, discount: 0, message: "WELCOME100 requires minimum INR 1000." };
        }
        return { isValid: true, discount: 100, message: "WELCOME100 applied: INR 100 off." };
    }

    return { isValid: false, discount: 0, message: "Invalid coupon code." };
}

function calculateBaseAmount(serviceType) {
    const base = SERVICE_BASE_PRICES[serviceType] || 0;

    if (serviceType === "restaurant") {
        const people = Number((restaurantPeopleInput && restaurantPeopleInput.value) || 1);
        return Math.max(base, people * 300);
    }

    if (serviceType === "salon") {
        const serviceName = (salonServiceInput && salonServiceInput.value) || "";
        return base + (SALON_SERVICE_ADDONS[serviceName] || 0);
    }

    return base;
}

function updateCouponFeedback(message, type) {
    if (!couponFeedback) return;

    couponFeedback.textContent = message;
    couponFeedback.classList.remove("text-muted", "text-success", "text-danger");

    if (type === "success") {
        couponFeedback.classList.add("text-success");
        return;
    }

    if (type === "error") {
        couponFeedback.classList.add("text-danger");
        return;
    }

    couponFeedback.classList.add("text-muted");
}

function calculatePricing() {
    const serviceType = serviceTypeSelect ? serviceTypeSelect.value : "";
    const baseAmount = calculateBaseAmount(serviceType);

    const couponResult = getCouponEvaluation(appliedCouponCode, baseAmount, serviceType);
    const couponDiscount = couponResult.isValid ? couponResult.discount : 0;

    const priorityDiscount = priorityBookingInput && priorityBookingInput.checked ? PRIORITY_DISCOUNT_VALUE : 0;
    const totalAmount = Math.max(baseAmount - couponDiscount - priorityDiscount, 0);

    return {
        baseAmount,
        couponCode: couponResult.isValid ? appliedCouponCode : "None",
        couponDiscount,
        priorityDiscount,
        totalAmount,
        couponMessage: couponResult.message,
        couponValid: couponResult.isValid
    };
}

function updatePricePreview() {
    const pricing = calculatePricing();

    if (totalAmountInput) {
        totalAmountInput.value = String(pricing.totalAmount);
    }

    if (priceBreakdown) {
        priceBreakdown.textContent = `Base: INR ${pricing.baseAmount} | Coupon: INR ${pricing.couponDiscount} | Priority Discount: INR ${pricing.priorityDiscount}`;
    }

    if (appliedCouponCode) {
        updateCouponFeedback(pricing.couponMessage, pricing.couponValid ? "success" : "error");
    }
}

if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", () => {
        const code = ((couponCodeInput && couponCodeInput.value) || "").trim().toUpperCase();

        if (!code) {
            appliedCouponCode = "";
            updateCouponFeedback("Enter a coupon code to apply.", "error");
            updatePricePreview();
            return;
        }

        appliedCouponCode = code;
        updatePricePreview();
    });
}

if (couponCodeInput) {
    couponCodeInput.addEventListener("input", () => {
        const draftCode = couponCodeInput.value.trim().toUpperCase();
        if (draftCode !== appliedCouponCode) {
            updateCouponFeedback("Coupon edited. Click Apply Coupon.", "neutral");
        }
    });
}

[priorityBookingInput, restaurantPeopleInput, salonServiceInput].forEach((input) => {
    if (input) {
        input.addEventListener("change", updatePricePreview);
    }
});

function getServiceBookingDetails(serviceType) {
    if (serviceType === "clinic") {
        return {
            provider: (serviceProviderClinic && serviceProviderClinic.value) || "Not Selected",
            date: (clinicDateInput && clinicDateInput.value) || "Not Selected",
            time: (clinicTimeInput && clinicTimeInput.value) || "Not Selected"
        };
    }

    if (serviceType === "restaurant") {
        return {
            provider: (restaurantProviderInput && restaurantProviderInput.value) || "Not Selected",
            date: (restaurantDateInput && restaurantDateInput.value) || "Not Selected",
            time: (restaurantTimeInput && restaurantTimeInput.value) || "Not Selected"
        };
    }

    if (serviceType === "salon") {
        const salonProvider = (salonProviderInput && salonProviderInput.value) || "Not Selected";
        const salonService = (salonServiceInput && salonServiceInput.value) || "General Service";
        return {
            provider: `${salonProvider} - ${salonService}`,
            date: (salonDateInput && salonDateInput.value) || "Not Selected",
            time: (salonTimeInput && salonTimeInput.value) || "Not Selected"
        };
    }

    return {
        provider: (medicineRequestInput && medicineRequestInput.value) || "Partner Pharmacy",
        date: (medicineDateInput && medicineDateInput.value) || "Not Selected",
        time: (medicineTimeInput && medicineTimeInput.value) || "Not Selected"
    };
}

function getBookingPayload(serviceType, bookingId) {
    const serviceDetails = getServiceBookingDetails(serviceType);
    const pricing = calculatePricing();
    const predictedWaitText = (predictedWaitingTimeOutput && predictedWaitingTimeOutput.textContent) || "--";
    const expectedConsultationText = (expectedConsultationTimeOutput && expectedConsultationTimeOutput.textContent) || "--";

    return {
        bookingId,
        name: (fullNameInput && fullNameInput.value.trim()) || "-",
        phoneNumber: (phoneNumberInput && phoneNumberInput.value.trim()) || "-",
        email: (emailAddressInput && emailAddressInput.value.trim()) || "-",
        serviceType: getServiceLabel(serviceType),
        provider: serviceDetails.provider,
        bookingDate: serviceDetails.date,
        timeSlot: serviceDetails.time,
        couponCode: pricing.couponCode,
        couponDiscount: pricing.couponDiscount,
        priorityBooking: !!(priorityBookingInput && priorityBookingInput.checked),
        paymentMethod: (paymentMethodInput && paymentMethodInput.value) || "Not Selected",
        predictedWait: predictedWaitText,
        expectedConsultation: expectedConsultationText,
        totalAmount: pricing.totalAmount,
        priorityDiscount: pricing.priorityDiscount,
        baseAmount: pricing.baseAmount,
        createdAt: new Date().toISOString()
    };
}

function getClinicBookingPayload() {
    const pricing = calculatePricing();
    const medicalProblem = problemSelect && problemSelect.selectedIndex >= 0
        ? problemSelect.options[problemSelect.selectedIndex].text
        : "";

    return {
        name: (fullNameInput && fullNameInput.value.trim()) || "",
        phone_number: (phoneNumberInput && phoneNumberInput.value.trim()) || "",
        email: (emailAddressInput && emailAddressInput.value.trim()) || "",
        medical_problem: medicalProblem,
        clinic_name: (nearbyClinicSelect && nearbyClinicSelect.value) || "",
        doctor_name: extractDoctorNameFromProvider((serviceProviderClinic && serviceProviderClinic.value) || ""),
        appointment_date: (clinicDateInput && clinicDateInput.value) || "",
        time_slot: (clinicTimeInput && clinicTimeInput.value) || "",
        priority_booking: !!(priorityBookingInput && priorityBookingInput.checked),
        payment_method: (paymentMethodInput && paymentMethodInput.value) || "Not Selected",
        coupon_code: pricing.couponCode,
        coupon_discount: pricing.couponDiscount,
        total_amount: pricing.totalAmount,
    };
}

function setBookingSubmitState(isSubmitting) {
    if (bookingForm) {
        bookingForm.dataset.submitting = isSubmitting ? "true" : "false";
    }
    if (confirmBookingBtn) {
        confirmBookingBtn.disabled = isSubmitting;
    }
}

function isBookingSubmitLocked() {
    return bookingForm ? bookingForm.dataset.submitting === "true" : false;
}

function saveBookingToLocal(details) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
        appendBookingHistory(details);

        if (localStorage.getItem(SESSION_KEYS.isLoggedIn) === "true") {
            incrementBookingCount();
        }
    } catch (error) {
        console.error("Local storage save failed", error);
    }
}

async function saveBookingToBackend(details) {
    const payload = JSON.stringify(details);
    const endpoints = ["/api/bookings", "/backend/bookings"];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            });

            if (response.ok) {
                return;
            }
        } catch (error) {
            // Ignore endpoint errors and keep local persistence as fallback.
        }
    }
}

function renderQr(details) {
    if (!bookingQr) return;

    bookingQr.innerHTML = "";

    new QRCode(bookingQr, {
        text: JSON.stringify(details),
        width: 240,
        height: 240,
        colorDark: "#b71f44",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function renderBookingConfirmation(details, options = { persist: true, startPolling: true }) {
    if (!bookingForm || !bookingConfirmation) return;

    if (displayBookingId) displayBookingId.textContent = details.bookingId;
    if (confirmName) confirmName.textContent = details.name;
    if (confirmDoctor) confirmDoctor.textContent = details.doctor || details.provider || "--";
    if (confirmClinic) confirmClinic.textContent = details.clinic || "--";
    if (confirmMedicalProblem) confirmMedicalProblem.textContent = details.medicalProblem || "--";
    if (confirmDate) confirmDate.textContent = details.bookingDate;
    if (confirmTime) confirmTime.textContent = details.timeSlot;
    if (confirmArrivalTime) confirmArrivalTime.textContent = details.arrivalTime || "--";
    if (confirmQueuePosition) confirmQueuePosition.textContent = details.queuePosition ?? "--";
    if (confirmPatientsAhead) confirmPatientsAhead.textContent = details.patientsAhead ?? "--";
    if (confirmAmount) confirmAmount.textContent = details.totalAmount;
    if (confirmPriorityDiscount) confirmPriorityDiscount.textContent = details.priorityDiscount;
    if (confirmPredictedWait) confirmPredictedWait.textContent = details.predictedWait || "--";
    if (confirmExpectedConsultation) confirmExpectedConsultation.textContent = details.expectedConsultation || "--";

    // Plain-language summary alert
    const summaryAlert = document.getElementById("confirmQueueSummaryAlert");
    const summaryText = document.getElementById("confirmQueueSummaryText");
    if (summaryAlert && summaryText) {
        const qPos = details.queuePosition ?? null;
        const pAhead = details.patientsAhead ?? null;
        const pWait = details.predictedWait || null;
        const expTime = details.expectedConsultation || null;
        if (qPos !== null && pWait !== null) {
            const aheadText = Number(pAhead) === 0
                ? "You are <strong>first in line</strong> — no one is ahead of you."
                : `<strong>${pAhead} patient${Number(pAhead) !== 1 ? "s" : ""}</strong> are ahead of you.`;
            summaryText.innerHTML =
                `You are <strong>#${qPos}</strong> in the queue. ${aheadText} ` +
                `You will wait approximately <strong>${pWait} minutes</strong> in the waiting area` +
                (expTime && expTime !== "--" ? `, and the doctor will see you at <strong>${expTime}</strong>.` : ".");
            summaryAlert.classList.remove("d-none");
        } else {
            summaryAlert.classList.add("d-none");
        }
    }
    if (confirmPaymentMethod) confirmPaymentMethod.textContent = details.paymentMethod;
    if (confirmCoupon) confirmCoupon.textContent = `${details.couponCode} (INR ${details.couponDiscount})`;

    renderQr(details);

    bookingForm.classList.add("d-none");
    bookingConfirmation.classList.remove("d-none");
    bookingConfirmation.classList.add("show-card");

    if (options.persist) {
        saveBookingToLocal(details);
    }

    if (options.startPolling !== false && details.bookingId && details.serviceType === "Clinic Appointment") {
        startBookingPolling(details.bookingId);
    }
}

function restoreBookingFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const saved = JSON.parse(raw);
        if (!saved || !saved.bookingId) return;

        renderBookingConfirmation(saved, { persist: false });
    } catch (error) {
        console.error("Restore from storage failed", error);
    }
}

if (bookingForm) {
    bookingForm.dataset.submitting = "false";

    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (isBookingSubmitLocked()) {
            return;
        }

        setBookingSubmitState(true);

        const serviceType = serviceTypeSelect ? serviceTypeSelect.value : "";
        if (!serviceType) {
            setBookingSubmitState(false);
            return;
        }

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            setWaitPredictionMessage("Please complete all required form fields.", "error");
            setBookingSubmitState(false);
            return;
        }

        const validationError = validateBookingInputs(serviceType);
        if (validationError) {
            setWaitPredictionMessage(validationError, "error");
            setBookingSubmitState(false);
            return;
        }

        const pricing = calculatePricing();
        if (pricing.totalAmount < 0) {
            setBookingSubmitState(false);
            return;
        }

        if (serviceType === "clinic") {
            const selectedPaymentMethod = (paymentMethodInput && paymentMethodInput.value) || "";
            if (selectedPaymentMethod === "Google Pay") {
                setWaitPredictionMessage("Redirecting to Google Pay...", "success");
                handoffToGooglePayForClinic();
                setBookingSubmitState(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(getClinicBookingPayload()),
                });

                const data = await response.json();
                if (!response.ok || !data.success || !data.booking) {
                    setWaitPredictionMessage((data && data.message) || "Unable to book appointment.", "error");
                    setBookingSubmitState(false);
                    return;
                }

                renderBookingConfirmation(data.booking);
                updateWaitPredictionOutput(data.booking.predictedWait || "--", data.booking.expectedConsultation || "--");
                setWaitPredictionMessage(
                    `Booked. Queue position ${data.booking.queuePosition}, patients ahead ${data.booking.patientsAhead}.`,
                    "success"
                );
                return;
            } catch (error) {
                setWaitPredictionMessage("Booking service unavailable. Ensure backend is running.", "error");
                setBookingSubmitState(false);
                return;
            }
        }

        const bookingId = generateBookingId();
        const details = getBookingPayload(serviceType, bookingId);
        renderBookingConfirmation(details);
    });
}

if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener("click", () => {
        if (!bookingForm || !bookingConfirmation) return;

        bookingConfirmation.classList.add("d-none");
        bookingConfirmation.classList.remove("show-card");
        bookingForm.classList.remove("d-none");
        stopBookingPolling();
        bookingForm.reset();
        resetServicePanels();
        appliedCouponCode = "";

        if (serviceTypeSelect) serviceTypeSelect.value = "";
        if (doctorSuggestion) doctorSuggestion.value = "";
        if (serviceProviderClinic) {
            serviceProviderClinic.innerHTML = "<option value=\"\">Select clinic first</option>";
        }
        resetWaitPredictionDisplay();
        setWaitPredictionLoading(false);

        updateCouponFeedback("Coupons: ATR50, HEALTH10, WELCOME100", "neutral");
        updatePricePreview();
        initializeNearbyClinics();

        setBookingSubmitState(false);

        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(WAIT_PREDICTION_STORAGE_KEY);
        } catch (error) {
            console.error("Local storage clear failed", error);
        }
    });
}

const qrPaymentModal = document.getElementById("qrPaymentModal");
const confirmQrPaymentBtn = document.getElementById("confirmQrPaymentBtn");

if (confirmQrPaymentBtn) {
    confirmQrPaymentBtn.dataset.submitting = "false";

    confirmQrPaymentBtn.addEventListener("click", () => {
        if (confirmQrPaymentBtn.dataset.submitting === "true") {
            return;
        }

        confirmQrPaymentBtn.dataset.submitting = "true";
        confirmQrPaymentBtn.disabled = true;

        const pending = (() => {
            try {
                const raw = sessionStorage.getItem(GPAY_PENDING_BOOKING_KEY);
                if (!raw) return null;
                return JSON.parse(raw);
            } catch {
                return null;
            }
        })();

        if (!pending || !pending.clinicPayload) {
            setWaitPredictionMessage("No pending payment data found.", "error");
            confirmQrPaymentBtn.dataset.submitting = "false";
            confirmQrPaymentBtn.disabled = false;
            if (qrPaymentModal && window.bootstrap) {
                bootstrap.Modal.getOrCreateInstance(qrPaymentModal).hide();
            }
            return;
        }

        if (qrPaymentModal && window.bootstrap) {
            bootstrap.Modal.getOrCreateInstance(qrPaymentModal).hide();
        }

        setWaitPredictionMessage("Payment successful! Confirming appointment...", "success");
        setTimeout(() => {
            window.location.href = "/confirmation.html?source=gpay_qr";
        }, 600);
    });
}

if (qrPaymentModal) {
    qrPaymentModal.addEventListener("shown.bs.modal", () => {
        const pending = (() => {
            try {
                const raw = sessionStorage.getItem(GPAY_PENDING_BOOKING_KEY);
                if (!raw) return null;
                return JSON.parse(raw);
            } catch {
                return null;
            }
        })();

        if (!pending || !pending.upiLink) return;

        const qrCodeDisplay = document.getElementById("qrCodeDisplay");
        if (!qrCodeDisplay) return;

        qrCodeDisplay.innerHTML = "";

        try {
            new QRCode(qrCodeDisplay, {
                text: pending.upiLink,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            qrCodeDisplay.innerHTML = "<p class=\"text-danger\">Failed to generate QR code</p>";
        }
    });
}

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", async () => {
        if (!bookingConfirmation || typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
            return;
        }

        const card = bookingConfirmation.querySelector(".confirmation-card");
        if (!card) return;

        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        });

        const imageData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let renderHeight = imgHeight;
        if (renderHeight > pageHeight - margin * 2) {
            renderHeight = pageHeight - margin * 2;
        }

        pdf.addImage(imageData, "PNG", margin, margin, imgWidth, renderHeight);
        pdf.save(`booking-${displayBookingId ? displayBookingId.textContent : "confirmation"}.pdf`);
    });
}

if (printConfirmationBtn) {
    printConfirmationBtn.addEventListener("click", () => {
        window.print();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", clearSessionAndRedirectToLogin);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function handleLink(event) {
        const targetSelector = this.getAttribute("href");
        if (!targetSelector || targetSelector === "#") return;

        const target = document.querySelector(targetSelector);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealNodes.length > 0) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
} else {
    revealNodes.forEach((node) => node.classList.add("in-view"));
}

initializeServiceTimeSlots();
initializeNearbyClinics();
populateAdminClinicOptions();
if (adminAppointmentDateInput) {
    adminAppointmentDateInput.value = new Date().toISOString().split("T")[0];
}
resetWaitPredictionDisplay();
restoreWaitPredictionFromLocal();
updateCouponFeedback("Coupons: ATR50, HEALTH10, WELCOME100", "neutral");
updatePricePreview();
syncNavbarAuthState();
openLoginModalIfRequested();
restoreBookingFromStorage();

}
