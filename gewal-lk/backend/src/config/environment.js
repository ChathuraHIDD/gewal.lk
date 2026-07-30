import dotenv from "dotenv";

dotenv.config();

const requiredEnvironmentVariables = [
  "NODE_ENV",
  "PORT",
  "MONGODB_URI",
  "FRONTEND_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const missingEnvironmentVariables =
  requiredEnvironmentVariables.filter(
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

  return Number.isNaN(parsedValue)
    ? fallbackValue
    : parsedValue;
};

export const environment = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",

  port: parseNumber(process.env.PORT, 5001),

  apiVersion: process.env.API_VERSION || "v1",

  mongoUri: process.env.MONGODB_URI,

  frontendUrl:
    process.env.FRONTEND_URL ||
    "http://localhost:5173",

  backendUrl:
    process.env.BACKEND_URL ||
    "http://localhost:5001",

  cookieSecret:
    process.env.COOKIE_SECRET || "",

  sessionSecret:
    process.env.SESSION_SECRET || "",

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET,

    refreshSecret:
      process.env.JWT_REFRESH_SECRET,

    accessExpiresIn:
      process.env.JWT_ACCESS_EXPIRES_IN ||
      "15m",

    refreshExpiresIn:
      process.env.JWT_REFRESH_EXPIRES_IN ||
      "30d",
  },

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

  isDevelopment:
    process.env.NODE_ENV === "development",

  isProduction:
    process.env.NODE_ENV === "production",

  isTest:
    process.env.NODE_ENV === "test",
});