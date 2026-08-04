import {
  ACCOUNT_STATUSES,
  AUTH_PROVIDERS,
  OTP_TYPES,
  USER_ROLES,
} from "../../constants/auth.constants.js";

import { AgentProfile } from "../../models/propertyPlatform.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";

import {
  sendPasswordResetOtpEmail,
  sendVerificationOtpEmail,
} from "./authEmail.service.js";

import {
  consumePasswordResetToken,
  createOtp,
  createPasswordResetToken,
  verifyOtp,
} from "./otp.service.js";

import { RefreshToken } from "./refreshToken.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDate,
  verifyRefreshToken,
} from "./token.service.js";

/**
 * Normalise an email before storing or searching.
 */
const normaliseEmail = (email) => {
  return email.trim().toLowerCase();
};

/**
 * Create a new access-token and refresh-token pair.
 */
const createTokenPair = async ({
  user,
  request,
  familyId,
}) => {
  const accessToken = generateAccessToken(user);

  const refreshResult = generateRefreshToken(
    user,
    familyId
  );

  const tokenHash = RefreshToken.hashToken(
    refreshResult.token
  );

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    familyId: refreshResult.familyId,
    ipAddress: request.ip,
    userAgent:
      request.get("user-agent") || null,
    expiresAt: getTokenExpiryDate(
      refreshResult.token
    ),
  });

  return {
    accessToken,
    refreshToken: refreshResult.token,
  };
};

/**
 * Register a new local Gewal.lk user.
 *
 * Email verification is not currently enforced before
 * login — the OTP infrastructure stays in place for a
 * future re-enablement, but new accounts are activated
 * and signed in immediately upon registration.
 */
export const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  role,
  request,
}) => {
  const normalisedEmail =
    normaliseEmail(email);

  const existingUser = await User.findOne({
    email: normalisedEmail,
  });

  if (existingUser) {
    throw new ApiError({
      statusCode: 409,
      message:
        "An account already exists with this email address",
      code: "EMAIL_ALREADY_EXISTS",
    });
  }

  if (phone) {
    const existingPhone =
      await User.findOne({
        phone,
      });

    if (existingPhone) {
      throw new ApiError({
        statusCode: 409,
        message:
          "An account already exists with this phone number",
        code: "PHONE_ALREADY_EXISTS",
      });
    }
  }

  const assignedRole = [
    USER_ROLES.BUYER,
    USER_ROLES.SELLER,
    USER_ROLES.AGENT,
  ].includes(role)
    ? role
    : USER_ROLES.BUYER;

  const user = await User.create({
    firstName,
    lastName,
    email: normalisedEmail,
    phone: phone || undefined,
    password,

    roles: [assignedRole],

    primaryAuthProvider:
      AUTH_PROVIDERS.LOCAL,

    accountStatus:
      ACCOUNT_STATUSES.ACTIVE,

    emailVerified: true,
    phoneVerified: false,
    lastLogin: new Date(),
  });

  if (assignedRole === USER_ROLES.AGENT) {
    await AgentProfile.create({
      userId: user._id,
    });
  }

  const tokens = await createTokenPair({
    user,
    request,
  });

  return {
    user,
    tokens,
  };
};

/**
 * Verify a newly registered user's email.
 */
export const verifyUserEmail = async ({
  email,
  otp,
  request,
}) => {
  const normalisedEmail =
    normaliseEmail(email);

  const user = await User.findOne({
    email: normalisedEmail,
  });

  if (!user) {
    throw new ApiError({
      statusCode: 400,
      message:
        "The email verification request is invalid",
      code:
        "INVALID_EMAIL_VERIFICATION_REQUEST",
    });
  }

  if (user.emailVerified) {
    throw new ApiError({
      statusCode: 409,
      message:
        "This email address has already been verified",
      code: "EMAIL_ALREADY_VERIFIED",
    });
  }

  const otpRecord = await verifyOtp({
    user,
    type:
      OTP_TYPES.EMAIL_VERIFICATION,
    code: otp,
    request,
  });

  otpRecord.consumedAt = new Date();

  await otpRecord.save();

  user.emailVerified = true;
  user.accountStatus =
    ACCOUNT_STATUSES.ACTIVE;
  user.lastLogin = new Date();

  await user.save();

  const tokens = await createTokenPair({
    user,
    request,
  });

  return {
    user,
    tokens,
  };
};

/**
 * Send a new email-verification OTP.
 */
export const resendEmailVerificationOtp =
  async ({
    email,
    request,
  }) => {
    const normalisedEmail =
      normaliseEmail(email);

    const user = await User.findOne({
      email: normalisedEmail,
    });

    /*
     * Do not reveal whether an account exists.
     */
    if (!user) {
      return;
    }

    if (user.emailVerified) {
      throw new ApiError({
        statusCode: 409,
        message:
          "This email address has already been verified",
        code: "EMAIL_ALREADY_VERIFIED",
      });
    }

    const { otp } = await createOtp({
      user,
      type:
        OTP_TYPES.EMAIL_VERIFICATION,
      request,
    });

    await sendVerificationOtpEmail({
      user,
      otp,
    });
  };

/**
 * Log in using email and password.
 */
export const loginUser = async ({
  email,
  password,
  request,
}) => {
  const normalisedEmail =
    normaliseEmail(email);

  const user = await User.findOne({
    email: normalisedEmail,
    deletedAt: null,
  }).select("+password");

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message:
        "Invalid email address or password",
      code: "INVALID_CREDENTIALS",
    });
  }

  if (!user.password) {
    throw new ApiError({
      statusCode: 400,
      message:
        "This account does not currently have a password. Use the connected social-login provider or reset the password.",
      code:
        "LOCAL_PASSWORD_NOT_CONFIGURED",
    });
  }

  if (!user.emailVerified) {
    throw new ApiError({
      statusCode: 403,
      message:
        "Please verify your email address before logging in",
      code: "EMAIL_NOT_VERIFIED",
    });
  }

  if (
    user.accountStatus ===
    ACCOUNT_STATUSES.PENDING
  ) {
    throw new ApiError({
      statusCode: 403,
      message:
        "Your account is waiting for email verification",
      code: "ACCOUNT_PENDING",
    });
  }

  if (
    user.accountStatus ===
    ACCOUNT_STATUSES.SUSPENDED
  ) {
    throw new ApiError({
      statusCode: 403,
      message:
        "Your account has been suspended",
      code: "ACCOUNT_SUSPENDED",
    });
  }

  if (
    user.accountStatus ===
    ACCOUNT_STATUSES.BLOCKED
  ) {
    throw new ApiError({
      statusCode: 403,
      message:
        "Your account has been blocked",
      code: "ACCOUNT_BLOCKED",
    });
  }

  if (
    user.accountStatus !==
    ACCOUNT_STATUSES.ACTIVE
  ) {
    throw new ApiError({
      statusCode: 403,
      message:
        "Your account is not active",
      code: "ACCOUNT_NOT_ACTIVE",
    });
  }

  const passwordMatches =
    await user.comparePassword(password);

  if (!passwordMatches) {
    throw new ApiError({
      statusCode: 401,
      message:
        "Invalid email address or password",
      code: "INVALID_CREDENTIALS",
    });
  }

  user.lastLogin = new Date();

  await user.save();

  const tokens = await createTokenPair({
    user,
    request,
  });

  user.password = undefined;

  return {
    user,
    tokens,
  };
};

/**
 * Request a password-reset OTP.
 */
export const requestPasswordReset =
  async ({
    email,
    request,
  }) => {
    const normalisedEmail =
      normaliseEmail(email);

    const user = await User.findOne({
      email: normalisedEmail,
      deletedAt: null,
    });

    /*
     * Always return normally when the account does
     * not exist. This prevents email enumeration.
     */
    if (!user) {
      return;
    }

    const { otp } = await createOtp({
      user,
      type:
        OTP_TYPES.PASSWORD_RESET,
      request,
    });

    await sendPasswordResetOtpEmail({
      user,
      otp,
    });
  };

/**
 * Verify the six-digit password-reset OTP.
 *
 * A short-lived reset token is generated after the
 * OTP is successfully verified.
 */
export const verifyPasswordResetOtp =
  async ({
    email,
    otp,
    request,
  }) => {
    const normalisedEmail =
      normaliseEmail(email);

    const user = await User.findOne({
      email: normalisedEmail,
      deletedAt: null,
    });

    if (!user) {
      throw new ApiError({
        statusCode: 400,
        message:
          "The password reset request is invalid",
        code:
          "INVALID_PASSWORD_RESET_REQUEST",
      });
    }

    const otpRecord = await verifyOtp({
      user,
      type:
        OTP_TYPES.PASSWORD_RESET,
      code: otp,
      request,
    });

    const resetToken =
      await createPasswordResetToken(
        otpRecord
      );

    return {
      resetToken,
    };
  };

/**
 * Reset the user's password using the short-lived
 * reset token created after OTP verification.
 */
export const resetUserPassword =
  async ({
    email,
    resetToken,
    newPassword,
  }) => {
    const normalisedEmail =
      normaliseEmail(email);

    const otpRecord =
      await consumePasswordResetToken({
        email: normalisedEmail,
        resetToken,
      });

    const user = await User.findById(
      otpRecord.userId
    ).select("+password");

    if (!user) {
      throw new ApiError({
        statusCode: 400,
        message:
          "The password reset request is invalid",
        code:
          "INVALID_PASSWORD_RESET_REQUEST",
      });
    }

    user.password = newPassword;

    await user.save();

    /*
     * Revoke every active login session after a
     * password reset.
     */
    await RefreshToken.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason:
            "Password was reset",
        },
      }
    );

    return user;
  };

/**
 * Change password while the user is logged in.
 */
export const changeUserPassword =
  async ({
    userId,
    currentPassword,
    newPassword,
  }) => {
    const user = await User.findById(
      userId
    ).select("+password");

    if (!user) {
      throw new ApiError({
        statusCode: 404,
        message:
          "User account not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.password) {
      throw new ApiError({
        statusCode: 400,
        message:
          "This account does not have a local password configured",
        code:
          "LOCAL_PASSWORD_NOT_CONFIGURED",
      });
    }

    const passwordMatches =
      await user.comparePassword(
        currentPassword
      );

    if (!passwordMatches) {
      throw new ApiError({
        statusCode: 401,
        message:
          "The current password is incorrect",
        code:
          "INCORRECT_CURRENT_PASSWORD",
      });
    }

    const samePassword =
      await user.comparePassword(
        newPassword
      );

    if (samePassword) {
      throw new ApiError({
        statusCode: 422,
        message:
          "The new password must be different from the current password",
        code:
          "PASSWORD_NOT_CHANGED",
      });
    }

    user.password = newPassword;

    await user.save();

    /*
     * Revoke all devices after changing password.
     */
    await RefreshToken.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason:
            "Password was changed",
        },
      }
    );

    return user;
  };

/**
 * Rotate an existing refresh token.
 */
export const rotateRefreshToken =
  async ({
    refreshToken,
    request,
  }) => {
    const payload =
      verifyRefreshToken(refreshToken);

    const tokenHash =
      RefreshToken.hashToken(
        refreshToken
      );

    const storedToken =
      await RefreshToken.findOne({
        tokenHash,
      }).select("+tokenHash");

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <=
        new Date()
    ) {
      throw new ApiError({
        statusCode: 401,
        message:
          "Refresh token is invalid or expired",
        code:
          "INVALID_REFRESH_TOKEN",
      });
    }

    if (
      storedToken.userId.toString() !==
      payload.sub
    ) {
      throw new ApiError({
        statusCode: 401,
        message:
          "Refresh token does not belong to this user",
        code:
          "REFRESH_TOKEN_USER_MISMATCH",
      });
    }

    const user = await User.findById(
      payload.sub
    );

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        message:
          "User account no longer exists",
        code: "USER_NOT_FOUND",
      });
    }

    if (
      user.accountStatus !==
      ACCOUNT_STATUSES.ACTIVE
    ) {
      throw new ApiError({
        statusCode: 403,
        message:
          "Your account is not active",
        code: "ACCOUNT_NOT_ACTIVE",
      });
    }

    storedToken.revokedAt =
      new Date();

    storedToken.revokedReason =
      "Token rotated";

    await storedToken.save();

    return createTokenPair({
      user,
      request,
      familyId:
        storedToken.familyId,
    });
  };

/**
 * Logout from the current device.
 */
export const logoutUser = async (
  refreshToken
) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    RefreshToken.hashToken(
      refreshToken
    );

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
        revokedReason:
          "User logout",
      },
    }
  );
};

/**
 * Logout the user from all devices.
 */
export const logoutUserFromAllDevices =
  async (userId) => {
    await RefreshToken.updateMany(
      {
        userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason:
            "User logged out from all devices",
        },
      }
    );
  };