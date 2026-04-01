import { useEffect } from "react";
import { Link } from "react-router-dom";
import initializeDashboardPage from "../logic/dashboardLogic";

function Dashboard() {
  useEffect(() => {
    document.title = "QUEZY Dashboard";
    initializeDashboardPage();
  }, []);

  return (
    <>

    <main className="container py-5">
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
                <h1 className="h3 mb-3">QUEZY Booking </h1>
                <p className="mb-3">Login successful. You can book a slot now.</p>
                <div className="d-flex flex-wrap gap-2">
                    <Link to="/" className="btn btn-primary rounded-pill px-4">Open Booking Page</Link>
                    <Link to="/admin" className="btn btn-outline-primary rounded-pill px-4">Open Admin Delay Control</Link>
                </div>
            </div>
        </div>
    </main>

    </>
  );
}

export default Dashboard;
