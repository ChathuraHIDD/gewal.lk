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

const parseList = (value, fallbackValue) => {
  const parsedValues = (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsedValues.length > 0
    ? parsedValues
    : fallbackValue;
};

export const environment = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",

  port: parseNumber(process.env.PORT, 5001),

  apiVersion: process.env.API_VERSION || "v1",

  mongoUri: process.env.MONGODB_URI,

  dnsServers: parseList(
    process.env.DNS_SERVERS,
    []
  ),

  frontendUrl:
    process.env.FRONTEND_URL ||
    "http://localhost:5173",

  frontendUrls: parseList(
    process.env.FRONTEND_URL,
    ["http://localhost:5173"]
  ),

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

  email: {
    enabled:
      process.env.EMAIL_ENABLED === "true",

    showOtpInDevelopment:
      process.env.SHOW_OTP_IN_DEVELOPMENT ===
      "true",

    smtpHost:
      process.env.SMTP_HOST || "",

    smtpPort: parseNumber(
      process.env.SMTP_PORT,
      587
    ),

    smtpSecure:
      process.env.SMTP_SECURE === "true",

    smtpUser:
      process.env.SMTP_USER || "",

    smtpPass:
      process.env.SMTP_PASS || "",

    fromName:
      process.env.EMAIL_FROM_NAME ||
      "Gewal.lk",

    fromAddress:
      process.env.EMAIL_FROM_ADDRESS ||
      "no-reply@gewal.lk",
  },

  otp: {
    expiresMinutes: parseNumber(
      process.env.OTP_EXPIRES_MINUTES,
      10
    ),

    resendCooldownSeconds: parseNumber(
      process.env.OTP_RESEND_COOLDOWN_SECONDS,
      60
    ),

    maxAttempts: parseNumber(
      process.env.OTP_MAX_ATTEMPTS,
      5
    ),
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