import { ApiError } from "../../utils/ApiError.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

export const validateCreateAdmin = (request, response, next) => {
  const firstName = cleanString(request.body.firstName);
  const lastName = cleanString(request.body.lastName);
  const email = cleanString(request.body.email).toLowerCase();
  const password = request.body.password;

  const errors = [];

  if (firstName.length < 2) {
    errors.push({ field: "firstName", message: "First name must contain at least 2 characters" });
  }

  if (lastName.length < 2) {
    errors.push({ field: "lastName", message: "Last name must contain at least 2 characters" });
  }

  if (!emailPattern.test(email)) {
    errors.push({ field: "email", message: "Enter a valid email address" });
  }

  if (typeof password !== "string" || !passwordPattern.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message: "Admin account validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.body = { firstName, lastName, email, password };

  return next();
};
