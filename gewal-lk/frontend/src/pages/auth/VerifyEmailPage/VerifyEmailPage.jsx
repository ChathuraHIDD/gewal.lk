import { useState } from "react";
import { KeyRound } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout.jsx";
import { useAuth } from "../../../hooks/useAuth.js";

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    verifyEmail,
    resendOtp,
  } = useAuth();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isResending, setIsResending] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleVerify = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await verifyEmail({
        email:
          email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsResending(true);

    try {
      await resendOtp(
        email.trim().toLowerCase()
      );

      setSuccessMessage(
        "A new verification code has been generated. Check the backend terminal during development."
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="Enter the six-digit code generated for your Gewal.lk account."
    >
      <form
        className="auth-form"
        onSubmit={handleVerify}
      >
        {errorMessage && (
          <div className="auth-alert auth-alert--error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="auth-alert auth-alert--success">
            {successMessage}
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="verifyEmail">
            Email address
          </label>

          <div className="auth-field__input">
            <KeyRound size={19} />

            <input
              id="verifyEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="verificationOtp">
            Verification code
          </label>

          <div className="auth-field__input">
            <KeyRound size={19} />

            <input
              id="verificationOtp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) => {
                const nextValue =
                  event.target.value.replace(
                    /\D/g,
                    ""
                  );

                setOtp(
                  nextValue.slice(0, 6)
                );
              }}
              required
            />
          </div>
        </div>

        <button
          className="auth-form__button"
          type="submit"
          disabled={
            isSubmitting ||
            otp.length !== 6
          }
        >
          {isSubmitting ? (
            <>
              <span className="auth-spinner" />
              Verifying...
            </>
          ) : (
            "Verify account"
          )}
        </button>
      </form>

      <p className="auth-form__footer">
        Did not receive a code?{" "}
        <button
          type="button"
          className="auth-field__link"
          onClick={handleResend}
          disabled={
            isResending || !email
          }
          style={{
            border: 0,
            padding: 0,
            background: "transparent",
          }}
        >
          {isResending
            ? "Generating..."
            : "Generate a new code"}
        </button>
      </p>

      <p className="auth-form__footer">
        <Link to="/login">
          Return to login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default VerifyEmailPage;