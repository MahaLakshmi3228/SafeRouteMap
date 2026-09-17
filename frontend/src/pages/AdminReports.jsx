import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminReports.css";

function AdminReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

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
        "https://saferoutemap-backend-2aql.onrender.com/api/reports/all",
        {
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
    } catch (error) {
      console.error("Reports page error:", error);

      setError(
        error.message || "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const response = await fetch(
        `https://saferoutemap-backend-2aql.onrender.com/api/reports/${reportId}/status`,
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
        throw new Error(
          data.message || "Unable to update report"
        );
      }

      setReports((previousReports) =>
        previousReports.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status: status,
              }
            : report
        )
      );
    } catch (error) {
      console.error(
        "Update report status error:",
        error
      );

      alert(
        error.message ||
          "Unable to update report status."
      );
    }
  };

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
    if (severity === "High") {
      return "reports-severity-high";
    }

    if (severity === "Medium") {
      return "reports-severity-medium";
    }

    return "reports-severity-low";
  };

  const getStatusClass = (status) => {
    if (status === "Verified") {
      return "reports-status-verified";
    }

    if (status === "Rejected") {
      return "reports-status-rejected";
    }

    return "reports-status-pending";
  };

  const openLocation = (report) => {
    const latitude = report.location?.latitude;
    const longitude = report.location?.longitude;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      alert("Location coordinates are not available.");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    window.open(url, "_blank");
  };

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      report.title?.toLowerCase().includes(search) ||
      report.category?.toLowerCase().includes(search) ||
      report.description
        ?.toLowerCase()
        .includes(search) ||
      report.location?.address
        ?.toLowerCase()
        .includes(search) ||
      report.reportId?.toLowerCase().includes(search) ||
      report.userId?.name
        ?.toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      report.status === statusFilter;

    const matchesSeverity =
      severityFilter === "All" ||
      report.severity === severityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSeverity
    );
  });

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const verifiedCount = reports.filter(
    (report) => report.status === "Verified"
  ).length;

  const rejectedCount = reports.filter(
    (report) => report.status === "Rejected"
  ).length;

  return (
    <div className="admin-reports-page">

      {/* Main content */}
      <main className="admin-reports-main">

        {/* Header */}
        <header className="reports-header">

          <div>
            <p className="reports-small-title">
              SAFEROUTE ADMINISTRATION
            </p>

            <h1>Reports</h1>

            <p className="reports-header-text">
              Review, verify and manage all reported
              safety hazards.
            </p>
          </div>

          <div className="reports-admin-profile">

            <div className="reports-admin-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Admin"}
              </strong>

              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* Statistics */}
        <section className="reports-mini-stats">

          <div className="reports-mini-card">
            <span className="mini-icon total">
              📋
            </span>

            <div>
              <span>Total Reports</span>
              <strong>{reports.length}</strong>
            </div>
          </div>

          <div className="reports-mini-card">
            <span className="mini-icon pending">
              ⏳
            </span>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="reports-mini-card">
            <span className="mini-icon verified">
              ✅
            </span>

            <div>
              <span>Verified</span>
              <strong>{verifiedCount}</strong>
            </div>
          </div>

          <div className="reports-mini-card">
            <span className="mini-icon rejected">
              ❌
            </span>

            <div>
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>
          </div>

        </section>

        {/* Filters */}
        <section className="reports-filter-section">

          <div className="reports-search-box">

            <span>🔎</span>

            <input
              type="text"
              placeholder="Search reports by title, location, category..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Verified">
              Verified
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >
            <option value="All">
              All Severity
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>
          </select>

          <button
            className="reports-refresh-button"
            onClick={fetchReports}
          >
            ↻ Refresh
          </button>

        </section>

        {/* Error */}
        {error && (
          <div className="reports-error">
            ⚠️ {error}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <div className="reports-results-count">
            Showing{" "}
            <strong>
              {filteredReports.length}
            </strong>{" "}
            of{" "}
            <strong>{reports.length}</strong>{" "}
            reports
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="reports-loading">

            <div className="reports-spinner"></div>

            <p>Loading reports...</p>

          </div>
        ) : filteredReports.length === 0 ? (

          <div className="reports-empty">

            <div className="reports-empty-icon">
              📭
            </div>

            <h3>No Reports Found</h3>

            <p>
              No reports match your current search
              or filter.
            </p>

          </div>

        ) : (

          <section className="reports-list">

            {filteredReports.map((report) => (

              <div
                className="reports-card"
                key={report._id}
              >

                {/* Icon */}
                <div className="reports-card-icon">
                  {getCategoryIcon(
                    report.category
                  )}
                </div>

                {/* Content */}
                <div className="reports-card-content">

                  <div className="reports-title-row">

                    <div>

                      <h2>
                        {report.title}
                      </h2>

                      <p className="reports-category">
                        {report.category}
                      </p>

                    </div>

                    <span
                      className={`reports-status ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>

                  </div>

                  {/* Details */}
                  <div className="reports-details">

                    <span>
                      📍{" "}
                      {report.location?.address ||
                        "Location captured"}
                    </span>

                    <span>
                      ⚠️ Severity:{" "}
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
                      {report.createdAt
                        ? new Date(
                            report.createdAt
                          ).toLocaleDateString()
                        : "Unknown"}
                    </span>

                  </div>

                  {/* Description */}
                  <div className="reports-description">

                    <strong>
                      Description
                    </strong>

                    <p>
                      {report.description}
                    </p>

                  </div>

                  {/* Reporter */}
                  <div className="reports-reporter">

                    <div>
                      <span>
                        Report ID
                      </span>

                      <strong>
                        {report.reportId}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Reported By
                      </span>

                      <strong>
                        {report.userId?.name ||
                          "Unknown User"}
                      </strong>
                    </div>

                    {report.userId?.email && (
                      <div>
                        <span>
                          Email
                        </span>

                        <strong>
                          {report.userId.email}
                        </strong>
                      </div>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="reports-actions">

                    <button
                      className="view-location-button"
                      onClick={() =>
                        openLocation(report)
                      }
                    >
                      📍 View Location
                    </button>

                    {report.status ===
                      "Pending" && (
                      <>
                        <button
                          className="verify-button"
                          onClick={() =>
                            updateReportStatus(
                              report._id,
                              "Verified"
                            )
                          }
                        >
                          ✓ Verify
                        </button>

                        <button
                          className="reject-button"
                          onClick={() =>
                            updateReportStatus(
                              report._id,
                              "Rejected"
                            )
                          }
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}

                    {report.status ===
                      "Verified" && (
                      <span className="completed-action verified-action">
                        ✓ Report Verified
                      </span>
                    )}

                    {report.status ===
                      "Rejected" && (
                      <span className="completed-action rejected-action">
                        ✕ Report Rejected
                      </span>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </section>

        )}

      </main>
    </div>
  );
}

export default AdminReports;