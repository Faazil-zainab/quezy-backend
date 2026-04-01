export default function initializeAdminPage() {
const API_BASE_URL = "http://127.0.0.1:5000";

const clinicSelect = document.getElementById("adminPageClinicSelect");
const doctorSelect = document.getElementById("adminPageDoctorSelect");
const appointmentDateInput = document.getElementById("adminPageAppointmentDate");
const delayMinutesInput = document.getElementById("adminPageDelayMinutes");
const loadBtn = document.getElementById("adminPageLoadBtn");
const applyBtn = document.getElementById("adminPageApplyBtn");
const message = document.getElementById("adminPageMessage");
const tableBody = document.getElementById("adminPageAppointmentsTableBody");

let doctorProfiles = [];

function setMessage(text, tone = "muted") {
    if (!message) {
        return;
    }

    message.textContent = text;
    message.classList.remove("text-muted", "text-danger", "text-success", "text-warning");
    message.classList.add(
        tone === "error" ? "text-danger" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-muted"
    );
}

function renderAppointments(appointments) {
    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-muted text-center py-3">No appointments found for this doctor and date.</td></tr>';
        return;
    }

    tableBody.innerHTML = appointments.map((appointment) => `
        <tr>
            <td>${appointment.bookingId}</td>
            <td>${appointment.name}</td>
            <td>${appointment.timeSlot}</td>
            <td>${appointment.queuePosition}</td>
            <td>${appointment.predictedWait} min</td>
            <td>${appointment.expectedConsultation}</td>
        </tr>
    `).join("");
}

function populateClinicOptions() {
    if (!clinicSelect) {
        return;
    }

    const clinics = [...new Set(doctorProfiles.map((doctor) => doctor.clinic_name))].sort();
    clinicSelect.innerHTML = '<option value="">Select clinic</option>';

    clinics.forEach((clinicName) => {
        const option = document.createElement("option");
        option.value = clinicName;
        option.textContent = clinicName;
        clinicSelect.appendChild(option);
    });
}

function populateDoctorOptions(clinicName) {
    if (!doctorSelect) {
        return;
    }

    const doctors = doctorProfiles.filter((doctor) => doctor.clinic_name === clinicName);
    doctorSelect.innerHTML = '<option value="">Select doctor</option>';

    doctors.forEach((doctor) => {
        const option = document.createElement("option");
        option.value = doctor.doctor_name;
        option.textContent = `${doctor.doctor_name} - ${doctor.specialization}`;
        doctorSelect.appendChild(option);
    });
}

async function fetchDoctorProfiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/doctor-profiles`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            setMessage("Unable to load doctor profiles.", "error");
            return;
        }

        doctorProfiles = data.doctors || [];
        populateClinicOptions();
        setMessage("Doctor profiles loaded.", "success");
    } catch (error) {
        setMessage("Unable to connect to backend.", "error");
    }
}

async function loadAppointments() {
    if (!clinicSelect || !doctorSelect || !appointmentDateInput) {
        return;
    }

    const clinicName = clinicSelect.value;
    const doctorName = doctorSelect.value;
    const appointmentDate = appointmentDateInput.value;

    if (!clinicName || !doctorName || !appointmentDate) {
        renderAppointments([]);
        setMessage("Choose a clinic, doctor, and date to load appointments.", "muted");
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
            setMessage((data && data.message) || "Unable to load appointments.", "error");
            renderAppointments([]);
            return;
        }

        renderAppointments(data.appointments || []);
        setMessage(`Loaded ${data.appointments.length} appointment(s).`, "success");
    } catch (error) {
        setMessage("Unable to connect to backend for appointments.", "error");
    }
}

async function applyDelay() {
    if (!clinicSelect || !doctorSelect || !appointmentDateInput || !delayMinutesInput) {
        return;
    }

    const clinicName = clinicSelect.value;
    const doctorName = doctorSelect.value;
    const appointmentDate = appointmentDateInput.value;
    const delayMinutes = Math.max(Number(delayMinutesInput.value || 0), 0);

    if (!clinicName || !doctorName || !appointmentDate || delayMinutes < 1) {
        setMessage("Choose a clinic, doctor, date, and a delay of at least 1 minute.", "error");
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
            setMessage((data && data.message) || "Unable to apply delay.", "error");
            return;
        }

        setMessage(`Applied a ${delayMinutes}-minute delay for ${doctorName}.`, "warning");
        await loadAppointments();
    } catch (error) {
        setMessage("Unable to connect to backend for delay updates.", "error");
    }
}

if (clinicSelect) {
    clinicSelect.addEventListener("change", () => {
        populateDoctorOptions(clinicSelect.value);
        renderAppointments([]);
        setMessage("Choose a doctor and date to load appointments.", "muted");
    });
}

if (doctorSelect) {
    doctorSelect.addEventListener("change", loadAppointments);
}

if (appointmentDateInput) {
    appointmentDateInput.value = new Date().toISOString().split("T")[0];
    appointmentDateInput.addEventListener("change", loadAppointments);
}

if (loadBtn) {
    loadBtn.addEventListener("click", loadAppointments);
}

if (applyBtn) {
    applyBtn.addEventListener("click", applyDelay);
}

fetchDoctorProfiles();

}
