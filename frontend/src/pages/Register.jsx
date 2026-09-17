import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError(
        "Please agree to the Terms and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      // Send registration request to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgree(false);

      // Go to login page
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* Left Side */}
        <div className="register-info">

          <div className="register-logo">
            🛡️
          </div>

          <h1>Join SafeRoute</h1>

          <h2>Travel Safer. Stay Alert.</h2>

          <p>
            Create your SafeRoute account to report hazards,
            keep track of your reports and contribute to a
            safer community.
          </p>

          <div className="register-benefits">

            <div className="benefit-item">
              <span>🚨</span>

              <div>
                <strong>Report Hazards</strong>
                <p>
                  Help others by reporting unsafe conditions.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>📋</span>

              <div>
                <strong>Track Your Reports</strong>
                <p>
                  View the reports you have submitted.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>🗺️</span>

              <div>
                <strong>Find Safer Routes</strong>
                <p>
                  Discover safer travel options.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="register-form-section">

          <div className="register-header">
            <h2>Create Account</h2>

            <p>
              Sign up to get started with SafeRoute
            </p>
          </div>

          {error && (
            <div className="register-message register-error">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="register-message register-success">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="register-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>
            </div>

            {/* Email */}
            <div className="register-form-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  📧
                </span>

                <input
                  id="register-email"
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
            <div className="register-form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              <small className="password-hint">
                Password must contain at least 6 characters.
              </small>

            </div>

            {/* Confirm Password */}
            <div className="register-form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔐
                </span>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* Terms */}
            <label className="terms-checkbox">

              <input
                type="checkbox"
                checked={agree}
                onChange={(e) =>
                  setAgree(e.target.checked)
                }
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Terms and Privacy Policy will be added later."
                    )
                  }
                >
                  Terms and Privacy Policy
                </button>
              </span>

            </label>

            {/* Register Button */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="register-divider">
            <span>OR</span>
          </div>

          <div className="login-existing">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>

          <Link
            to="/"
            className="register-back-home"
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Register;