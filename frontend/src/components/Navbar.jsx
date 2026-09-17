import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(
        localStorage.getItem("safeRouteLoggedIn") === "true"
      );
    };

    checkLogin();

    // Check again whenever the user returns to the page
    window.addEventListener("focus", checkLogin);

    return () => {
      window.removeEventListener("focus", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("safeRouteLoggedIn");
    sessionStorage.removeItem("redirectAfterLogin");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">🛡️ SafeRoute</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/safe-route">
          Find Route
        </Link>

        <Link to="/report-hazard">
          Report Hazard
        </Link>

        <Link to="/unsafe-location">
          Unsafe Location
        </Link>

        <Link to="/sos">
          SOS
        </Link>

        <Link to="/safety-tips">
          Safety Tips
        </Link>

        {/* Always visible */}
        <Link to="/my-reports">
          My Reports
        </Link>

        {/* Only visible after login */}
        {isLoggedIn && (
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;