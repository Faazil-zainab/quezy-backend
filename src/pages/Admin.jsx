import { useEffect } from "react";
import { Link } from "react-router-dom";
import initializeAdminPage from "../logic/adminLogic";

function Admin() {
  useEffect(() => {
    document.title = "QUEZY Admin Delay Control";
    initializeAdminPage();
  }, []);

  return (
    <>

    <main className="section-space">
        <div className="container">
            <div className="booking-shell">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <p className="eyebrow mb-1">ADMIN PANEL</p>
                        <h1 className="h3 mb-1">Doctor Delay Control</h1>
                        <p className="text-muted mb-0">Update all upcoming appointments for a selected doctor and monitor queue impact.</p>
                    </div>
                    <Link to="/" className="btn btn-outline-primary rounded-pill px-4">Back to Booking</Link>
                </div>

                <div className="doctor-admin-card">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Clinic</label>
                            <select id="adminPageClinicSelect" className="form-select">
                                <option value="">Select clinic</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Doctor</label>
                            <select id="adminPageDoctorSelect" className="form-select">
                                <option value="">Select doctor</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Date</label>
                            <input id="adminPageAppointmentDate" type="date" className="form-control" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Delay (min)</label>
                            <input id="adminPageDelayMinutes" type="number" className="form-control" min="1" defaultValue="10" />
                        </div>
                        <div className="col-12 d-flex flex-wrap gap-2">
                            <button id="adminPageLoadBtn" type="button" className="btn btn-outline-primary rounded-pill px-4">Load Upcoming Appointments</button>
                            <button id="adminPageApplyBtn" type="button" className="btn btn-primary rounded-pill px-4">Apply Delay</button>
                        </div>
                        <div className="col-12">
                            <small id="adminPageMessage" className="text-muted d-block">Choose a clinic, doctor, and date to manage delays.</small>
                        </div>
                        <div className="col-12">
                            <div className="table-responsive admin-appointments-wrap">
                                <table className="table align-middle mb-0">
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
                                    <tbody id="adminPageAppointmentsTableBody">
                                        <tr>
                                            <td colSpan="6" className="text-muted text-center py-3">No appointments loaded yet.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    

    </>
  );
}

export default Admin;
