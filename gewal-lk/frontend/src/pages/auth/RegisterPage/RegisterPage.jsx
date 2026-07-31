import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout.jsx";
import { useAuth } from "../../../hooks/useAuth.js";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] =
    useState(initialFormData);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleInputChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setErrorMessage(
        "Password and confirmation password do not match."
      );

      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage(
        "Please accept the Terms and Privacy Policy."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        phone:
          formData.phone.trim() ||
          null,

        password: formData.password,
      });

      navigate("/verify-email", {
        state: {
          email:
            formData.email
              .trim()
              .toLowerCase(),
        },
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Join Gewal.lk and start discovering, selling and connecting."
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

        <div className="auth-form__row">
          <div className="auth-field">
            <label htmlFor="firstName">
              First name
            </label>

            <div className="auth-field__input">
              <UserRound size={19} />

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="lastName">
              Last name
            </label>

            <div className="auth-field__input">
              <UserRound size={19} />

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="email">
            Email address
          </label>

          <div className="auth-field__input">
            <Mail size={19} />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="phone">
            Phone number
          </label>

          <div className="auth-field__input">
            <Phone size={19} />

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0771234567"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">
            Password
          </label>

          <div className="auth-field__input">
            <LockKeyhole size={19} />

            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
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

        <div className="auth-field">
          <label htmlFor="confirmPassword">
            Confirm password
          </label>

          <div className="auth-field__input">
            <LockKeyhole size={19} />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              value={
                formData.confirmPassword
              }
              onChange={handleInputChange}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="auth-field__password-button"
              onClick={() =>
                setShowConfirmPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <label className="auth-checkbox">
          <input
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
          />

          <span>
            I agree to the{" "}
            <Link to="/terms">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          className="auth-form__button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="auth-spinner" />
              Creating account...
            </>
          ) : (
            "Create account"
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
        Already have an account?{" "}
        <Link to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;