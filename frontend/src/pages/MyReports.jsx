import { useEffect, useState } from "react";
const BACKEND_URL = "https://saferoutemap-backend-2aql.onrender.com";
import { Link, useNavigate } from "react-router-dom";
import "./MyReports.css";

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // =========================
  // FETCH USER REPORTS
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("safeRouteToken");
    const loggedIn = localStorage.getItem("safeRouteLoggedIn");

    if (!token || loggedIn !== "true") {
      navigate("/login");
      return;
    }

    fetchReports(token);
  }, [navigate]);

  const fetchReports = async (token) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://saferoutemap-backend-2aql.onrender.com/api/reports/my-reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch reports"
        );
      }

      setReports(data.reports || []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(
        err.message || "Unable to load your reports."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // USER INFORMATION
  // =========================

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("safeRouteUser") || "{}"
      );
    } catch {
      return {};
    }
  };

  const user = getUser();

  const userName = user.name || "SafeRoute User";

  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  // =========================
  // CATEGORY ICONS
  // =========================

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

  // =========================
  // STATUS
  // =========================

  const getStatusClass = (status) => {
    if (status === "Verified") {
      return "status-verified";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  const getStatusIcon = (status) => {
    if (status === "Verified") return "✓";
    if (status === "Rejected") return "×";

    return "⏳";
  };

  // =========================
  // SEVERITY
  // =========================

  const getSeverityClass = (severity) => {
    if (severity === "High") {
      return "severity-high";
    }

    if (severity === "Medium") {
      return "severity-medium";
    }

    return "severity-low";
  };

  const getSeverityIcon = (severity) => {
    if (severity === "High") return "🔴";
    if (severity === "Medium") return "🟠";

    return "🟢";
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="my-reports-page">
        <div className="reports-loading">

          <div className="loading-spinner"></div>

          <h2>Loading your reports</h2>

          <p>
            Fetching your latest SafeRoute reports...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="my-reports-page">
        <div className="reports-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load reports
          </h2>

          <p>
            {error}
          </p>

          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // STATISTICS
  // =========================

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

  return (
    <div className="my-reports-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="my-reports-header">

        <div className="header-content">

          <span className="page-badge">
            SAFER COMMUNITY
          </span>

          <h1>
            My Reports
          </h1>

          <p>
            Track the hazards you've reported
            and help make roads safer for everyone.
          </p>

        </div>

        <Link
          to="/report-hazard"
          className="new-report-button"
        >
          <span>+</span>
          Report Hazard
        </Link>

      </div>

      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <div className="my-reports-container">

        {/* =========================
            WELCOME CARD
        ========================= */}

        <div className="welcome-card">

          <div className="welcome-left">

            <div className="welcome-avatar">
              {getInitial()}
            </div>

            <div className="welcome-text">

              <span className="welcome-small">
                Welcome back
              </span>

              <h2>
                {userName}
              </h2>

              <p>
                Thank you for helping keep
                your community safer.
              </p>

            </div>

          </div>

          <div className="welcome-shield">
            🛡️
          </div>

        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="report-stats">

          <div className="stat-card">

            <div className="stat-icon total-icon">
              📋
            </div>

            <div className="stat-content">
              <span>Total Reports</span>
              <strong>{totalReports}</strong>
              <small>Your submissions</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pending-icon">
              ⏳
            </div>

            <div className="stat-content">
              <span>Pending</span>
              <strong>{pendingReports}</strong>
              <small>Under review</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon verified-icon">
              ✓
            </div>

            <div className="stat-content">
              <span>Verified</span>
              <strong>{verifiedReports}</strong>
              <small>Confirmed hazards</small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon rejected-icon">
              ×
            </div>

            <div className="stat-content">
              <span>Rejected</span>
              <strong>{rejectedReports}</strong>
              <small>Not confirmed</small>
            </div>

          </div>

        </div>

        {/* =========================
            REPORTS SECTION
        ========================= */}

        <div className="reports-section">

          <div className="section-heading">

            <div>

              <div className="section-title-row">

                <div className="section-icon">
                  📋
                </div>

                <div>
                  <h2>
                    Your Submitted Reports
                  </h2>

                  <p>
                    Track the current status of every report.
                  </p>
                </div>

              </div>

            </div>

            {reports.length > 0 && (
              <span className="report-count">
                {reports.length}{" "}
                {reports.length === 1
                  ? "Report"
                  : "Reports"}
              </span>
            )}

          </div>

          {/* =========================
              EMPTY STATE
          ========================= */}

          {reports.length === 0 ? (

            <div className="empty-reports">

              <div className="empty-illustration">
                <div className="empty-circle">
                  📋
                </div>
              </div>

              <h3>
                No Reports Yet
              </h3>

              <p>
                You haven't reported any hazards yet.
                If you notice an unsafe road condition,
                report it and help keep your community safe.
              </p>

              <Link
                to="/report-hazard"
                className="empty-report-button"
              >
                <span>+</span>
                Report Your First Hazard
              </Link>

            </div>

          ) : (

            <div className="reports-list">

              {reports.map((report) => (

                <div
                  className="report-card"
                  key={report._id}
                >

                  {/* =========================
                      REPORT HEADER
                  ========================= */}

                  <div className="report-card-top">

                    <div className="report-title-area">

                      <div className="report-category-icon">
                        {getCategoryIcon(
                          report.category
                        )}
                      </div>

                      <div className="report-heading-text">

                        <h3>
                          {report.title}
                        </h3>

                        <span className="report-category">
                          {report.category}
                        </span>

                      </div>

                    </div>

                    <div
                      className={`report-status ${getStatusClass(
                        report.status
                      )}`}
                    >
                      <span>
                        {getStatusIcon(report.status)}
                      </span>

                      {report.status}
                    </div>

                  </div>

                  {/* =========================
                      DETAILS
                  ========================= */}

                  <div className="report-details">

                    {/* LOCATION */}

                    <div className="detail-item">

                      <span className="detail-icon">
                        📍
                      </span>

                      <div>

                        <span className="detail-label">
                          Location
                        </span>

                        <strong>
                          {report.location?.address ||
                            "Reported location"}
                        </strong>

                        {report.location?.latitude !==
                          undefined &&
                          report.location?.longitude !==
                            undefined && (
                            <small>
                              {Number(
                                report.location.latitude
                              ).toFixed(5)}
                              {" , "}
                              {Number(
                                report.location.longitude
                              ).toFixed(5)}
                            </small>
                          )}

                      </div>

                    </div>

                    {/* SEVERITY */}

                    <div className="detail-item">

                      <span className="detail-icon">
                        {getSeverityIcon(
                          report.severity
                        )}
                      </span>

                      <div>

                        <span className="detail-label">
                          Severity
                        </span>

                        <strong
                          className={getSeverityClass(
                            report.severity
                          )}
                        >
                          {report.severity}
                        </strong>

                      </div>

                    </div>

                    {/* DATE */}

                    <div className="detail-item">

                      <span className="detail-icon">
                        📅
                      </span>

                      <div>

                        <span className="detail-label">
                          Reported On
                        </span>

                        <strong>
                          {formatDate(
                            report.createdAt
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      DESCRIPTION
                  ========================= */}

                  <div className="report-description">

                    <span>
                      📝 Description
                    </span>

                    <p>
                      {report.description}
                    </p>

                  </div>

                  {/* =========================
                      PHOTO
                  ========================= */}
{report.photo?.url && (
  <div className="report-photo">
    <span>📷 Uploaded Photo</span>

    <img
      src={`https://saferoutemap-backend-2aql.onrender.com${report.photo.url}`}
      alt="Reported hazard"
      onClick={() =>
        setSelectedPhoto(
          `https://saferoutemap-backend-2aql.onrender.com${report.photo.url}`
        )
      }
    />
  </div>
)}

                  {/* =========================
                      FOOTER
                  ========================= */}

                  <div className="report-footer">

                    <div className="report-info-tags">

                      {report.riskTime && (
                        <span className="info-tag">
                          🕐 {report.riskTime}
                        </span>
                      )}

                      {report.anonymous && (
                        <span className="info-tag">
                          👤 Anonymous
                        </span>
                      )}

                      <span className="info-tag">
                        🛡️ SafeRoute
                      </span>

                    </div>

                    <div className="report-id">
                      <span>Report ID</span>
                      <strong>
                        {report.reportId}
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
        {/* LARGE PHOTO POPUP */} 
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

    </div>
  );
  
}

export default MyReports;