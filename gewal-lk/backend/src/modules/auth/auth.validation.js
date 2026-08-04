import { USER_ROLES } from "../../constants/auth.constants.js";
import { ApiError } from "../../utils/ApiError.js";

const registrableRoles = [
  USER_ROLES.BUYER,
  USER_ROLES.SELLER,
  USER_ROLES.AGENT,
];

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern =
  /^(?:\+94|0)?7\d{8}$/;

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

const otpPattern =
  /^\d{6}$/;

const cleanString = (value) =>
  typeof value === "string"
    ? value.trim()
    : "";

/**
 * Validate registration data
 */
export const validateRegistration = (
  request,
  response,
  next
) => {
  const firstName = cleanString(
    request.body.firstName
  );

  const lastName = cleanString(
    request.body.lastName
  );

  const email = cleanString(
    request.body.email
  ).toLowerCase();

  const phone = cleanString(
    request.body.phone
  );

  const password =
    request.body.password;

  const role = registrableRoles.includes(
    request.body.role
  )
    ? request.body.role
    : USER_ROLES.BUYER;

  const errors = [];

  if (firstName.length < 2) {
    errors.push({
      field: "firstName",
      message:
        "First name must contain at least 2 characters",
    });
  }

  if (firstName.length > 80) {
    errors.push({
      field: "firstName",
      message:
        "First name cannot exceed 80 characters",
    });
  }

  if (lastName.length < 2) {
    errors.push({
      field: "lastName",
      message:
        "Last name must contain at least 2 characters",
    });
  }

  if (lastName.length > 80) {
    errors.push({
      field: "lastName",
      message:
        "Last name cannot exceed 80 characters",
    });
  }

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message:
        "Enter a valid email address",
    });
  }

  if (
    phone &&
    !phonePattern.test(phone)
  ) {
    errors.push({
      field: "phone",
      message:
        "Enter a valid Sri Lankan mobile number",
    });
  }

  if (
    typeof password !== "string" ||
    !passwordPattern.test(password)
  ) {
    errors.push({
      field: "password",
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "Registration validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body = {
    ...request.body,
    firstName,
    lastName,
    email,
    phone: phone || null,
    role,
  };

  return next();
};

/**
 * Validate login data
 */
export const validateLogin = (
  request,
  response,
  next
) => {
  const email = cleanString(
    request.body.email
  ).toLowerCase();

  const password =
    request.body.password;

  const errors = [];

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message:
        "Enter a valid email address",
    });
  }

  if (
    typeof password !== "string" ||
    password.length === 0
  ) {
    errors.push({
      field: "password",
      message:
        "Password is required",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "Login validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body.email = email;

  return next();
};

/**
 * Validate requests that only need an email
 *
 * Used for:
 * - resend email verification OTP
 * - forgot password
 */
export const validateEmailOnly = (
  request,
  response,
  next
) => {
  const email = cleanString(
    request.body.email
  ).toLowerCase();

  if (!emailPattern.test(email)) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "Email validation failed",
        code: "VALIDATION_ERROR",
        errors: [
          {
            field: "email",
            message:
              "Enter a valid email address",
          },
        ],
      })
    );
  }

  request.body.email = email;

  return next();
};

/**
 * Validate email and 6-digit OTP
 *
 * Used for:
 * - email verification
 * - password-reset OTP verification
 */
export const validateOtpRequest = (
  request,
  response,
  next
) => {
  const email = cleanString(
    request.body.email
  ).toLowerCase();

  const otp = cleanString(
    request.body.otp
  );

  const errors = [];

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message:
        "Enter a valid email address",
    });
  }

  if (!otpPattern.test(otp)) {
    errors.push({
      field: "otp",
      message:
        "Enter the six-digit verification code",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "OTP verification validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body.email = email;
  request.body.otp = otp;

  return next();
};

/**
 * Validate password reset request
 *
 * Used after OTP verification.
 */
export const validatePasswordReset = (
  request,
  response,
  next
) => {
  const email = cleanString(
    request.body.email
  ).toLowerCase();

  const resetToken = cleanString(
    request.body.resetToken
  );

  const newPassword =
    request.body.newPassword;

  const errors = [];

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message:
        "Enter a valid email address",
    });
  }

  if (!resetToken) {
    errors.push({
      field: "resetToken",
      message:
        "Password reset token is required",
    });
  }

  if (
    typeof newPassword !== "string" ||
    !passwordPattern.test(newPassword)
  ) {
    errors.push({
      field: "newPassword",
      message:
        "New password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "Password reset validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body.email = email;
  request.body.resetToken =
    resetToken;

  return next();
};

/**
 * Validate password change while logged in
 */
export const validateChangePassword = (
  request,
  response,
  next
) => {
  const currentPassword =
    request.body.currentPassword;

  const newPassword =
    request.body.newPassword;

  const errors = [];

  if (
    typeof currentPassword !== "string" ||
    currentPassword.length === 0
  ) {
    errors.push({
      field: "currentPassword",
      message:
        "Current password is required",
    });
  }

  if (
    typeof newPassword !== "string" ||
    !passwordPattern.test(newPassword)
  ) {
    errors.push({
      field: "newPassword",
      message:
        "New password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
  }

  if (
    typeof currentPassword === "string" &&
    typeof newPassword === "string" &&
    currentPassword === newPassword
  ) {
    errors.push({
      field: "newPassword",
      message:
        "New password must be different from the current password",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message:
          "Password change validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  return next();
};