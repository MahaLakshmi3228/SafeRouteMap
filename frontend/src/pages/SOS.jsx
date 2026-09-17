
import React, { useEffect, useRef, useState } from "react";

function SOS() {
  const [countdown, setCountdown] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [sosId, setSosId] = useState(null);
  const [displaySosId, setDisplaySosId] = useState(null);

  const countdownRef = useRef(null);

  // --------------------------------------------------
  // GET CURRENT LOCATION
  // --------------------------------------------------
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Geolocation is not supported by your browser."
      );

      reject(new Error("Geolocation not supported"));
      return;
    }

    setLocationStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        const currentLocation = {
          lat,
          lng,
          accuracy,
        };

        console.log("📍 Current Location:", currentLocation);

        setLocation(currentLocation);

        setLocationStatus(
          "Location detected successfully."
        );

        resolve(currentLocation);
      },

      (error) => {
        console.error("Location error:", error);

        let message =
          "Unable to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission was denied. Please allow location access.";
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            message =
              "Location request timed out. Please try again.";
            break;

          default:
            message =
              "Unable to get your location.";
        }

        setLocationStatus(message);

        reject(error);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

const createSOS = async (currentLocation) => {
  try {
    const token = localStorage.getItem("safeRouteToken");

    if (!token) {
      throw new Error(
        "You must be logged in to activate SOS."
      );
    }

    const response = await fetch(
      "https://saferoutemap-backend-2aql.onrender.com/api/sos",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          accuracy: currentLocation.accuracy,
          message:
            "Emergency assistance may be required.",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create SOS"
      );
    }

    console.log("🚨 SOS created:", data);

  setSosId(data.sos.id);
setDisplaySosId(data.sos.sosId);

    return data.sos;
  } catch (error) {
    console.error("Create SOS error:", error);

    setLocationStatus(
      error.message ||
        "Unable to activate emergency SOS."
    );

    return null;
  }
};
  

  // --------------------------------------------------
  // START SOS
  // --------------------------------------------------

 const startSOS = async () => {
  if (sosActive || countdown !== null) {
    return;
  }

  try {
    // Get current location first
    const currentLocation =
      await getCurrentLocation();

    if (!currentLocation) {
      return;
    }

    let timeLeft = 5;

    setCountdown(timeLeft);

    countdownRef.current = setInterval(
      async () => {
        timeLeft--;

        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;

          setCountdown(null);

          // Create SOS in backend
          const sos = await createSOS(
            currentLocation
          );

          if (sos) {
            setSosActive(true);
          }
        }
      },
      1000
    );
  } catch (error) {
    console.error(
      "Unable to start SOS:",
      error
    );

    setCountdown(null);
  }
};

  // --------------------------------------------------
  // CANCEL SOS DURING COUNTDOWN
  // --------------------------------------------------

  const cancelSOS = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    setCountdown(null);
    setSosActive(false);
  };

  // --------------------------------------------------
  // STOP ACTIVE SOS
  // --------------------------------------------------
      const stopSOS = async () => {
  if (!sosId) {
    setSosActive(false);
    return;
  }

  try {
    const token = localStorage.getItem("safeRouteToken");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const response = await fetch(
      `https://saferoutemap-backend-2aql.onrender.com/api/sos/${sosId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to cancel SOS"
      );
    }

    // Clear the active SOS from the frontend
setSosActive(false);
setSosId(null);
setDisplaySosId(null);
setLocation(null);
setLocationStatus("");

    alert("SOS cancelled successfully.");
  } catch (error) {
    console.error("Cancel SOS error:", error);
    alert(error.message || "Unable to cancel SOS.");
  }
};
  // --------------------------------------------------
  // GOOGLE MAPS LINK
  // --------------------------------------------------

  const getMapsLink = () => {
    if (!location) {
      return "";
    }

    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  };

  // --------------------------------------------------
  // SHARE LOCATION
  // --------------------------------------------------

  const shareLocation = async () => {
    if (!location) {
      alert(
        "Your location is not available yet. Please wait a moment."
      );
      return;
    }

    const mapsLink = getMapsLink();

    const message = `🚨 SAFE ROUTE MAP - EMERGENCY ALERT 🚨

I may need emergency assistance.

My current location:
${mapsLink}

Please check on me or contact emergency services if necessary.`;

    try {
      // Mobile / supported browsers
      if (navigator.share) {
        await navigator.share({
          title: "Safe Route Map - Emergency Alert",
          text: message,
        });
      }

      // Desktop fallback
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);

        alert(
          "Emergency message copied to clipboard."
        );
      }

      // Final fallback
      else {
        window.prompt(
          "Copy this emergency message:",
          message
        );
      }
    } catch (error) {
      console.log("Share cancelled:", error);
    }
  };

  // --------------------------------------------------
  // CALL EMERGENCY NUMBER
  // --------------------------------------------------

  const callNumber = (number) => {
    window.location.href = `tel:${number}`;
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // PAGE UI
  // --------------------------------------------------

  return (
    <div className="sos-page">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="sos-header">

        <div className="header-content">

          <div className="header-icon">
            🚨
          </div>

          <div>
            <h1>Emergency SOS</h1>

            <p>
              Quickly access emergency assistance and
              share your current location.
            </p>
          </div>

        </div>

      </div>

      {/* ============================================
          MAIN SOS CARD
      ============================================ */}

      <div className="sos-main-card">

        {/* --------------------------------------------
            NORMAL STATE
        -------------------------------------------- */}

        {!sosActive && countdown === null && (
          <div className="normal-sos-section">

            <div className="sos-symbol">
              🚨
            </div>

            <h2>
              Need Emergency Help?
            </h2>

            <p className="sos-description">
              Press the SOS button to start an emergency
              alert and detect your current location.
            </p>

            {/* SOS BUTTON */}

            <button
              className="big-sos-button"
              onClick={startSOS}
              aria-label="Start Emergency SOS"
            >
              <span className="sos-icon">
                🚨
              </span>

              <span className="sos-text">
                SOS
              </span>
            </button>

            <p className="button-hint">
              A 5-second countdown will start
            </p>

          </div>
        )}

        {/* --------------------------------------------
            COUNTDOWN STATE
        -------------------------------------------- */}

        {countdown !== null && (
          <div className="countdown-section">

            <div className="countdown-icon">
              🚨
            </div>

            <h2>
              SOS Starting...
            </h2>

            <p>
              Emergency mode will activate soon.
            </p>

            <div className="countdown-number">
              {countdown}
            </div>

            <p className="countdown-info">
              You can cancel the emergency alert
              before the countdown finishes.
            </p>

            <button
              className="cancel-button"
              onClick={cancelSOS}
            >
              ✕ Cancel SOS
            </button>

          </div>
        )}

        {/* --------------------------------------------
            ACTIVE SOS STATE
        -------------------------------------------- */}

        {sosActive && (
          <div className="active-sos-section">

            <div className="active-icon">
              🚨
            </div>

            <h2>
              SOS ACTIVE
            </h2>
           {displaySosId && (
  <div className="sos-incident-id">
    Incident ID: <strong>{displaySosId}</strong>
  </div>
)}

            <p className="active-message">
              Emergency assistance mode is active.
            </p>

            {/* LOCATION STATUS */}

            <div className="location-card">

              <div className="location-heading">
                <span>📍</span>

                <span>
                  Current Location
                </span>
              </div>

              {location ? (
                <>
                  <div className="coordinates">

                    <div className="coordinate-row">
                      <span>Latitude</span>

                      <strong>
                        {location.lat.toFixed(6)}
                      </strong>
                    </div>

                    <div className="coordinate-row">
                      <span>Longitude</span>

                      <strong>
                        {location.lng.toFixed(6)}
                      </strong>
                    </div>

                    <div className="coordinate-row">
                      <span>Accuracy</span>

                      <strong>
                        {Math.round(location.accuracy)} m
                      </strong>
                    </div>

                  </div>

                  <a
                    href={getMapsLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-button"
                  >
                    🗺️ Open Location in Google Maps
                  </a>
                </>
              ) : (
                <div className="location-loading">
                  <div className="loading-spinner"></div>

                  <p>
                    {locationStatus ||
                      "Getting your location..."}
                  </p>
                </div>
              )}

            </div>

            {/* LOCATION STATUS MESSAGE */}

            {locationStatus && !location && (
              <p className="location-status">
                {locationStatus}
              </p>
            )}

            {/* ACTION BUTTONS */}

            <div className="active-actions">

              <button
                className="share-button"
                onClick={shareLocation}
              >
                📤 Share Location
              </button>

              <button
                className="stop-sos-button"
                onClick={stopSOS}
              >
                🛑 Stop SOS
              </button>

            </div>

          </div>
        )}

      </div>

      {/* ============================================
          EMERGENCY NUMBERS
      ============================================ */}

      <div className="emergency-card">

        <div className="section-title">

          <div className="section-title-icon">
            📞
          </div>

          <div>
            <h2>Emergency Numbers</h2>

            <p>
              Quickly contact emergency services.
            </p>
          </div>

        </div>

        <div className="emergency-grid">

          {/* 112 */}

          <button
            className="emergency-number-button"
            onClick={() => callNumber("112")}
          >

            <div className="emergency-icon">
              🚨
            </div>

            <div className="emergency-info">
              <strong>112</strong>

              <span>
                National Emergency
              </span>
            </div>

            <div className="call-arrow">
              →
            </div>

          </button>

          {/* 100 */}

          <button
            className="emergency-number-button"
            onClick={() => callNumber("100")}
          >

            <div className="emergency-icon">
              👮
            </div>

            <div className="emergency-info">
              <strong>100</strong>

              <span>
                Police
              </span>
            </div>

            <div className="call-arrow">
              →
            </div>

          </button>

          {/* 108 */}

          <button
            className="emergency-number-button"
            onClick={() => callNumber("108")}
          >

            <div className="emergency-icon">
              🚑
            </div>

            <div className="emergency-info">
              <strong>108</strong>

              <span>
                Ambulance
              </span>
            </div>

            <div className="call-arrow">
              →
            </div>

          </button>

        </div>

      </div>




      {/* ============================================
          SAFETY INFORMATION
      ============================================ */}

      <div className="safety-card">

        <div className="section-title">

          <div className="section-title-icon">
            🛡️
          </div>

          <div>
            <h2>Emergency Safety Tips</h2>

            <p>
              Keep these basic safety practices in mind.
            </p>
          </div>

        </div>

        <div className="tips-list">

          <div className="tip">

            <div className="tip-number">
              1
            </div>

            <div>
              <strong>
                Stay in a safe place
              </strong>

              <p>
                Move to a visible and secure location
                whenever possible.
              </p>
            </div>

          </div>

          <div className="tip">

            <div className="tip-number">
              2
            </div>

            <div>
              <strong>
                Share your location
              </strong>

              <p>
                Share your current location with someone
                you trust.
              </p>
            </div>

          </div>

          <div className="tip">

            <div className="tip-number">
              3
            </div>

            <div>
              <strong>
                Contact emergency services
              </strong>

              <p>
                Call the appropriate emergency service
                when immediate help is required.
              </p>
            </div>

          </div>

          <div className="tip">

            <div className="tip-number">
              4
            </div>

            <div>
              <strong>
                Keep your phone accessible
              </strong>

              <p>
                Make sure your phone is charged and
                accessible when travelling.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================
          CSS
      ============================================ */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .sos-page {
          min-height: 100vh;
          padding: 30px;
          background: #f6f8fb;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #1f2937;
        }
.sos-incident-id {
  display: inline-block;
  margin: 8px 0 12px;
  padding: 8px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
}
        /* ================= HEADER ================= */

        .sos-header {
          max-width: 1000px;
          margin: 0 auto 24px;
          background: white;
          border-radius: 18px;
          padding: 25px 30px;
          box-shadow:
            0 4px 18px rgba(0, 0, 0, 0.07);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .header-icon {
          width: 65px;
          height: 65px;
          border-radius: 15px;
          background: #fee2e2;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 35px;
        }

        .sos-header h1 {
          margin: 0 0 7px;
          font-size: 30px;
          color: #111827;
        }

        .sos-header p {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        /* ================= MAIN CARD ================= */

        .sos-main-card {
          max-width: 1000px;
          margin: 0 auto 24px;
          background: white;
          border-radius: 22px;
          padding: 45px 30px;
          text-align: center;
          box-shadow:
            0 5px 20px rgba(0, 0, 0, 0.07);
        }

        .normal-sos-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sos-symbol {
          font-size: 55px;
          margin-bottom: 10px;
        }

        .sos-main-card h2 {
          margin: 10px 0;
          font-size: 27px;
          color: #111827;
        }

        .sos-description {
          max-width: 550px;
          margin: 0 auto 30px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* ================= SOS BUTTON ================= */

        .big-sos-button {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 8px solid #fee2e2;
          background: #dc2626;
          color: white;
          cursor: pointer;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          box-shadow:
            0 0 0 8px #fef2f2;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .big-sos-button:hover {
          transform: scale(1.04);

          box-shadow:
            0 0 0 10px #fee2e2,
            0 8px 25px rgba(220, 38, 38, 0.25);
        }

        .big-sos-button:active {
          transform: scale(0.97);
        }

        .sos-icon {
          font-size: 48px;
          line-height: 1;
        }

        .sos-text {
          font-size: 38px;
          font-weight: 800;
          margin-top: 5px;
        }

        .button-hint {
          margin-top: 25px;
          color: #6b7280;
          font-size: 14px;
        }

        /* ================= COUNTDOWN ================= */

        .countdown-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .countdown-icon {
          font-size: 60px;

          animation:
            countdownPulse 0.8s infinite;
        }

        .countdown-section h2 {
          color: #dc2626;
        }

        .countdown-section > p {
          color: #6b7280;
        }

        .countdown-number {
          width: 145px;
          height: 145px;

          margin: 25px 0;

          border-radius: 50%;

          background: #fef2f2;
          border: 8px solid #dc2626;

          display: flex;
          justify-content: center;
          align-items: center;

          color: #dc2626;
          font-size: 65px;
          font-weight: 800;
        }

        .countdown-info {
          max-width: 450px;
          line-height: 1.5;
        }

        .cancel-button {
          margin-top: 20px;
          border: none;
          background: #6b7280;
          color: white;
          padding: 13px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-button:hover {
          background: #4b5563;
        }

        /* ================= ACTIVE SOS ================= */

        .active-sos-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .active-icon {
          width: 100px;
          height: 100px;

          border-radius: 50%;

          background: #fee2e2;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 55px;

          animation:
            activePulse 1.2s infinite;
        }

        .active-sos-section h2 {
          color: #dc2626;
          font-size: 30px;
          margin-bottom: 5px;
        }

        .active-message {
          color: #6b7280;
          margin-bottom: 25px;
        }

        /* ================= LOCATION ================= */

        .location-card {
          width: 100%;
          max-width: 600px;

          background: #f8fafc;

          border: 1px solid #e5e7eb;

          border-radius: 16px;

          padding: 22px;

          text-align: left;
        }

        .location-heading {
          display: flex;
          align-items: center;
          gap: 10px;

          font-size: 19px;
          font-weight: 700;

          margin-bottom: 18px;
        }

        .coordinate-row {
          display: flex;
          justify-content: space-between;

          padding: 9px 0;

          border-bottom: 1px solid #e5e7eb;

          color: #6b7280;
        }

        .coordinate-row:last-child {
          border-bottom: none;
        }

        .coordinate-row strong {
          color: #111827;
        }

        .maps-button {
          display: block;

          text-align: center;

          margin-top: 18px;

          padding: 12px 18px;

          background: #2563eb;

          color: white;

          text-decoration: none;

          border-radius: 10px;

          font-weight: 700;
        }

        .maps-button:hover {
          background: #1d4ed8;
        }

        .location-loading {
          text-align: center;
          padding: 15px;
          color: #6b7280;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;

          border: 3px solid #e5e7eb;
          border-top-color: #2563eb;

          border-radius: 50%;

          margin: 0 auto 12px;

          animation:
            spin 0.8s linear infinite;
        }

        .location-status {
          color: #dc2626;
          font-size: 14px;
          margin-top: 12px;
        }

        /* ================= ACTION BUTTONS ================= */

        .active-actions {
          display: flex;
          justify-content: center;
          gap: 15px;

          margin-top: 25px;

          flex-wrap: wrap;
        }

        .share-button,
        .stop-sos-button {
          border: none;

          padding: 14px 25px;

          border-radius: 10px;

          color: white;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;
        }

        .share-button {
          background: #2563eb;
        }

        .share-button:hover {
          background: #1d4ed8;
        }

        .stop-sos-button {
          background: #6b7280;
        }

        .stop-sos-button:hover {
          background: #4b5563;
        }

        /* ================= SECTION CARDS ================= */

        .emergency-card,
        .contacts-card,
        .safety-card {
          max-width: 1000px;

          margin: 0 auto 24px;

          background: white;

          border-radius: 18px;

          padding: 25px;

          box-shadow:
            0 4px 18px rgba(0, 0, 0, 0.06);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 14px;

          margin-bottom: 20px;
        }

        .section-title-icon {
          width: 45px;
          height: 45px;

          border-radius: 12px;

          background: #f3f4f6;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 24px;
        }

        .section-title h2 {
          margin: 0 0 4px;

          font-size: 21px;
        }

        .section-title p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        /* ================= EMERGENCY NUMBERS ================= */

        .emergency-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;
        }

        .emergency-number-button {
          width: 100%;

          display: flex;
          align-items: center;

          gap: 13px;

          padding: 17px;

          background: #f9fafb;

          border: 1px solid #e5e7eb;

          border-radius: 13px;

          cursor: pointer;

          text-align: left;

          transition: 0.2s;
        }

        .emergency-number-button:hover {
          background: #f3f4f6;
          transform: translateY(-2px);
        }

        .emergency-icon {
          font-size: 30px;
        }

        .emergency-info {
          flex: 1;
        }

        .emergency-info strong {
          display: block;

          font-size: 21px;

          color: #111827;
        }

        .emergency-info span {
          color: #6b7280;

          font-size: 13px;
        }

        .call-arrow {
          color: #2563eb;

          font-size: 22px;

          font-weight: 700;
        }

       
        /* ================= SAFETY TIPS ================= */

        .tips-list {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 15px;
        }

        .tip {
          display: flex;

          gap: 13px;

          padding: 17px;

          background: #f9fafb;

          border-radius: 13px;
        }

        .tip-number {
          min-width: 32px;
          height: 32px;

          border-radius: 50%;

          background: #2563eb;

          color: white;

          display: flex;

          justify-content: center;
          align-items: center;

          font-weight: 700;
        }

        .tip strong {
          display: block;

          margin-bottom: 5px;

          color: #111827;
        }

        .tip p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;

          line-height: 1.5;
        }

        /* ================= ANIMATIONS ================= */

        @keyframes countdownPulse {

          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.12);
          }

          100% {
            transform: scale(1);
          }

        }

        @keyframes activePulse {

          0% {
            box-shadow:
              0 0 0 0
              rgba(220, 38, 38, 0.3);
          }

          70% {
            box-shadow:
              0 0 0 18px
              rgba(220, 38, 38, 0);
          }

          100% {
            box-shadow:
              0 0 0 0
              rgba(220, 38, 38, 0);
          }

        }

        @keyframes spin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 750px) {
        
          .sos-page {
            padding: 15px;
          }

          .sos-header {
            padding: 20px;
          }

          .sos-header h1 {
            font-size: 24px;
          }

          .header-icon {
            width: 55px;
            height: 55px;
            font-size: 30px;
          }

          .sos-main-card {
            padding: 35px 20px;
          }

          .big-sos-button {
            width: 160px;
            height: 160px;
          }

          .emergency-grid {
            grid-template-columns: 1fr;
          }

          .tips-list {
            grid-template-columns: 1fr;
          }

          .active-actions {
            flex-direction: column;
            width: 100%;
          }

          .share-button,
          .stop-sos-button {
            width: 100%;
          }

          .coordinate-row {
            flex-direction: column;
            gap: 3px;
          }

        }

        @media (max-width: 450px) {

          .header-content {
            align-items: flex-start;
          }

          .sos-header p {
            line-height: 1.5;
          }

          .sos-main-card h2 {
            font-size: 23px;
          }

          .big-sos-button {
            width: 145px;
            height: 145px;
          }

          .sos-icon {
            font-size: 40px;
          }

          .sos-text {
            font-size: 32px;
          }

        }

      `}</style>
    </div>
  );
}

export default SOS;