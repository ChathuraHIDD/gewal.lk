import mongoose from "mongoose";
import { environment } from "../config/environment.js";
import { ApiError } from "../utils/ApiError.js";

const handleMongooseCastError = (error) => {
  return new ApiError({
    statusCode: 400,
    message: `Invalid value supplied for ${error.path}`,
    code: "INVALID_DATABASE_ID",
  });
};

const handleMongooseValidationError = (error) => {
  const validationErrors = Object.values(error.errors).map(
    (validationError) => ({
      field: validationError.path,
      message: validationError.message,
    })
  );

  return new ApiError({
    statusCode: 422,
    message: "Database validation failed",
    errors: validationErrors,
    code: "DATABASE_VALIDATION_ERROR",
  });
};

const handleDuplicateKeyError = (error) => {
  const duplicateField = Object.keys(error.keyValue || {})[0];

  return new ApiError({
    statusCode: 409,
    message: duplicateField
      ? `${duplicateField} already exists`
      : "A duplicate value already exists",
    errors: [
      {
        field: duplicateField || null,
        message: "This value must be unique",
      },
    ],
    code: "DUPLICATE_VALUE",
  });
};

export const globalErrorHandler = (
  error,
  request,
  response,
  next
) => {
  let normalisedError = error;

  if (error instanceof mongoose.Error.CastError) {
    normalisedError = handleMongooseCastError(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    normalisedError = handleMongooseValidationError(error);
  }

  if (error?.code === 11000) {
    normalisedError = handleDuplicateKeyError(error);
  }

  const statusCode = normalisedError.statusCode || 500;

  const responseBody = {
    success: false,
    statusCode,
    message:
      normalisedError.message || "Internal server error",
    code: normalisedError.code || "INTERNAL_SERVER_ERROR",
    errors: normalisedError.errors || [],
  };

  if (!environment.isProduction) {
    responseBody.stack = normalisedError.stack;
  }

  response.status(statusCode).json(responseBody);
};