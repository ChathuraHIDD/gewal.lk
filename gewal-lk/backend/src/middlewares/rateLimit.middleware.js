import { rateLimit } from "express-rate-limit";
import { environment } from "../config/environment.js";

export const apiRateLimiter = rateLimit({
  windowMs: environment.rateLimit.windowMs,

  limit: environment.rateLimit.maxRequests,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
    errors: [],
  },
});