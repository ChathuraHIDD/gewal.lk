import { ApiError } from "../../utils/ApiError.js";

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern =
  /^(?:\+94|0)?7\d{8}$/;

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

const cleanString = (value) =>
  typeof value === "string" ? value.trim() : "";

export const validateRegistration = (
  request,
  response,
  next
) => {
  const firstName = cleanString(request.body.firstName);
  const lastName = cleanString(request.body.lastName);
  const email = cleanString(request.body.email).toLowerCase();
  const phone = cleanString(request.body.phone);
  const password = request.body.password;

  const errors = [];

  if (firstName.length < 2) {
    errors.push({
      field: "firstName",
      message: "First name must contain at least 2 characters",
    });
  }

  if (lastName.length < 2) {
    errors.push({
      field: "lastName",
      message: "Last name must contain at least 2 characters",
    });
  }

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address",
    });
  }

  if (phone && !phonePattern.test(phone)) {
    errors.push({
      field: "phone",
      message: "Enter a valid Sri Lankan mobile number",
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
        message: "Registration validation failed",
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
  };

  return next();
};

export const validateLogin = (
  request,
  response,
  next
) => {
  const email = cleanString(request.body.email).toLowerCase();
  const password = request.body.password;

  const errors = [];

  if (!emailPattern.test(email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address",
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message: "Login validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body.email = email;

  return next();
};