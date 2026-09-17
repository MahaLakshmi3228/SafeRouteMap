import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to send OTP.");
        return;
      }

      alert("OTP sent successfully!");

      navigate("/verify-otp", {
        state: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      console.error("Forgot password error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        {/* Left Side */}
        <div className="forgot-info">

          <div className="forgot-logo">
            🛡️
          </div>

          <h1>SafeRoute</h1>

          <h2>Keep Your Account Secure</h2>

          <p>
            Don't worry if you've forgotten your password.
            We'll help you securely recover your SafeRoute account.
          </p>

          <div className="forgot-features">

            <div>
              <span>🔐</span>
              <p>Secure password recovery</p>
            </div>

            <div>
              <span>📧</span>
              <p>OTP verification</p>
            </div>

            <div>
              <span>🛡️</span>
              <p>Protect your account</p>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="forgot-form-section">

          <div className="forgot-header">

            <div className="back-icon">
              🔑
            </div>

            <h2>Forgot Password?</h2>

            <p>
              Enter your registered email address
              to receive a verification OTP.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="forgot-form-group">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <div className="forgot-input-wrapper">

                <span className="forgot-input-icon">
                  📧
                </span>

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="forgot-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>

          {/* Back to Login */}
          <div className="forgot-login">

            <Link to="/login">
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;