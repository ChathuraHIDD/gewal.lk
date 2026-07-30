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
});

export const AUTH_PROVIDERS = Object.freeze({
  LOCAL: "local",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  MICROSOFT: "microsoft",
  APPLE: "apple",
});

export const TOKEN_TYPES = Object.freeze({
  ACCESS: "access",
  REFRESH: "refresh",
});