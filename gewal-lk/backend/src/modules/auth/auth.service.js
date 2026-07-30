import crypto from "node:crypto";

import {
  ACCOUNT_STATUSES,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../../constants/auth.constants.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";
import { RefreshToken } from "./refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDate,
  verifyRefreshToken,
} from "./token.service.js";

const normaliseEmail = (email) =>
  email.trim().toLowerCase();

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
    userAgent: request.get("user-agent") || null,
    expiresAt: getTokenExpiryDate(refreshResult.token),
  });

  return {
    accessToken,
    refreshToken: refreshResult.token,
  };
};

export const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  request,
}) => {
  const normalisedEmail = normaliseEmail(email);

  const existingUser = await User.findOne({
    email: normalisedEmail,
  });

  if (existingUser) {
    throw new ApiError({
      statusCode: 409,
      message: "An account already exists with this email address",
      code: "EMAIL_ALREADY_EXISTS",
    });
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      throw new ApiError({
        statusCode: 409,
        message: "An account already exists with this phone number",
        code: "PHONE_ALREADY_EXISTS",
      });
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email: normalisedEmail,
    phone: phone || null,
    password,
    roles: [USER_ROLES.BUYER],
    primaryAuthProvider: AUTH_PROVIDERS.LOCAL,
    accountStatus: ACCOUNT_STATUSES.ACTIVE,
  });

  const tokens = await createTokenPair({
    user,
    request,
  });

  return {
    user,
    tokens,
  };
};

export const loginUser = async ({
  email,
  password,
  request,
}) => {
  const normalisedEmail = normaliseEmail(email);

  const user = await User.findOne({
    email: normalisedEmail,
    deletedAt: null,
  }).select("+password");

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email address or password",
      code: "INVALID_CREDENTIALS",
    });
  }

  if (user.accountStatus === ACCOUNT_STATUSES.SUSPENDED) {
    throw new ApiError({
      statusCode: 403,
      message: "Your account has been suspended",
      code: "ACCOUNT_SUSPENDED",
    });
  }

  if (user.accountStatus === ACCOUNT_STATUSES.BLOCKED) {
    throw new ApiError({
      statusCode: 403,
      message: "Your account has been blocked",
      code: "ACCOUNT_BLOCKED",
    });
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email address or password",
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

export const rotateRefreshToken = async ({
  refreshToken,
  request,
}) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = RefreshToken.hashToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
  }).select("+tokenHash");

  if (
    !storedToken ||
    storedToken.revokedAt ||
    storedToken.expiresAt <= new Date()
  ) {
    throw new ApiError({
      statusCode: 401,
      message: "Refresh token is invalid or expired",
      code: "INVALID_REFRESH_TOKEN",
    });
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "User account no longer exists",
      code: "USER_NOT_FOUND",
    });
  }

  storedToken.revokedAt = new Date();
  storedToken.revokedReason = "Token rotated";
  await storedToken.save();

  return createTokenPair({
    user,
    request,
    familyId: storedToken.familyId,
  });
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = RefreshToken.hashToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
      revokedReason: "User logout",
    }
  );
};