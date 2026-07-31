export class ApiResponse {
  constructor({
    statusCode = 200,
    message = "Request completed successfully",
    data = null,
    meta = null,
  }) {
    this.success = statusCode >= 200 && statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;

    if (meta !== null) {
      this.meta = meta;
    }
  }
}