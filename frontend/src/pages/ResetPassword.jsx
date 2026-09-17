import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !resetToken) {
      alert("Reset session is missing. Please request a new OTP.");
      navigate("/forgot-password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            resetToken,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to reset password.");
        return;
      }

      alert("Password reset successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-page">

      {/* LEFT SECTION */}
      <section className="reset-left">

        <div className="reset-brand">
          <div className="reset-brand-icon">🛡️</div>
          <span>SafeRoute</span>
        </div>

        <div className="reset-left-content">

          <h1>
            Create a
            <br />
            <span>New Password</span>
          </h1>

          <p>
            You're almost there. Create a strong new password
            to secure your SafeRoute account.
          </p>

          <div className="reset-benefits">

            <div className="reset-benefit">
              <div className="reset-benefit-icon">🔐</div>

              <div>
                <h3>Keep Your Account Secure</h3>
                <p>
                  Use a password that is difficult for others to guess.
                </p>
              </div>
            </div>

            <div className="reset-benefit">
              <div className="reset-benefit-icon">🛡️</div>

              <div>
                <h3>Protect Your SafeRoute Account</h3>
                <p>
                  Your new password will protect your account and reports.
                </p>
              </div>
            </div>

            <div className="reset-benefit">
              <div className="reset-benefit-icon">✅</div>

              <div>
                <h3>You're Almost Done</h3>
                <p>
                  Set your new password and continue using SafeRoute.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* RIGHT SECTION */}
      <section className="reset-right">

        <div className="reset-card">

          <div className="reset-card-icon">
            🔑
          </div>

          <h2>Reset Password</h2>

          <p className="reset-subtitle">
            Create a new password for your account.
          </p>

          {email && (
            <div className="reset-email-box">
              <span>📧</span>
              <span>{email}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="reset-form-group">

              <label htmlFor="password">
                New Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <div className="reset-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

            </div>

            <p className="reset-password-hint">
              Password must contain at least 6 characters.
            </p>

            <button
              type="submit"
              className="reset-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>

          <div className="reset-login">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}

export default ResetPassword;