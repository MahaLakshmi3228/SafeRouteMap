import React, { useState } from "react";

function SafetyTips() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    {
      id: "All",
      name: "All Tips",
      icon: "🛡️",
    },
    {
      id: "Road",
      name: "Road Safety",
      icon: "🛣️",
    },
    {
      id: "Walking",
      name: "Walking",
      icon: "🚶",
    },
    {
      id: "Night",
      name: "Night Travel",
      icon: "🌙",
    },
    {
      id: "Vehicle",
      name: "Vehicle Safety",
      icon: "🚗",
    },
    {
      id: "Emergency",
      name: "Emergency",
      icon: "🚨",
    },
    {
      id: "Route",
      name: "Safe Routes",
      icon: "🗺️",
    },
    {
      id: "Hazard",
      name: "Hazards",
      icon: "⚠️",
    },
  ];

  const safetyTips = [
    {
      id: 1,
      category: "Road",
      icon: "🚦",
      title: "Follow Traffic Signals",
      description:
        "Always obey traffic lights, road signs, and traffic rules. Do not cross an intersection when the signal is red.",
      priority: "Important",
    },

    {
      id: 2,
      category: "Road",
      icon: "🛣️",
      title: "Use Safe Roads",
      description:
        "Prefer roads with proper lighting, sidewalks, traffic activity, and better road conditions whenever possible.",
      priority: "Recommended",
    },

    {
      id: 3,
      category: "Road",
      icon: "🚶",
      title: "Use Pedestrian Crossings",
      description:
        "Use zebra crossings, pedestrian signals, footbridges, or other designated crossing points whenever available.",
      priority: "Important",
    },

    {
      id: 4,
      category: "Walking",
      icon: "🚶‍♂️",
      title: "Stay Aware of Your Surroundings",
      description:
        "Avoid distractions while walking. Keep your attention on traffic, road conditions, and people around you.",
      priority: "Recommended",
    },

    {
      id: 5,
      category: "Walking",
      icon: "📱",
      title: "Avoid Phone Distractions",
      description:
        "Avoid continuously looking at your phone while walking, especially near roads, intersections, and crowded areas.",
      priority: "Recommended",
    },

    {
      id: 6,
      category: "Walking",
      icon: "🚧",
      title: "Watch for Road Hazards",
      description:
        "Be careful around potholes, damaged roads, construction areas, open drains, and other obstacles.",
      priority: "Important",
    },

    {
      id: 7,
      category: "Night",
      icon: "💡",
      title: "Prefer Well-Lit Roads",
      description:
        "When travelling at night, choose roads and areas with adequate street lighting whenever possible.",
      priority: "Important",
    },

    {
      id: 8,
      category: "Night",
      icon: "🌙",
      title: "Plan Your Route Before Travelling",
      description:
        "Check your route before starting your journey so you can avoid unfamiliar or potentially unsafe areas.",
      priority: "Recommended",
    },

    {
      id: 9,
      category: "Night",
      icon: "👥",
      title: "Stay Around Safe Public Areas",
      description:
        "When possible, stay near populated areas, public transport points, shops, or other active locations.",
      priority: "Recommended",
    },

    {
      id: 10,
      category: "Vehicle",
      icon: "🪖",
      title: "Wear a Helmet",
      description:
        "Two-wheeler riders and passengers should always wear a properly fitted helmet.",
      priority: "Important",
    },

    {
      id: 11,
      category: "Vehicle",
      icon: "🔒",
      title: "Use Seat Belts",
      description:
        "Always wear a seat belt when travelling in a car, including for short journeys.",
      priority: "Important",
    },

    {
      id: 12,
      category: "Vehicle",
      icon: "📵",
      title: "Do Not Use Your Phone While Driving",
      description:
        "Avoid texting, browsing, or using your phone while driving. Keep your attention on the road.",
      priority: "Critical",
    },

    {
      id: 13,
      category: "Vehicle",
      icon: "⚡",
      title: "Maintain Your Vehicle",
      description:
        "Regularly check tyres, brakes, lights, fuel, and other important vehicle components before travelling.",
      priority: "Recommended",
    },

    {
      id: 14,
      category: "Emergency",
      icon: "🚨",
      title: "Know Emergency Numbers",
      description:
        "Keep important emergency numbers such as 112, 100, and 108 accessible when travelling.",
      priority: "Critical",
    },

    {
      id: 15,
      category: "Emergency",
      icon: "📍",
      title: "Share Your Location When Needed",
      description:
        "If you need assistance, share your current location with trusted people or emergency services.",
      priority: "Important",
    },

    {
      id: 16,
      category: "Emergency",
      icon: "🆘",
      title: "Use SOS When Necessary",
      description:
        "Use the Safe Route Map SOS feature when you need emergency assistance and want to quickly share your location.",
      priority: "Critical",
    },

    {
      id: 17,
      category: "Route",
      icon: "🗺️",
      title: "Check the Safe Route",
      description:
        "Use Safe Route Map to compare available routes and choose a route with a better safety score.",
      priority: "Recommended",
    },

    {
      id: 18,
      category: "Route",
      icon: "📍",
      title: "Check Unsafe Locations",
      description:
        "Review reported unsafe locations along your journey and consider safer alternatives when available.",
      priority: "Recommended",
    },

    {
      id: 19,
      category: "Route",
      icon: "🔄",
      title: "Recheck Your Route",
      description:
        "Before starting a journey, review your route again if road conditions, weather, or traffic conditions change.",
      priority: "Recommended",
    },

    {
      id: 20,
      category: "Hazard",
      icon: "⚠️",
      title: "Report Road Hazards",
      description:
        "If you notice potholes, damaged roads, waterlogging, poor lighting, or other hazards, report them through the app.",
      priority: "Important",
    },

    {
      id: 21,
      category: "Hazard",
      icon: "📸",
      title: "Add Useful Information",
      description:
        "When reporting a hazard, provide accurate details and, when appropriate, a photo to help others understand the problem.",
      priority: "Recommended",
    },

    {
      id: 22,
      category: "Hazard",
      icon: "🔎",
      title: "Check Hazard Details",
      description:
        "Before travelling through a reported unsafe area, check the hazard type and severity shown in the application.",
      priority: "Recommended",
    },
  ];

  const filteredTips =
    activeCategory === "All"
      ? safetyTips
      : safetyTips.filter(
          (tip) => tip.category === activeCategory
        );

  const getPriorityClass = (priority) => {
    if (priority === "Critical") {
      return "priority-critical";
    }

    if (priority === "Important") {
      return "priority-important";
    }

    return "priority-recommended";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category ? category.name : categoryId;
  };

  return (
    <div className="safety-page">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="safety-header">

        <div className="header-left">

          <div className="header-icon">
            🛡️
          </div>

          <div>
            <h1>Safety Tips</h1>

            <p>
              Simple safety practices for safer travel
              and better route planning.
            </p>
          </div>

        </div>

        <div className="header-badge">
          <span>🛡️</span>
          <span>Stay Safe</span>
        </div>

      </div>

      {/* ============================================
          INTRODUCTION
      ============================================ */}

      <div className="intro-card">

        <div className="intro-icon">
          💡
        </div>

        <div>
          <h2>
            Travel Smart. Stay Safe.
          </h2>

          <p>
            Follow these simple safety practices while
            walking, driving, travelling at night, and
            using Safe Route Map.
          </p>
        </div>

      </div>

      {/* ============================================
          CATEGORY FILTER
      ============================================ */}

      <div className="category-section">

        <div className="section-heading">
          <h2>Safety Categories</h2>

          <p>
            Choose a category to view specific safety tips.
          </p>
        </div>

        <div className="category-container">

          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${
                activeCategory === category.id
                  ? "category-active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory(category.id)
              }
            >
              <span className="category-icon">
                {category.icon}
              </span>

              <span>
                {category.name}
              </span>
            </button>
          ))}

        </div>

      </div>

      {/* ============================================
          TIPS HEADER
      ============================================ */}

      <div className="tips-header">

        <div>
          <h2>
            {activeCategory === "All"
              ? "All Safety Tips"
              : `${getCategoryName(activeCategory)} Tips`}
          </h2>

          <p>
            {filteredTips.length} safety tips available
          </p>
        </div>

        <div className="tips-count">
          {filteredTips.length}
        </div>

      </div>

      {/* ============================================
          SAFETY TIPS GRID
      ============================================ */}

      <div className="tips-grid">

        {filteredTips.map((tip) => (
          <div
            key={tip.id}
            className="tip-card"
          >

            <div className="tip-card-top">

              <div className="tip-icon">
                {tip.icon}
              </div>

              <span
                className={`priority-badge ${getPriorityClass(
                  tip.priority
                )}`}
              >
                {tip.priority}
              </span>

            </div>

            <h3>
              {tip.title}
            </h3>

            <p>
              {tip.description}
            </p>

            <div className="tip-footer">

              <span>
                {getCategoryName(tip.category)}
              </span>

              <span>
                ✓
              </span>

            </div>

          </div>
        ))}

      </div>

      {/* ============================================
          QUICK SAFETY CHECKLIST
      ============================================ */}

      <div className="checklist-card">

        <div className="checklist-header">

          <div className="checklist-icon">
            ✅
          </div>

          <div>
            <h2>
              Quick Safety Checklist
            </h2>

            <p>
              Check these before starting your journey.
            </p>
          </div>

        </div>

        <div className="checklist-grid">

          <div className="check-item">
            <span>✓</span>
            <p>
              Check your route before travelling.
            </p>
          </div>

          <div className="check-item">
            <span>✓</span>
            <p>
              Keep your phone sufficiently charged.
            </p>
          </div>

          <div className="check-item">
            <span>✓</span>
            <p>
              Follow traffic rules and signals.
            </p>
          </div>

          <div className="check-item">
            <span>✓</span>
            <p>
              Avoid unnecessary distractions.
            </p>
          </div>

          <div className="check-item">
            <span>✓</span>
            <p>
              Be aware of reported hazards.
            </p>
          </div>

          <div className="check-item">
            <span>✓</span>
            <p>
              Know how to access emergency assistance.
            </p>
          </div>

        </div>

      </div>

      {/* ============================================
          DO AND DON'T
      ============================================ */}

      <div className="dos-donts">

        {/* DO */}

        <div className="do-card">

          <div className="do-header">
            <div className="do-icon">
              ✓
            </div>

            <div>
              <h2>Do</h2>
              <p>Good safety practices</p>
            </div>
          </div>

          <ul>

            <li>
              <span>✓</span>
              Plan your route before travelling.
            </li>

            <li>
              <span>✓</span>
              Follow traffic rules.
            </li>

            <li>
              <span>✓</span>
              Stay aware of your surroundings.
            </li>

            <li>
              <span>✓</span>
              Report dangerous road conditions.
            </li>

            <li>
              <span>✓</span>
              Keep emergency contacts accessible.
            </li>

          </ul>

        </div>

        {/* DON'T */}

        <div className="dont-card">

          <div className="dont-header">

            <div className="dont-icon">
              !
            </div>

            <div>
              <h2>Don't</h2>
              <p>Avoid risky behaviour</p>
            </div>

          </div>

          <ul>

            <li>
              <span>!</span>
              Don't use your phone while driving.
            </li>

            <li>
              <span>!</span>
              Don't ignore road hazards.
            </li>

            <li>
              <span>!</span>
              Don't cross roads carelessly.
            </li>

            <li>
              <span>!</span>
              Don't ignore emergency warnings.
            </li>

            <li>
              <span>!</span>
              Don't take unnecessary risks.
            </li>

          </ul>

        </div>

      </div>

      {/* ============================================
          SAFE ROUTE MAP CONNECTION
      ============================================ */}

      <div className="app-features-card">

        <div className="app-features-heading">

          <div className="app-features-icon">
            🗺️
          </div>

          <div>
            <h2>
              Use Safe Route Map
            </h2>

            <p>
              Make safer travel decisions using the
              features available in the application.
            </p>
          </div>

        </div>

        <div className="features-grid">

          <div className="feature-item">

            <span>🛣️</span>

            <div>
              <strong>
                Safe Route
              </strong>

              <p>
                Find and compare safer routes.
              </p>
            </div>

          </div>

          <div className="feature-item">

            <span>⚠️</span>

            <div>
              <strong>
                Unsafe Locations
              </strong>

              <p>
                View reported unsafe areas.
              </p>
            </div>

          </div>

          <div className="feature-item">

            <span>📢</span>

            <div>
              <strong>
                Report Hazard
              </strong>

              <p>
                Report road hazards for others.
              </p>
            </div>

          </div>

          <div className="feature-item">

            <span>🚨</span>

            <div>
              <strong>
                Emergency SOS
              </strong>

              <p>
                Quickly access emergency assistance.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================
          FOOTER MESSAGE
      ============================================ */}

      <div className="safety-footer">

        <div className="footer-icon">
          🛡️
        </div>

        <div>
          <h3>
            Your Safety Matters
          </h3>

          <p>
            Stay alert, follow safety practices, and
            choose safer routes whenever possible.
          </p>
        </div>

      </div>

      {/* ============================================
          CSS
      ============================================ */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .safety-page {
          min-height: 100vh;
          padding: 30px;
          background: #f6f8fb;
          color: #1f2937;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* ================= HEADER ================= */

        .safety-header {
          max-width: 1100px;
          margin: 0 auto 24px;

          background: white;

          border-radius: 18px;

          padding: 25px 30px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          box-shadow:
            0 4px 18px rgba(0, 0, 0, 0.06);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .header-icon {
          width: 65px;
          height: 65px;

          background: #eff6ff;

          border-radius: 15px;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 36px;
        }

        .safety-header h1 {
          margin: 0 0 7px;

          font-size: 30px;

          color: #111827;
        }

        .safety-header p {
          margin: 0;

          color: #6b7280;

          font-size: 15px;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 10px 15px;

          background: #eff6ff;

          color: #2563eb;

          border-radius: 10px;

          font-size: 14px;

          font-weight: 700;
        }

        /* ================= INTRO ================= */

        .intro-card {
          max-width: 1100px;

          margin: 0 auto 28px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f8fafc
            );

          border: 1px solid #dbeafe;

          border-radius: 18px;

          padding: 25px;

          display: flex;

          align-items: center;

          gap: 18px;
        }

        .intro-icon {
          width: 55px;
          height: 55px;

          flex-shrink: 0;

          border-radius: 14px;

          background: white;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 30px;

          box-shadow:
            0 3px 10px rgba(0,0,0,0.05);
        }

        .intro-card h2 {
          margin: 0 0 7px;

          font-size: 22px;

          color: #111827;
        }

        .intro-card p {
          margin: 0;

          color: #4b5563;

          line-height: 1.6;
        }

        /* ================= CATEGORIES ================= */

        .category-section {
          max-width: 1100px;

          margin: 0 auto 28px;
        }

        .section-heading {
          margin-bottom: 15px;
        }

        .section-heading h2 {
          margin: 0 0 5px;

          font-size: 22px;
        }

        .section-heading p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        .category-container {
          display: flex;

          gap: 10px;

          overflow-x: auto;

          padding-bottom: 6px;
        }

        .category-container::-webkit-scrollbar {
          height: 5px;
        }

        .category-container::-webkit-scrollbar-thumb {
          background: #d1d5db;

          border-radius: 10px;
        }

        .category-button {
          flex-shrink: 0;

          border: 1px solid #e5e7eb;

          background: white;

          color: #4b5563;

          padding: 11px 15px;

          border-radius: 11px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .category-button:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
  color: #374151;
}

/* Selected category */
.category-active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;

  box-shadow:
    0 4px 10px rgba(37, 99, 235, 0.18);
}

/* Keep selected category blue even when mouse is over it */
.category-active:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

        .category-icon {
          font-size: 20px;
        }

        /* ================= TIPS HEADER ================= */

        .tips-header {
          max-width: 1100px;

          margin: 0 auto 18px;

          display: flex;

          justify-content: space-between;

          align-items: center;
        }

        .tips-header h2 {
          margin: 0 0 5px;

          font-size: 23px;
        }

        .tips-header p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        .tips-count {
          width: 42px;
          height: 42px;

          border-radius: 50%;

          background: #eff6ff;

          color: #2563eb;

          display: flex;

          justify-content: center;
          align-items: center;

          font-weight: 800;
        }

        /* ================= TIPS GRID ================= */

        .tips-grid {
          max-width: 1100px;

          margin: 0 auto 30px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .tip-card {
          background: white;

          border: 1px solid #e5e7eb;

          border-radius: 16px;

          padding: 20px;

          display: flex;

          flex-direction: column;

          min-height: 240px;

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .tip-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 8px 22px rgba(0,0,0,0.07);
        }

        .tip-card-top {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 15px;
        }

        .tip-icon {
          width: 48px;
          height: 48px;

          border-radius: 13px;

          background: #f3f4f6;

          display: flex;

          justify-content: center;
          align-items: center;

          font-size: 25px;
        }

        .priority-badge {
          padding: 5px 9px;

          border-radius: 7px;

          font-size: 11px;

          font-weight: 700;
        }

        .priority-critical {
          background: #fee2e2;

          color: #b91c1c;
        }

        .priority-important {
          background: #fff7ed;

          color: #c2410c;
        }

        .priority-recommended {
          background: #eff6ff;

          color: #1d4ed8;
        }

        .tip-card h3 {
          margin: 0 0 9px;

          font-size: 18px;

          color: #111827;
        }

        .tip-card > p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;

          line-height: 1.6;

          flex: 1;
        }

        .tip-footer {
          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: 18px;

          padding-top: 13px;

          border-top: 1px solid #f0f0f0;

          color: #9ca3af;

          font-size: 12px;
        }

        .tip-footer span:last-child {
          color: #22c55e;

          font-size: 16px;
        }

        /* ================= CHECKLIST ================= */

        .checklist-card {
          max-width: 1100px;

          margin: 0 auto 28px;

          background: white;

          border-radius: 18px;

          padding: 25px;

          box-shadow:
            0 4px 18px rgba(0,0,0,0.06);
        }

        .checklist-header {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-bottom: 20px;
        }

        .checklist-icon {
          width: 48px;
          height: 48px;

          border-radius: 12px;

          background: #ecfdf5;

          display: flex;

          justify-content: center;
          align-items: center;

          font-size: 25px;
        }

        .checklist-header h2 {
          margin: 0 0 4px;

          font-size: 21px;
        }

        .checklist-header p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        .checklist-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 12px;
        }

        .check-item {
          display: flex;

          align-items: center;

          gap: 11px;

          padding: 13px 15px;

          background: #f9fafb;

          border-radius: 10px;
        }

        .check-item span {
          width: 25px;
          height: 25px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #dcfce7;

          color: #15803d;

          display: flex;

          justify-content: center;
          align-items: center;

          font-weight: 800;

          font-size: 13px;
        }

        .check-item p {
          margin: 0;

          color: #4b5563;

          font-size: 14px;
        }

        /* ================= DO / DON'T ================= */

        .dos-donts {
          max-width: 1100px;

          margin: 0 auto 28px;

          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 18px;
        }

        .do-card,
        .dont-card {
          background: white;

          border-radius: 18px;

          padding: 25px;

          border: 1px solid #e5e7eb;
        }

        .do-card {
          border-top: 4px solid #16a34a;
        }

        .dont-card {
          border-top: 4px solid #dc2626;
        }

        .do-header,
        .dont-header {
          display: flex;

          align-items: center;

          gap: 13px;

          margin-bottom: 15px;
        }

        .do-icon,
        .dont-icon {
          width: 45px;
          height: 45px;

          border-radius: 12px;

          display: flex;

          justify-content: center;
          align-items: center;

          font-size: 23px;

          font-weight: 800;
        }

        .do-icon {
          background: #dcfce7;

          color: #15803d;
        }

        .dont-icon {
          background: #fee2e2;

          color: #b91c1c;
        }

        .do-header h2,
        .dont-header h2 {
          margin: 0 0 3px;

          font-size: 20px;
        }

        .do-header p,
        .dont-header p {
          margin: 0;

          color: #6b7280;

          font-size: 13px;
        }

        .do-card ul,
        .dont-card ul {
          list-style: none;

          padding: 0;

          margin: 0;
        }

        .do-card li,
        .dont-card li {
          display: flex;

          gap: 10px;

          padding: 10px 0;

          border-bottom: 1px solid #f1f5f9;

          color: #4b5563;

          font-size: 14px;

          line-height: 1.4;
        }

        .do-card li:last-child,
        .dont-card li:last-child {
          border-bottom: none;
        }

        .do-card li span {
          color: #16a34a;

          font-weight: 800;
        }

        .dont-card li span {
          color: #dc2626;

          font-weight: 800;
        }

        /* ================= APP FEATURES ================= */

        .app-features-card {
          max-width: 1100px;

          margin: 0 auto 28px;

          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f8fafc
            );

          border: 1px solid #dbeafe;

          border-radius: 18px;

          padding: 25px;
        }

        .app-features-heading {
          display: flex;

          align-items: center;

          gap: 14px;

          margin-bottom: 20px;
        }

        .app-features-icon {
          width: 50px;
          height: 50px;

          border-radius: 13px;

          background: white;

          display: flex;

          justify-content: center;
          align-items: center;

          font-size: 27px;

          box-shadow:
            0 3px 10px rgba(0,0,0,0.05);
        }

        .app-features-heading h2 {
          margin: 0 0 5px;

          font-size: 21px;
        }

        .app-features-heading p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        .features-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 12px;
        }

        .feature-item {
          background: white;

          border-radius: 12px;

          padding: 15px;

          display: flex;

          gap: 11px;

          align-items: flex-start;
        }

        .feature-item > span {
          font-size: 25px;
        }

        .feature-item strong {
          display: block;

          margin-bottom: 4px;

          font-size: 14px;
        }

        .feature-item p {
          margin: 0;

          color: #6b7280;

          font-size: 12px;

          line-height: 1.4;
        }

        /* ================= FOOTER ================= */

        .safety-footer {
          max-width: 1100px;

          margin: 0 auto;

          padding: 22px;

          background: white;

          border-radius: 16px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 14px;

          text-align: center;

          box-shadow:
            0 4px 18px rgba(0,0,0,0.05);
        }

        .footer-icon {
          font-size: 35px;
        }

        .safety-footer h3 {
          margin: 0 0 4px;

          font-size: 18px;
        }

        .safety-footer p {
          margin: 0;

          color: #6b7280;

          font-size: 14px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 950px) {

          .tips-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .safety-page {
            padding: 15px;
          }

          .safety-header {
            padding: 20px;
          }

          .header-badge {
            display: none;
          }

          .safety-header h1 {
            font-size: 25px;
          }

          .header-icon {
            width: 55px;
            height: 55px;
            font-size: 30px;
          }

          .intro-card {
            padding: 20px;
          }

          .category-container {
            flex-wrap: nowrap;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }

          .checklist-grid {
            grid-template-columns: 1fr;
          }

          .dos-donts {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 450px) {

          .header-left {
            align-items: flex-start;
          }

          .safety-header p {
            line-height: 1.5;
          }

          .intro-card {
            align-items: flex-start;
          }

          .intro-card h2 {
            font-size: 19px;
          }

          .tips-header h2 {
            font-size: 20px;
          }

          .tip-card {
            min-height: auto;
          }

          .safety-footer {
            flex-direction: column;
          }

        }

      `}</style>
    </div>
  );
}

export default SafetyTips;