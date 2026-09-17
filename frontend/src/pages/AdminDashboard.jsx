import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState("");

 const token = localStorage.getItem("safeRouteToken");
 const userData = localStorage.getItem("safeRouteUser");

 const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
  if (!token || !user || user.role !== "admin") {
    navigate("/login");
    return;
  }

  fetchReports();
}, [token, navigate]);
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reports/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error("Admin reports error:", error);
      setError(error.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

const updateReportStatus = async (reportId, status) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/reports/${reportId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update report status");
    }

    // Update the report immediately on the dashboard
    setReports((previousReports) =>
      previousReports.map((report) =>
        report._id === reportId
          ? { ...report, status: status }
          : report
      )
    );
  } catch (error) {
    console.error("Update report status error:", error);
    alert(error.message || "Unable to update report status.");
  }
};
const deleteReport = async (reportId) => {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this report?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/reports/${reportId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete report");
    }

    // Remove the deleted report from the dashboard immediately
    setReports((previousReports) =>
      previousReports.filter(
        (report) => report._id !== reportId
      )
    );

    alert("Report deleted successfully.");
  } catch (error) {
    console.error("Delete report error:", error);
    alert(error.message || "Unable to delete report.");
  }
};

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const verifiedReports = reports.filter(
    (report) => report.status === "Verified"
  ).length;

  const rejectedReports = reports.filter(
    (report) => report.status === "Rejected"
  ).length;

  const getCategoryIcon = (category) => {
    const icons = {
      "Poor Street Lighting": "💡",
      "Damaged Road": "🚧",
      Pothole: "🕳️",
      Waterlogging: "🌊",
      "Accident-Prone Area": "🚨",
      "Fallen Tree": "🌳",
      "Unsafe Area": "⚠️",
      "Other Safety Hazard": "🔴",
    };

    return icons[category] || "⚠️";
  };

  const getSeverityClass = (severity) => {
    if (severity === "High") return "severity-high";
    if (severity === "Medium") return "severity-medium";
    return "severity-low";
  };

  const getStatusClass = (status) => {
    if (status === "Verified") return "status-verified";
    if (status === "Rejected") return "status-rejected";
    return "status-pending";
  };

  const handleLogout = () => {
    localStorage.removeItem("safeRouteToken");
    localStorage.removeItem("safeRouteUser");
    localStorage.removeItem("safeRouteLoggedIn");

    navigate("/login");
  };

  return (
    <div className="admin-page">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <div className="admin-logo-icon">🛡️</div>

          <div>
            <h2>SafeRoute</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">

          <Link to="/admin" className="admin-nav-item active">
            <span>📊</span>
            Dashboard
          </Link>

          <Link to="/admin/reports" className="admin-nav-item">
            <span>🚨</span>
            Reports
          </Link>

          <Link to="/unsafe-location" className="admin-nav-item">
            <span>📍</span>
            Unsafe Locations
          </Link>

        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <span>↪️</span>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">

          <div>
            <p className="admin-small-title">
              SAFEROUTE ADMINISTRATION
            </p>

            <h1>Dashboard</h1>

            <p className="admin-header-text">
              Monitor and manage reported safety hazards.
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>{user?.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* Error */}
        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {/* Statistics */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon total">
              📋
            </div>

            <div>
              <span>Total Reports</span>
              <strong>{totalReports}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon pending">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingReports}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon verified">
              ✅
            </div>

            <div>
              <span>Verified</span>
              <strong>{verifiedReports}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon rejected">
              ❌
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejectedReports}</strong>
            </div>
          </div>

        </section>

        {/* Reports */}
        <section className="admin-reports-section">

          <div className="admin-section-header">

            <div>
              <p>HAZARD MANAGEMENT</p>
              <h2>Recent Reports</h2>
            </div>

            <button
              className="refresh-button"
              onClick={fetchReports}
            >
              ↻ Refresh
            </button>

          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="loading-spinner"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="admin-empty">
              <div>📭</div>
              <h3>No Reports Yet</h3>
              <p>
                Hazard reports submitted by users will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-reports-list">

              {reports.map((report) => (
                <div
                  className="admin-report-card"
                  key={report._id}
                >

                  <div className="admin-report-icon">
                    {getCategoryIcon(report.category)}
                  </div>

                  <div className="admin-report-content">

                    <div className="admin-report-title-row">

                      <div>
                        <h3>{report.title}</h3>

                        <p className="admin-report-category">
                          {report.category}
                        </p>
                      </div>

                      <span
                        className={`admin-status ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>

                    </div>

                    <div className="admin-report-details">

                      <span>
                        📍 {report.location?.address || "Location captured"}
                      </span>

                      <span>
                        ⚠️
                        <strong
                          className={getSeverityClass(
                            report.severity
                          )}
                        >
                          {report.severity}
                        </strong>
                      </span>

                      <span>
                        📅{" "}
                        {new Date(
                          report.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <p className="admin-report-description">
                      {report.description}
                    </p>

       {report.photo?.url && (
  <div className="admin-report-photo">
    <span className="admin-photo-label">
      📷 Uploaded Photo
    </span>

    <img
      src={`http://localhost:5000${report.photo.url}`}
      alt="Reported hazard"
      className="admin-photo-image"
      onClick={() =>
        setSelectedPhoto(
          `http://localhost:5000${report.photo.url}`
        )
      }
    />
  </div>
)}

                   <div className="admin-report-footer">

  <div className="admin-report-info">
    <span>
      Report ID:{" "}
      <strong>{report.reportId}</strong>
    </span>

    {report.userId && (
      <span>
        👤 {report.userId.name}
      </span>
    )}
  </div>

  <div className="admin-report-actions">

    {report.status === "Pending" && (
      <>
        <button
          className="verify-report-button"
          onClick={() =>
            updateReportStatus(report._id, "Verified")
          }
        >
          ✓ Verify
        </button>

        <button
          className="reject-report-button"
          onClick={() =>
            updateReportStatus(report._id, "Rejected")
          }
        >
          ✕ Reject
        </button>
      </>
    )}

    {report.status === "Verified" && (
      <span className="action-completed verified-completed">
        ✓ Report Verified
      </span>
    )}

    {report.status === "Rejected" && (
      <span className="action-completed rejected-completed">
        ✕ Report Rejected
      </span>
    )}
    <button
  className="reject-report-button"
  onClick={() => deleteReport(report._id)}
  style={{
    marginLeft: "8px",
  }}
>
  🗑️ Delete Report
</button>

  </div>

</div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>
        {selectedPhoto && (
  <div
    className="photo-modal"
    onClick={() => setSelectedPhoto(null)}
  >
    <div
      className="photo-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="photo-modal-close"
        onClick={() => setSelectedPhoto(null)}
      >
        ✕
      </button>

      <img
        src={selectedPhoto}
        alt="Uploaded hazard"
        className="photo-modal-image"
      />
    </div>
  </div>
)}

      </main>

    </div>
  );
}

export default AdminDashboard;