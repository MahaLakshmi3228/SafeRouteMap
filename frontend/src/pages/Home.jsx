import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-label">
            YOUR SAFETY MATTERS
          </p>

          <h1>
            Find Your <span>Safer Route</span>
          </h1>

          <p className="hero-description">
            Discover safer routes using community-reported hazards
            and safety information.
          </p>

          <div className="hero-buttons">
            <Link to="/safe-route" className="primary-button">
              Find Safe Route →
            </Link>

            <Link to="/report-hazard" className="secondary-button">
              Report Hazard
            </Link>
          </div>

        </div>
      </section>


      {/* =========================
          FEATURES SECTION
      ========================= */}
      <section className="features-section">

        <div className="features-header">

          <p className="features-label">
            EXPLORE SAFER TRAVEL
          </p>

          <h2>
            How SafeRoute Helps You
          </h2>

          <p className="features-description">
            Use our safety-focused features to plan your journey,
            identify hazards, and get help when needed.
          </p>

        </div>


        <div className="features-grid">

          {/* Safer Routes */}
          <Link
            to="/safe-route"
            className="feature-card"
          >
            <div className="feature-icon">
              🗺️
            </div>

            <h3>
              Safer Routes
            </h3>

            <p>
              Find routes based on safety information and
              reported hazards.
            </p>

            <span className="feature-link">
              Find a route →
            </span>
          </Link>


          {/* Report Hazards */}
          <Link
            to="/report-hazard"
            className="feature-card"
          >
            <div className="feature-icon">
              📢
            </div>

            <h3>
              Report Hazards
            </h3>

            <p>
              Help your community by reporting unsafe roads
              and hazards.
            </p>

            <span className="feature-link">
              Report now →
            </span>
          </Link>


          {/* Unsafe Locations */}
          <Link
            to="/unsafe-location"
            className="feature-card"
          >
            <div className="feature-icon">
              ⚠️
            </div>

            <h3>
              Unsafe Locations
            </h3>

            <p>
              View reported unsafe locations and identify
              potential hazards.
            </p>

            <span className="feature-link">
              View locations →
            </span>
          </Link>


          {/* SOS */}
          <Link
            to="/sos"
            className="feature-card"
          >
            <div className="feature-icon">
              🚨
            </div>

            <h3>
              SOS Emergency
            </h3>

            <p>
              Quickly access emergency features and share
              your location when needed.
            </p>

            <span className="feature-link">
              Open SOS →
            </span>
          </Link>


          {/* Safety Tips */}
          <Link
            to="/safety-tips"
            className="feature-card"
          >
            <div className="feature-icon">
              🛡️
            </div>

            <h3>
              Safety Tips
            </h3>

            <p>
              Learn simple safety practices for safer travel
              and route planning.
            </p>

            <span className="feature-link">
              View tips →
            </span>
          </Link>

        </div>

      </section>


      {/* =========================
          HOW SAFEROUTE WORKS
      ========================= */}
      <section className="how-section">

        <div className="how-header">

          <p className="how-label">
            SIMPLE & EASY
          </p>

          <h2>
            How SafeRoute Works
          </h2>

          <p>
            Plan your journey in just a few simple steps.
          </p>

        </div>


        <div className="steps-container">

          {/* Step 1 */}
          <div className="step-card">

            <div className="step-number">
              1
            </div>

            <div className="step-icon">
              📍
            </div>

            <h3>
              Choose Your Destination
            </h3>

            <p>
              Enter your destination and select the location
              you want to travel to.
            </p>

          </div>


          {/* Step 2 */}
          <div className="step-card">

            <div className="step-number">
              2
            </div>

            <div className="step-icon">
              🗺️
            </div>

            <h3>
              Find Safe Routes
            </h3>

            <p>
              Explore available routes using safety and
              hazard information.
            </p>

          </div>


          {/* Step 3 */}
          <div className="step-card">

            <div className="step-number">
              3
            </div>

            <div className="step-icon">
              ⚠️
            </div>

            <h3>
              Identify Hazards
            </h3>

            <p>
              Check reported hazards and unsafe locations
              along your journey.
            </p>

          </div>


          {/* Step 4 */}
          <div className="step-card">

            <div className="step-number">
              4
            </div>

            <div className="step-icon">
              🛡️
            </div>

            <h3>
              Travel Safely
            </h3>

            <p>
              Follow the safer route and use emergency
              features whenever needed.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          SOS STRIP
      ========================= */}
      <section className="sos-strip">

        <div className="sos-content">

          <div className="sos-icon">
            🚨
          </div>

          <div className="sos-text">
            <h2>
              Need Emergency Help?
            </h2>

            <p>
              Quickly access emergency assistance and share
              your current location.
            </p>
          </div>

          <Link
            to="/sos"
            className="sos-button"
          >
            Open SOS
          </Link>

        </div>

      </section>


      {/* =========================
          FINAL SECTION
      ========================= */}
      <section className="final-section">

        <h2>
          Stay Safe. Travel Smart.
        </h2>

        <p>
          SafeRoute helps you make safer travel decisions
          using location-based safety information.
        </p>

        <Link
          to="/safe-route"
          className="final-button"
        >
          Start Your Journey →
        </Link>

      </section>

    </div>
  );
}

export default Home;