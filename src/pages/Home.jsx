import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import initializeHomePage from "../logic/homeLogic";

const HOME_BODY_HTML = `
<nav class="navbar navbar-expand-lg navbar-light sticky-top nav-shell">
    <div class="container py-2">
        <a class="navbar-brand brand-mark" href="#home">
            <span class="brand-dot"><i class="fa-solid fa-heart-pulse"></i></span>
            QUEZY
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
                <li class="nav-item"><a class="nav-link nav-hover" href="#home">Home</a></li>
                <li class="nav-item"><a class="nav-link nav-hover" href="#stats">Stats</a></li>
                <li class="nav-item"><a class="nav-link nav-hover" href="#services">Services</a></li>
                <li class="nav-item"><a class="nav-link nav-hover" href="#booking">Booking</a></li>
                <li class="nav-item"><a class="nav-link nav-hover" href="admin.html">Admin</a></li>
                <li class="nav-item"><a class="nav-link nav-hover" href="#footer">Contact</a></li>
            </ul>
            <div id="authButtons" class="d-flex align-items-center gap-2">
                <button id="navbarLoginBtn" class="btn btn-outline-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                <button id="navbarRegisterBtn" class="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
            </div>
            <div id="profileDropdown" class="dropdown d-none">
                <button class="btn btn-light border rounded-pill px-3 profile-toggle-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="profileToggleBtn">
                    <i class="fa-solid fa-user me-2"></i>
                    <span id="profileToggleName">Profile</span>
                </button>
                <div class="dropdown-menu dropdown-menu-end shadow-sm p-3 profile-dropdown-menu" aria-labelledby="profileToggleBtn">
                    <p class="mb-1 fw-semibold" id="profileName">--</p>
                    <p class="mb-1 small text-muted" id="profileEmail">--</p>
                    <p class="mb-2 small text-muted" id="profilePhone">--</p>
                    <p class="mb-3 small"><strong>Bookings Done:</strong> <span id="bookingCount">0</span></p>
                    <a id="viewBookingHistoryBtn" class="btn btn-sm btn-outline-primary w-100 mb-2" href="/booking-history.html">View Booking History</a>
                    <button id="logoutBtn" type="button" class="btn btn-sm btn-danger w-100">Logout</button>
                </div>
            </div>
        </div>
    </div>
</nav>

<header id="home" class="hero-wrap section-space reveal">
    <div class="container">
        <div class="row g-4 align-items-center">
            <div class="col-lg-7">
                <span class="badge rounded-pill text-bg-light hero-badge mb-3">Smart Booking Platform</span>
                <h1 class="hero-title">Healthcare and lifestyle bookings in one elegant experience.</h1>
                <p class="hero-subtitle">Book clinic visits, salon slots, restaurant tables, and medicine orders with real-time support and zero queue friction.</p>
                <div class="d-flex flex-wrap gap-3 mt-4">
                    <a href="#booking" class="btn btn-primary btn-lg rounded-pill cta-btn">Book Appointment</a>
                    <a href="#services" class="btn btn-light btn-lg rounded-pill cta-alt">Explore Services</a>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="hero-card">
                    <h3 class="mb-3">Trusted Digital Care</h3>
                    <div class="d-flex justify-content-between mini-stat mb-3">
                        <span>Average wait reduced</span>
                        <strong>68%</strong>
                    </div>
                    <div class="d-flex justify-content-between mini-stat mb-3">
                        <span>Support availability</span>
                        <strong>24/7</strong>
                    </div>
                    <div class="d-flex justify-content-between mini-stat">
                        <span>Patient satisfaction</span>
                        <strong>4.9/5</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<section id="stats" class="section-space reveal">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-4">
                <div class="stats-card">
                    <i class="fa-solid fa-calendar-check"></i>
                    <h2>500+</h2>
                    <p>Bookings every week</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stats-card">
                    <i class="fa-solid fa-headset"></i>
                    <h2>24/7</h2>
                    <p>Live support coverage</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stats-card">
                    <i class="fa-solid fa-user-doctor"></i>
                    <h2>100+</h2>
                    <p>Verified doctors onboard</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="services" class="section-space reveal">
    <div class="container">
        <div class="section-head text-center mb-5">
            <p class="eyebrow">OUR SERVICES</p>
            <h2>Everything bookable in one dashboard</h2>
        </div>
        <div class="row g-4">
            <div class="col-md-6 col-xl-3">
                <article class="service-card h-100">
                    <div class="icon-pill"><i class="fa-solid fa-stethoscope"></i></div>
                    <h4>Clinic Booking</h4>
                    <p>Connect with general physicians and specialists with suggested doctor matching.</p>
                </article>
            </div>
            <div class="col-md-6 col-xl-3">
                <article class="service-card h-100">
                    <div class="icon-pill"><i class="fa-solid fa-utensils"></i></div>
                    <h4>Restaurant Booking</h4>
                    <p>Reserve your table without calls and get priority booking in peak hours.</p>
                </article>
            </div>
            <div class="col-md-6 col-xl-3">
                <article class="service-card h-100">
                    <div class="icon-pill"><i class="fa-solid fa-scissors"></i></div>
                    <h4>Salon Booking</h4>
                    <p>Choose your stylist, services, and preferred slot in a minute.</p>
                </article>
            </div>
            <div class="col-md-6 col-xl-3">
                <article class="service-card h-100">
                    <div class="icon-pill"><i class="fa-solid fa-pills"></i></div>
                    <h4>Medicine Ordering</h4>
                    <p>Place medicine requests quickly through partnered pharmacies.</p>
                </article>
            </div>
        </div>
    </div>
</section>

<section id="booking" class="section-space reveal">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-10 col-xl-9">
                <div class="booking-shell">
                    <div class="section-head mb-4">
                        <p class="eyebrow">BOOK APPOINTMENT</p>
                        <h2>Reserve your slot in under 2 minutes</h2>
                    </div>
                    <form id="bookingForm" class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Full Name</label>
                            <input id="fullName" type="text" class="form-control" placeholder="Your name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Phone Number</label>
                            <input id="phoneNumber" type="tel" class="form-control" placeholder="10-digit number" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input id="emailAddress" type="email" class="form-control" placeholder="you@example.com" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Service Type</label>
                            <select id="serviceType" class="form-select" required>
                                <option value="">Select service</option>
                                <option value="clinic">Clinic Appointment</option>
                                <option value="restaurant">Restaurant Reservation</option>
                                <option value="salon">Salon Visit</option>
                            </select>
                        </div>

                        <div id="clinicFields" class="dynamic-service col-12">
                            <div class="row g-3 mt-1">
                                <div class="col-md-6">
                                    <label class="form-label">Select Your Problem</label>
                                    <select id="problemSelect" class="form-select">
                                        <option value="">Choose your symptom</option>
                                        <option value="fever">Fever</option>
                                        <option value="cold">Cold</option>
                                        <option value="cough">Cough</option>
                                        <option value="headache">Headache</option>
                                        <option value="bodypain">Body Pain</option>
                                        <option value="stomachpain">Stomach Pain</option>
                                        <option value="vomiting">Vomiting</option>
                                        <option value="diarrhea">Diarrhea</option>
                                        <option value="chestpain">Chest Pain</option>
                                        <option value="breathing">Breathing Difficulty</option>
                                        <option value="skinalergy">Skin Allergy</option>
                                        <option value="acne">Acne</option>
                                        <option value="rash">Skin Rash</option>
                                        <option value="hairloss">Hair Loss</option>
                                        <option value="fracture">Fracture</option>
                                        <option value="jointpain">Joint Pain</option>
                                        <option value="backpain">Back Pain</option>
                                        <option value="kneepain">Knee Pain</option>
                                        <option value="childfever">Child Fever</option>
                                        <option value="childcold">Child Cold</option>
                                        <option value="heartpain">Heart Pain</option>
                                        <option value="bp">High Blood Pressure</option>
                                        <option value="anxiety">Anxiety</option>
                                        <option value="diabetes">Diabetes</option>
                                        <option value="thyroid">Thyroid Problem</option>
                                        <option value="eyeirritation">Eye Irritation</option>
                                        <option value="vision">Blurred Vision</option>
                                        <option value="earpain">Ear Pain</option>
                                        <option value="hearing">Hearing Issue</option>
                                        <option value="toothpain">Tooth Pain</option>
                                        <option value="gumbleed">Gum Bleeding</option>
                                        <option value="mentalstress">Mental Stress</option>
                                        <option value="pregnancy">Pregnancy Check</option>
                                        <option value="periodpain">Period Pain</option>
                                        <option value="kidneypain">Kidney Pain</option>
                                        <option value="urineinfection">Urine Infection</option>
                                        <option value="allergy">Seasonal Allergy</option>
                                        <option value="fatigue">Fatigue</option>
                                        <option value="dizziness">Dizziness</option>
                                        <option value="weightloss">Unexplained Weight Loss</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Suggested Doctor</label>
                                    <input id="doctorSuggestion" type="text" class="form-control" placeholder="Auto suggestion" readonly>
                                    <small id="doctorAdvice" class="text-muted d-block mt-1">Select a problem to get specialist guidance.</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nearby Clinic</label>
                                    <select id="nearbyClinic" class="form-select">
                                        <option value="">Detecting nearby clinics...</option>
                                    </select>
                                    <small id="clinicHint" class="text-muted d-block mt-1">Select a nearby clinic to see available doctors.</small>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Service Provider</label>
                                    <select id="serviceProviderClinic" class="form-select">
                                        <option value="">Select clinic first</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Date</label>
                                    <input id="clinicDate" type="date" class="form-control">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Time Slot</label>
                                    <select id="clinicTime" class="form-select">
                                        <option value="">Select slot</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <div id="waitPredictionPanel" class="wait-prediction-panel">
                                        <div class="d-flex flex-wrap gap-4 align-items-center mb-2">
                                            <div>
                                                <strong>Time you'll wait before seeing the doctor:</strong>
                                                <span id="predictedWaitingTime" class="fs-5 fw-bold text-primary ms-1">--</span>
                                                <span class="text-muted"> min</span>
                                                <div><small class="text-muted">How long you'll sit in the waiting area</small></div>
                                            </div>
                                            <div>
                                                <strong>Doctor will see you at:</strong>
                                                <span id="expectedConsultationTime" class="fs-5 fw-bold text-success ms-1">--</span>
                                                <div><small class="text-muted">Estimated time your turn starts</small></div>
                                            </div>
                                        </div>
                                        <div id="waitPredictionSummary" class="alert alert-info py-2 px-3 mb-2 d-none" role="alert" style="font-size:0.93rem;"></div>
                                        <div class="d-flex align-items-center gap-2 mt-1">
                                            <span id="waitPredictionSpinner" class="spinner-border spinner-border-sm text-primary d-none" role="status" aria-hidden="true"></span>
                                            <small id="waitPredictionMessage" class="text-muted d-block">Fill clinic details to see live waiting-time prediction.</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="restaurantFields" class="dynamic-service col-12">
                            <div class="row g-3 mt-1">
                                <div class="col-md-4">
                                    <label class="form-label">Restaurant</label>
                                    <select id="restaurantProvider" class="form-select">
                                        <option value="">Select restaurant</option>
                                        <option>The Marina - Taj Coromandel</option>
                                        <option>Peshawri - ITC Grand Chola</option>
                                        <option>Dakshin - Park Hyatt Chennai</option>
                                        <option>Flying Elephant - Park Hyatt</option>
                                        <option>The Raintree - Anna Salai</option>
                                        <option>Murugan Idli Shop - T Nagar</option>
                                        <option>Ratna Cafe - Triplicane</option>
                                        <option>Sangeetha Veg Restaurant</option>
                                        <option>Saravana Bhavan</option>
                                        <option>Adyar Ananda Bhavan (A2B)</option>
                                        <option>Annalakshmi Restaurant</option>
                                        <option>Copper Kitchen</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Date</label>
                                    <input id="restaurantDate" type="date" class="form-control">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">People</label>
                                    <input id="restaurantPeople" type="number" class="form-control" min="1" value="2">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Time Slot</label>
                                    <select id="restaurantTime" class="form-select">
                                        <option value="">Select slot</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div id="salonFields" class="dynamic-service col-12">
                            <div class="row g-3 mt-1">
                                <div class="col-md-4">
                                    <label class="form-label">Salon</label>
                                    <select id="salonProvider" class="form-select">
                                        <option value="">Select salon</option>
                                        <option>Lakme Salon</option>
                                        <option>Tony and Guy</option>
                                        <option>Green Trends</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Service</label>
                                    <select id="salonService" class="form-select">
                                        <option value="">Select service</option>
                                        <option>Haircut</option>
                                        <option>Facial</option>
                                        <option>Hair Spa</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Time Slot</label>
                                    <select id="salonTime" class="form-select">
                                        <option value="">Select slot</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Date</label>
                                    <input id="salonDate" type="date" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div id="medicineFields" class="dynamic-service col-12">
                            <div class="row g-3 mt-1">
                                <div class="col-md-8">
                                    <label class="form-label">Medicine Request</label>
                                    <input id="medicineRequest" type="text" class="form-control" placeholder="e.g. Paracetamol 650mg">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Delivery Slot</label>
                                    <select id="medicineTime" class="form-select">
                                        <option value="">Select slot</option>
                                        <option>Morning</option>
                                        <option>Afternoon</option>
                                        <option>Evening</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Delivery Date</label>
                                    <input id="medicineDate" type="date" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Coupon Code</label>
                            <input id="couponCode" type="text" class="form-control" placeholder="e.g. ATR50">
                            <small id="couponFeedback" class="text-muted d-block mt-1">Coupons: ATR50, HEALTH10, WELCOME100</small>
                        </div>
                        <div class="col-12 mt-2">
                            <h4 class="h6 mb-2">Payment Options</h4>
                            <p class="text-muted mb-0">Choose your payment mode before confirming the appointment.</p>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Payment Method</label>
                            <select id="paymentMethod" class="form-select" required>
                                <option value="">Select method</option>
                                <option>UPI</option>
                                <option>Google Pay</option>
                                <option>Card</option>
                                <option>Cash</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Total Amount (INR)</label>
                            <input id="totalAmount" type="number" class="form-control" value="500" min="0" required readonly>
                        </div>
                        <div class="col-12">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="priorityBooking" checked>
                                <label class="form-check-label" for="priorityBooking">Priority Booking (discount INR 500)</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="small text-muted" id="priceBreakdown">Base: INR 500 | Coupon: INR 0 | Priority Discount: INR 500</div>
                        </div>

                        <div class="col-12 d-flex flex-wrap gap-3 pt-2">
                            <button id="confirmBookingBtn" type="submit" class="btn btn-primary px-4 py-2 rounded-pill">Confirm Booking</button>
                            <button id="applyCouponBtn" type="button" class="btn btn-outline-primary px-4 py-2 rounded-pill">Apply Coupon</button>
                        </div>
                    </form>

                    <div id="bookingConfirmation" class="confirmation-wrap d-none">
                        <div class="card shadow-lg rounded-4 border-0 mx-auto confirmation-card">
                            <div class="card-body p-3 p-md-4">
                                <h3 class="text-center mb-3">Your Booking QR Code</h3>
                                <div class="text-center mb-4">
                                    <div id="bookingQr" class="qr-holder mx-auto mb-3"></div>
                                    <p class="mb-0 fw-semibold">ID: <span id="displayBookingId"></span></p>
                                </div>

                                <div class="card border-0 rounded-4 booking-detail-box">
                                    <div class="card-body">
                                        <div id="confirmQueueSummaryAlert" class="alert alert-primary rounded-3 mb-3 d-none" role="alert">
                                            <strong>What this means for you:</strong>
                                            <p id="confirmQueueSummaryText" class="mb-0 mt-1"></p>
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-12"><strong>Name:</strong> <span id="confirmName"></span></div>
                                            <div class="col-12"><strong>Doctor:</strong> <span id="confirmDoctor"></span></div>
                                            <div class="col-12"><strong>Clinic:</strong> <span id="confirmClinic"></span></div>
                                            <div class="col-12"><strong>Medical Problem:</strong> <span id="confirmMedicalProblem"></span></div>
                                            <div class="col-12 col-md-6"><strong>Appointment Date:</strong> <span id="confirmDate"></span></div>
                                            <div class="col-12 col-md-6"><strong>Appointment Time Slot:</strong> <span id="confirmTime"></span></div>
                                            <div class="col-12 col-md-6"><strong>Your Arrival Time:</strong> <span id="confirmArrivalTime"></span></div>
                                            <div class="col-12 col-md-6"><strong>Your Queue Number:</strong> <span id="confirmQueuePosition"></span></div>
                                            <div class="col-12 col-md-6"><strong>Patients Ahead of You:</strong> <span id="confirmPatientsAhead"></span></div>
                                            <div class="col-12 col-md-6">
                                                <strong>Estimated Wait Time:</strong>
                                                <span id="confirmPredictedWait">--</span> min
                                                <div><small class="text-muted">Time you'll wait before the doctor sees you</small></div>
                                            </div>
                                            <div class="col-12 col-md-6">
                                                <strong>Doctor Sees You At:</strong>
                                                <span id="confirmExpectedConsultation">--</span>
                                                <div><small class="text-muted">Estimated time your consultation begins</small></div>
                                            </div>
                                            <div class="col-12 col-md-6"><strong>Total Amount:</strong> INR <span id="confirmAmount"></span></div>
                                            <div class="col-12 col-md-6"><strong>Priority Discount:</strong> INR <span id="confirmPriorityDiscount"></span></div>
                                            <div class="col-12"><strong>Payment Method:</strong> <span id="confirmPaymentMethod"></span></div>
                                            <div class="col-12"><strong>Coupon:</strong> <span id="confirmCoupon"></span></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="text-center mt-4 d-flex flex-wrap justify-content-center gap-2">
                                    <button id="downloadPdfBtn" type="button" class="btn btn-primary rounded-pill px-4">Download PDF</button>
                                    <button id="printConfirmationBtn" type="button" class="btn btn-outline-primary rounded-pill px-4">Print</button>
                                    <button id="bookAnotherBtn" type="button" class="btn btn-outline-primary rounded-pill px-4">Book Another Appointment</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="doctor-admin-card mt-4">
                        <div class="section-head mb-3">
                            <p class="eyebrow">DOCTOR DASHBOARD</p>
                            <h3 class="h4 mb-1">Test delay-based queue updates</h3>
                            <p class="text-muted mb-0">Use this card to simulate doctor delay and push updated wait times to all upcoming appointments.</p>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Clinic</label>
                                <select id="adminClinicSelect" class="form-select">
                                    <option value="">Select clinic</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Doctor</label>
                                <select id="adminDoctorSelect" class="form-select">
                                    <option value="">Select doctor</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Date</label>
                                <input id="adminAppointmentDate" type="date" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Delay (min)</label>
                                <input id="adminDelayMinutes" type="number" class="form-control" min="1" value="10">
                            </div>
                            <div class="col-12 d-flex flex-wrap gap-2">
                                <button id="adminRefreshAppointmentsBtn" type="button" class="btn btn-outline-primary rounded-pill px-4">Refresh Appointments</button>
                                <button id="adminApplyDelayBtn" type="button" class="btn btn-primary rounded-pill px-4">Apply Delay Update</button>
                            </div>
                            <div class="col-12">
                                <small id="adminDelayMessage" class="text-muted d-block">Select a doctor and date to preview upcoming appointments.</small>
                            </div>
                            <div class="col-12">
                                <div class="table-responsive admin-appointments-wrap">
                                    <table class="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Booking ID</th>
                                                <th>Patient</th>
                                                <th>Time</th>
                                                <th>Queue</th>
                                                <th>Predicted Wait</th>
                                                <th>Expected Consultation</th>
                                            </tr>
                                        </thead>
                                        <tbody id="adminAppointmentsTableBody">
                                            <tr>
                                                <td colspan="6" class="text-muted text-center py-3">No appointments loaded yet.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="registerModalLabel">Register</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="registerFormMessage" class="small mb-2" role="alert" aria-live="polite"></div>
                <form id="registerFormModal" class="row g-3">
                    <div class="col-12">
                        <label for="registerFullName" class="form-label">Full Name</label>
                        <input id="registerFullName" type="text" class="form-control" placeholder="Your full name" required>
                    </div>
                    <div class="col-12">
                        <label for="registerEmail" class="form-label">Email Address</label>
                        <input id="registerEmail" type="email" class="form-control" placeholder="Your email" required>
                    </div>
                    <div class="col-12">
                        <label for="registerPhone" class="form-label">Phone Number</label>
                        <div class="input-group">
                            <span class="input-group-text">+91</span>
                            <input id="registerPhone" type="tel" class="form-control" placeholder="10-digit number" required>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="registerPassword" class="form-label">Password</label>
                        <div class="input-group">
                            <input id="registerPassword" type="password" class="form-control" placeholder="Create password" required>
                            <button id="toggleRegisterPassword" class="btn btn-outline-secondary" type="button">Show</button>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="registerConfirmPassword" class="form-label">Confirm Password</label>
                        <div class="input-group">
                            <input id="registerConfirmPassword" type="password" class="form-control" placeholder="Confirm password" required>
                            <button id="toggleRegisterConfirmPassword" class="btn btn-outline-secondary" type="button">Show</button>
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </div>
                </form>
                <p class="mb-0 mt-3 text-center">Already have an account? <a href="#" id="openLoginFromRegister">Login here</a></p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Login</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="loginFormMessage" class="small mb-2" role="alert" aria-live="polite"></div>
                <form id="loginFormModal" class="row g-3">
                    <div class="col-12">
                        <label for="loginEmail" class="form-label">Email Address</label>
                        <input id="loginEmail" type="email" class="form-control" placeholder="Your email" required>
                    </div>
                    <div class="col-12">
                        <label for="loginPassword" class="form-label">Password</label>
                        <div class="input-group">
                            <input id="loginPassword" type="password" class="form-control" placeholder="Your password" required>
                            <button id="toggleLoginPassword" class="btn btn-outline-secondary" type="button">Show</button>
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
                <p class="mb-0 mt-3 text-center">Don't have an account? <a href="#" id="openRegisterFromLogin">Register here</a></p>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="qrPaymentModal" tabindex="-1" aria-labelledby="qrPaymentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title" id="qrPaymentModalLabel">Scan to Pay via UPI</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
                <p class="text-muted small mb-3">Use any UPI app to scan this QR code</p>
                <div id="qrCodeDisplay" class="bg-light rounded p-3 mb-3" style="display: flex; align-items: center; justify-content: center; min-height: 250px;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Generating QR...</span>
                    </div>
                </div>
                <div class="card border-light bg-light p-3 mb-3">
                    <small class="text-muted d-block mb-1">UPI ID</small>
                    <strong class="text-dark">faazil3468@oksbi</strong>
                </div>
                <p class="text-muted small">After successful payment, click the button below to confirm.</p>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="confirmQrPaymentBtn" class="btn btn-primary">I Have Completed Payment</button>
            </div>
        </div>
    </div>
</div>

<footer id="footer" class="footer-shell reveal">
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <h5 class="mb-3">QUEZY</h5>
                <p class="mb-0">A modern booking platform for healthcare and daily services with AI-powered assistance.</p>
            </div>
            <div class="col-6 col-lg-2">
                <h6>Quick Links</h6>
                <ul class="list-unstyled footer-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#booking">Booking</a></li>
                </ul>
            </div>
            <div class="col-6 col-lg-3">
                <h6>Contact</h6>
                <ul class="list-unstyled footer-links">
                    <li><i class="fa-solid fa-phone me-2"></i>+91 98765 43210</li>
                    <li><i class="fa-solid fa-envelope me-2"></i>care@quezyhealth.com</li>
                    <li><i class="fa-solid fa-location-dot me-2"></i>Chennai, India</li>
                </ul>
            </div>
            <div class="col-lg-3">
                <h6>Social</h6>
                <div class="d-flex gap-2 mt-2">
                    <a class="social-btn" href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a class="social-btn" href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a class="social-btn" href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
        <hr class="my-4">
        <p class="mb-0 small">Copyright 2026 QUEZY. All rights reserved.</p>
    </div>
</footer>

<div class="assistant-widget">
    <span class="assistant-tooltip">Medical Assistant</span>
    <button id="assistantToggle" class="assistant-toggle" aria-label="Open Medical Assistant">
        <i class="fa-solid fa-comments"></i>
    </button>

    <section id="assistantPanel" class="assistant-panel" aria-live="polite" aria-label="AI Medical Assistant">
        <header class="assistant-header">
            <div>
                <h5 class="mb-1">AI Medical Assistant</h5>
                <p class="mb-0">Ask about your symptoms</p>
            </div>
            <button id="assistantClose" class="assistant-close" aria-label="Close assistant">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </header>
        <div id="assistantMessages" class="assistant-messages">
            <div class="chat-message bot-message">Hello. Describe your symptoms and I will suggest the right specialist for booking.</div>
        </div>
        <form id="assistantForm" class="assistant-input-wrap">
            <input id="assistantInput" type="text" class="form-control" placeholder="Type your symptoms..." autocomplete="off">
            <button type="submit" class="btn btn-primary">Send</button>
        </form>
    </section>
</div>
`;

function Home() {
    const navigate = useNavigate();
  const html = useMemo(
    () =>
      HOME_BODY_HTML.replace(/href="admin\.html"/g, 'href="/admin"')
        .replace(/href="dashboard\.html"/g, 'href="/dashboard"')
        .replace(/href="index\.html"/g, 'href="/"'),
    []
  );

  useEffect(() => {
    document.title = "QUEZY - Smart Healthcare Booking";
    initializeHomePage();

        const handleInternalNavigation = (event) => {
            const anchor = event.target instanceof Element ? event.target.closest("a") : null;
            if (!anchor) {
                return;
            }

            const href = anchor.getAttribute("href");
            if (href === "/" || href === "/admin" || href === "/dashboard") {
                event.preventDefault();
                navigate(href);
            }
        };

        document.addEventListener("click", handleInternalNavigation);
        return () => {
            document.removeEventListener("click", handleInternalNavigation);
        };
    }, [navigate]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default Home;
