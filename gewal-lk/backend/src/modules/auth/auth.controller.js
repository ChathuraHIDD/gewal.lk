import { environment } from "../../config/environment.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../users/user.model.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken,
} from "./auth.service.js";

const accessCookieOptions = {
  httpOnly: true,
  secure: environment.isProduction,
  sameSite: environment.isProduction ? "none" : "lax",
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: environment.isProduction,
  sameSite: environment.isProduction ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: `/api/${environment.apiVersion}/auth`,
};

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

export const register = asyncHandler(
  async (request, response) => {
    const result = await registerUser({
      ...request.body,
      request,
    });

    setAuthenticationCookies(
      response,
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    return response.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "Account registered successfully",
        data: {
          user: result.user,
        },
      })
    );
  }
);

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

export const refresh = asyncHandler(
  async (request, response) => {
    const refreshToken =
      request.cookies.gewal_refresh_token;

    if (!refreshToken) {
      throw new ApiError({
        statusCode: 401,
        message: "Refresh token is missing",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    const tokens = await rotateRefreshToken({
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
        message: "Authentication token refreshed successfully",
      })
    );
  }
);

export const logout = asyncHandler(
  async (request, response) => {
    const refreshToken =
      request.cookies.gewal_refresh_token;

    await logoutUser(refreshToken);

    response.clearCookie(
      "gewal_access_token",
      accessCookieOptions
    );

    response.clearCookie(
      "gewal_refresh_token",
      refreshCookieOptions
    );

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Logout successful",
      })
    );
  }
);

export const getCurrentUser = asyncHandler(
  async (request, response) => {
    const user = await User.findById(request.user._id);

    if (!user) {
      throw new ApiError({
        statusCode: 404,
        message: "User account not found",
        code: "USER_NOT_FOUND",
      });
    }

    return response.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Current user retrieved successfully",
        data: {
          user,
        },
      })
    );
  }
);