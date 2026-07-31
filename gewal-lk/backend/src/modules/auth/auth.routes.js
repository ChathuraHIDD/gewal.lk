import { Router } from "express";

import {
  authenticate,
  optionalAuthenticate,
} from "../../middlewares/auth.middleware.js";

import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  logoutAll,
  refresh,
  register,
  resendEmailOtp,
  resetPassword,
  verifyEmail,
  verifyResetOtp,
} from "./auth.controller.js";

import {
  validateChangePassword,
  validateEmailOnly,
  validateLogin,
  validateOtpRequest,
  validatePasswordReset,
  validateRegistration,
} from "./auth.validation.js";

const router = Router();

/*
 * Registration
 */
router.post(
  "/register",
  validateRegistration,
  register
);

/*
 * Email verification
 */
router.post(
  "/verify-email",
  validateOtpRequest,
  verifyEmail
);

router.post(
  "/resend-email-otp",
  validateEmailOnly,
  resendEmailOtp
);

/*
 * Login
 */
router.post(
  "/login",
  validateLogin,
  login
);

/*
 * Refresh access token
 */
router.post(
  "/refresh",
  refresh
);

/*
 * Logout from current device
 */
router.post(
  "/logout",
  logout
);

/*
 * Logout from all devices
 */
router.post(
  "/logout-all",
  authenticate,
  logoutAll
);

/*
 * Get current logged-in user
 */
router.get(
  "/me",
  optionalAuthenticate,
  getCurrentUser
);

/*
 * Forgot password
 */
router.post(
  "/forgot-password",
  validateEmailOnly,
  forgotPassword
);

/*
 * Verify password-reset OTP
 */
router.post(
  "/verify-reset-otp",
  validateOtpRequest,
  verifyResetOtp
);

/*
 * Reset forgotten password
 */
router.post(
  "/reset-password",
  validatePasswordReset,
  resetPassword
);

/*
 * Change password while logged in
 */
router.patch(
  "/change-password",
  authenticate,
  validateChangePassword,
  changePassword
);

export default router;