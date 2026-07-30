export class ApiError extends Error {
  constructor({
    statusCode = 500,
    message = "Internal server error",
    errors = [],
    code = null,
    stack = "",
  } = {}) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.code = code;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}