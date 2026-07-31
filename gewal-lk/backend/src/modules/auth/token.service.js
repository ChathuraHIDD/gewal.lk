import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { environment } from "../../config/environment.js";
import { TOKEN_TYPES } from "../../constants/auth.constants.js";
import { ApiError } from "../../utils/ApiError.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      roles: user.roles,
      type: TOKEN_TYPES.ACCESS,
    },
    environment.jwt.accessSecret,
    {
      expiresIn: environment.jwt.accessExpiresIn,
      issuer: "gewal.lk",
      audience: "gewal.lk-web",
      jwtid: crypto.randomUUID(),
    }
  );
};

export const generateRefreshToken = (
  user,
  familyId = crypto.randomUUID()
) => {
  const token = jwt.sign(
    {
      sub: user._id.toString(),
      familyId,
      type: TOKEN_TYPES.REFRESH,
    },
    environment.jwt.refreshSecret,
    {
      expiresIn: environment.jwt.refreshExpiresIn,
      issuer: "gewal.lk",
      audience: "gewal.lk-web",
      jwtid: crypto.randomUUID(),
    }
  );

  return {
    token,
    familyId,
  };
};

export const verifyAccessToken = (token) => {
  try {
    const payload = jwt.verify(
      token,
      environment.jwt.accessSecret,
      {
        issuer: "gewal.lk",
        audience: "gewal.lk-web",
      }
    );

    if (payload.type !== TOKEN_TYPES.ACCESS) {
      throw new Error("Incorrect token type");
    }

    return payload;
  } catch {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid or expired access token",
      code: "INVALID_ACCESS_TOKEN",
    });
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(
      token,
      environment.jwt.refreshSecret,
      {
        issuer: "gewal.lk",
        audience: "gewal.lk-web",
      }
    );

    if (payload.type !== TOKEN_TYPES.REFRESH) {
      throw new Error("Incorrect token type");
    }

    return payload;
  } catch {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid or expired refresh token",
      code: "INVALID_REFRESH_TOKEN",
    });
  }
};

export const getTokenExpiryDate = (token) => {
  const decodedToken = jwt.decode(token);

  if (!decodedToken?.exp) {
    throw new ApiError({
      statusCode: 500,
      message: "Unable to determine token expiry",
      code: "TOKEN_EXPIRY_ERROR",
    });
  }

  return new Date(decodedToken.exp * 1000);
};