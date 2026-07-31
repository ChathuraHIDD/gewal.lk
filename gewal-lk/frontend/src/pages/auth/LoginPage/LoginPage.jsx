import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout.jsx";
import { useAuth } from "../../../hooks/useAuth.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({
        email:
          email.trim().toLowerCase(),
        password,
      });

      const redirectPath =
        location.state?.from?.pathname ||
        "/";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage your listings, favourites and messages."
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div className="auth-alert auth-alert--error">
            {errorMessage}
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="loginEmail">
            Email address
          </label>

          <div className="auth-field__input">
            <Mail size={19} />

            <input
              id="loginEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-field__header">
            <label htmlFor="loginPassword">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="auth-field__link"
            >
              Forgot password?
            </Link>
          </div>

          <div className="auth-field__input">
            <LockKeyhole size={19} />

            <input
              id="loginPassword"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="auth-field__password-button"
              onClick={() =>
                setShowPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <button
          className="auth-form__button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="auth-spinner" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="auth-divider">
        Social login coming soon
      </div>

      <div className="auth-social-grid">
        <button
          className="auth-social-button"
          type="button"
          disabled
        >
          Google
        </button>

        <button
          className="auth-social-button"
          type="button"
          disabled
        >
          Microsoft
        </button>
      </div>

      <p className="auth-form__footer">
        New to Gewal.lk?{" "}
        <Link to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;