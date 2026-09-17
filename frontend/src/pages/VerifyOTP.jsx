import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./VerifyOTP.css";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // VERIFY OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email address is missing. Please start again.");
      navigate("/forgot-password");
      return;
    }

    if (otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://saferoutemap-backend-2aql.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid OTP.");
        return;
      }

      alert("OTP verified successfully!");

      navigate("/reset-password", {
        state: {
          email,
          resetToken: data.resetToken,
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // RESEND OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0 || isResending) {
      return;
    }

    if (!email) {
      alert("Email address is missing. Please start again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setIsResending(true);

      const response = await fetch(
        "https://saferoutemap-backend-2aql.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to resend OTP.");
        return;
      }

      // Start countdown again
      setResendTimer(60);

      // Clear previous OTP
      setOtp("");

      alert("A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Resend OTP error:", error);

      alert(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-page">

      {/* LEFT SECTION */}
      <section className="verify-left">

        <div className="verify-brand">
          <div className="verify-brand-icon">🛡️</div>
          <span>SafeRoute</span>
        </div>

        <div className="verify-left-content">

          <h1>
            Secure Your
            <br />
            <span>SafeRoute Account</span>
          </h1>

          <p>
            We're verifying your identity before allowing you to
            reset your password. This helps keep your SafeRoute
            account secure.
          </p>

          <div className="verify-benefits">

            <div className="verify-benefit">
              <div className="benefit-icon">🔐</div>

              <div>
                <h3>Secure Verification</h3>

                <p>
                  Your account is protected with OTP verification.
                </p>
              </div>
            </div>

            <div className="verify-benefit">
              <div className="benefit-icon">📧</div>

              <div>
                <h3>Check Your Email</h3>

                <p>
                  We've sent a 6-digit code to your registered email.
                </p>
              </div>
            </div>

            <div className="verify-benefit">
              <div className="benefit-icon">⏱️</div>

              <div>
                <h3>Limited Validity</h3>

                <p>
                  Your verification code is valid for 10 minutes.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* RIGHT SECTION */}
      <section className="verify-right">

        <div className="verify-card">

          <div className="verify-card-icon">
            🔢
          </div>

          <h2>Verify OTP</h2>

          <p className="verify-subtitle">
            Enter the 6-digit verification code
            <br />
            sent to your email address.
          </p>

          {email && (
            <div className="verify-email-box">
              <span>📧</span>
              <span>{email}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label htmlFor="otp">
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              placeholder="000000"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              className="otp-input"
              autoComplete="one-time-code"
              required
            />

            <p className="otp-hint">
              Enter the 6-digit code from your email
            </p>

            <button
              type="submit"
              className="verify-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

          </form>

          {/* RESEND OTP */}
          <div className="resend-section">

            <span>Didn't receive the code?</span>

            {resendTimer > 0 ? (
              <span className="resend-disabled">
                Resend OTP in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                className="resend-button"
                onClick={handleResendOTP}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            )}

          </div>

          {/* CHANGE EMAIL */}
          <div className="verify-back">
            <Link to="/forgot-password">
              ← Change Email
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}

export default VerifyOTP;