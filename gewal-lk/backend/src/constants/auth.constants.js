export const USER_ROLES = Object.freeze({
  BUYER: "buyer",
  SELLER: "seller",
  AGENT: "agent",
  ADMIN: "admin",
  MANAGER: "manager",
  SUPER_ADMIN: "super_admin",
});

export const ACCOUNT_STATUSES = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BLOCKED: "blocked",
  DELETED: "deleted",
});

export const AUTH_PROVIDERS = Object.freeze({
  LOCAL: "local",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  MICROSOFT: "microsoft",
  APPLE: "apple",
});

export const OTP_TYPES = Object.freeze({
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
  EMAIL_CHANGE: "email_change",
  PHONE_VERIFICATION: "phone_verification",
});

export const TOKEN_TYPES = Object.freeze({
  ACCESS: "access",
  REFRESH: "refresh",
  PASSWORD_RESET: "password_reset",
  EMAIL_VERIFICATION: "email_verification",
});

export const AUTH_COOKIE_NAMES = Object.freeze({
  ACCESS_TOKEN: "gewal_access_token",
  REFRESH_TOKEN: "gewal_refresh_token",
});

export const AUTH_ERROR_CODES = Object.freeze({
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  PHONE_ALREADY_EXISTS: "PHONE_ALREADY_EXISTS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  EMAIL_ALREADY_VERIFIED: "EMAIL_ALREADY_VERIFIED",
  ACCOUNT_PENDING: "ACCOUNT_PENDING",
  ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED",
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
  ACCOUNT_NOT_ACTIVE: "ACCOUNT_NOT_ACTIVE",
  INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  INVALID_OTP: "INVALID_OTP",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_NOT_FOUND: "OTP_NOT_FOUND",
  OTP_ATTEMPTS_EXCEEDED: "OTP_ATTEMPTS_EXCEEDED",
  OTP_RESEND_COOLDOWN: "OTP_RESEND_COOLDOWN",
  INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ACCESS_DENIED: "ACCESS_DENIED",
});

export const AUTH_LIMITS = Object.freeze({
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  OTP_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 80,
});