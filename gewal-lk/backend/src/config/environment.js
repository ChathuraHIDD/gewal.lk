import dotenv from "dotenv";

dotenv.config();

const requiredEnvironmentVariables = [
  "NODE_ENV",
  "PORT",
  "MONGODB_URI",
  "FRONTEND_URL",
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName]
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(
      ", "
    )}`
  );
}

const parseNumber = (value, fallbackValue) => {
  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? fallbackValue : parsedValue;
};

export const environment = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",

  port: parseNumber(process.env.PORT, 5000),

  apiVersion: process.env.API_VERSION || "v1",

  mongoUri: process.env.MONGODB_URI,

  frontendUrl: process.env.FRONTEND_URL,

  cookieSecret: process.env.COOKIE_SECRET || "",

  rateLimit: {
    windowMs: parseNumber(
      process.env.RATE_LIMIT_WINDOW_MS,
      15 * 60 * 1000
    ),

    maxRequests: parseNumber(
      process.env.RATE_LIMIT_MAX_REQUESTS,
      200
    ),
  },

  isDevelopment: process.env.NODE_ENV === "development",

  isProduction: process.env.NODE_ENV === "production",

  isTest: process.env.NODE_ENV === "test",
});