import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (request, response, next) => {
  next(
    new ApiError({
      statusCode: 404,
      message: `Route not found: ${request.method} ${request.originalUrl}`,
      code: "ROUTE_NOT_FOUND",
    })
  );
};