import { environment } from "../../config/environment.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../users/user.model.js";

import {
  changeUserPassword,
  loginUser,
  logoutUser,
  logoutUserFromAllDevices,
  registerUser,
  requestPasswordReset,
  resendEmailVerificationOtp,
  resetUserPassword,
  rotateRefreshToken,
  verifyPasswordResetOtp,
  verifyUserEmail,
} from "./auth.service.js";

/*
 * Cookie configuration
 */

const accessCookieOptions = {
  httpOnly: true,
  secure: environment.isProduction,
  sameSite: environment.isProduction
    ? "none"
    : "lax",
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: environment.isProduction,
  sameSite: environment.isProduction
    ? "none"
    : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: `/api/${environment.apiVersion}/auth`,
};

/*
 * Set access and refresh token cookies
 */

const setAuthenticationCookies = (
  response,
  accessToken,
  refreshToken
) => {
  response.cookie(
    "gewal_access_token",
    accessToken,
    accessCookieOptions
  );

  response.cookie(
    "gewal_refresh_token",
    refreshToken,
    refreshCookieOptions
  );
};

/*
 * Clear authentication cookies
 */

const clearAuthenticationCookies = (
  response
) => {
  response.clearCookie(
    "gewal_access_token",
    accessCookieOptions
  );

  response.clearCookie(
    "gewal_refresh_token",
    refreshCookieOptions
  );
};

/*
 * Register a new account
 *
 * Registration does not create access tokens yet.
 * The user must verify the OTP first.
 */

export const register = asyncHandler(
  async (request, response) => {
    const result = await registerUser({
      ...request.body,
      request,
    });

    return response.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message:
          "Account created successfully. A verification code has been generated.",
        data: {
          user: result.user,
          verificationRequired: true,
        },
      })
    );
  }
);

/*
 * Verify registration email OTP
 *
 * Access and refresh tokens are issued only after
 * successful email verification.
 */

export const verifyEmail = asyncHandler(
  async (request, response) => {
    const result = await verifyUserEmail({
      email: request.body.email,
      otp: request.body.otp,
      request,
    });

    setAuthenticationCookies(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Email verified successfully",
        data: {
          user: result.user,
        },
      })
    );
  }
);

/*
 * Resend email verification OTP
 */

export const resendEmailOtp =
  asyncHandler(
    async (request, response) => {
      await resendEmailVerificationOtp({
        email: request.body.email,
        request,
      });

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "If the account is awaiting verification, a new verification code has been generated.",
        })
      );
    }
  );

/*
 * Login
 */

export const login = asyncHandler(
  async (request, response) => {
    const result = await loginUser({
      ...request.body,
      request,
    });

    setAuthenticationCookies(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Login successful",
        data: {
          user: result.user,
        },
      })
    );
  }
);

/*
 * Refresh authentication tokens
 */

export const refresh = asyncHandler(
  async (request, response) => {
    const refreshToken =
      request.cookies
        ?.gewal_refresh_token;

    if (!refreshToken) {
      throw new ApiError({
        statusCode: 401,
        message:
          "Refresh token is missing",
        code:
          "REFRESH_TOKEN_MISSING",
      });
    }

    const tokens =
      await rotateRefreshToken({
        refreshToken,
        request,
      });

    setAuthenticationCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Authentication token refreshed successfully",
      })
    );
  }
);

/*
 * Logout from current device
 */

export const logout = asyncHandler(
  async (request, response) => {
    const refreshToken =
      request.cookies
        ?.gewal_refresh_token;

    await logoutUser(refreshToken);

    clearAuthenticationCookies(
      response
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Logout successful",
      })
    );
  }
);

/*
 * Logout from all devices
 *
 * This route must use the authenticate middleware.
 */

export const logoutAll = asyncHandler(
  async (request, response) => {
    await logoutUserFromAllDevices(
      request.user._id
    );

    clearAuthenticationCookies(
      response
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Successfully logged out from all devices",
      })
    );
  }
);

/*
 * Get currently logged-in user
 */

export const getCurrentUser =
  asyncHandler(
    async (request, response) => {
      if (!request.user) {
        return response.status(200).json(
          new ApiResponse({
            statusCode: 200,
            message: "No authenticated user",
            data: {
              user: null,
              isAuthenticated: false,
            },
          })
        );
      }

      const user = await User.findById(
        request.user._id
      );

      if (!user) {
        throw new ApiError({
          statusCode: 404,
          message:
            "User account not found",
          code: "USER_NOT_FOUND",
        });
      }

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Current user retrieved successfully",
          data: {
            user,
            isAuthenticated: true,
          },
        })
      );
    }
  );

/*
 * Request forgot-password OTP
 */

export const forgotPassword =
  asyncHandler(
    async (request, response) => {
      await requestPasswordReset({
        email: request.body.email,
        request,
      });

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "If an account exists with that email address, a password reset code has been generated.",
        })
      );
    }
  );

/*
 * Verify forgot-password OTP
 *
 * Returns a temporary reset token after the OTP
 * is successfully verified.
 */

export const verifyResetOtp =
  asyncHandler(
    async (request, response) => {
      const result =
        await verifyPasswordResetOtp({
          email: request.body.email,
          otp: request.body.otp,
          request,
        });

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Password reset code verified successfully",
          data: {
            resetToken:
              result.resetToken,
          },
        })
      );
    }
  );

/*
 * Reset forgotten password
 */

export const resetPassword =
  asyncHandler(
    async (request, response) => {
      await resetUserPassword({
        email: request.body.email,
        resetToken:
          request.body.resetToken,
        newPassword:
          request.body.newPassword,
      });

      clearAuthenticationCookies(
        response
      );

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Password reset successfully. Please log in using your new password.",
        })
      );
    }
  );

/*
 * Change password while logged in
 *
 * This route must use the authenticate middleware.
 */

export const changePassword =
  asyncHandler(
    async (request, response) => {
      await changeUserPassword({
        userId: request.user._id,
        currentPassword:
          request.body.currentPassword,
        newPassword:
          request.body.newPassword,
      });

      /*
       * The service revokes all active refresh
       * tokens after changing the password.
       */
      clearAuthenticationCookies(
        response
      );

      return response.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Password changed successfully. Please log in again.",
        })
      );
    }
  );