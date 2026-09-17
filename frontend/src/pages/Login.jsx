import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // Send login request to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Store JWT token
      localStorage.setItem("safeRouteToken", data.token);

      // Store logged-in user
      localStorage.setItem(
        "safeRouteUser",
        JSON.stringify(data.user)
      );

      // Store login status
      localStorage.setItem("safeRouteLoggedIn", "true");

      // Check if user originally tried to access a protected page
      const redirectTo =
  data.user?.role === "admin"
    ? "/admin"
    : sessionStorage.getItem("redirectAfterLogin") || "/";

sessionStorage.removeItem("redirectAfterLogin");

setSuccess(
  data.user?.role === "admin"
    ? "Admin login successful!"
    : "Login successful!"
);

setTimeout(() => {
  navigate(redirectTo);
}, 800);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Left Side */}
        <div className="login-info">
          <div className="login-logo">🛡️</div>

          <h1>SafeRoute</h1>

          <h2>Your Safety Matters</h2>

          <p>
            Find safer routes, report hazards, identify unsafe
            locations and quickly access emergency assistance.
          </p>

          <div className="login-features">
            <div>
              <span>🗺️</span>
              <p>Find safer routes</p>
            </div>

            <div>
              <span>🚨</span>
              <p>Report hazards</p>
            </div>

            <div>
              <span>📍</span>
              <p>Identify unsafe locations</p>
            </div>

            <div>
              <span>🆘</span>
              <p>Emergency assistance</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-form-section">

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Login to your SafeRoute account</p>
          </div>

          {error && (
            <div className="message error-message">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">📧</span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Login Options */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <Link
  to="/forgot-password"
  className="forgot-password"
>
  Forgot password?
</Link>
</div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="register-text">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Login;