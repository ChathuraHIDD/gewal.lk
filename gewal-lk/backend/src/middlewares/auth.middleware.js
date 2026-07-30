import { ACCOUNT_STATUSES } from "../constants/auth.constants.js";
import { User } from "../modules/users/user.model.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const extractAccessToken = (request) => {
  const cookieToken =
    request.cookies?.gewal_access_token;

  if (cookieToken) {
    return cookieToken;
  }

  const authorizationHeader =
    request.headers.authorization;

  if (
    authorizationHeader &&
    authorizationHeader.startsWith("Bearer ")
  ) {
    return authorizationHeader.slice(7);
  }

  return null;
};

export const authenticate = asyncHandler(
  async (request, response, next) => {
    const token = extractAccessToken(request);

    if (!token) {
      throw new ApiError({
        statusCode: 401,
        message: "Authentication is required",
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    if (!user || user.deletedAt) {
      throw new ApiError({
        statusCode: 401,
        message: "User account no longer exists",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.accountStatus !== ACCOUNT_STATUSES.ACTIVE) {
      throw new ApiError({
        statusCode: 403,
        message: "Your account is not active",
        code: "ACCOUNT_NOT_ACTIVE",
      });
    }

    request.user = user;
    request.auth = payload;

    return next();
  }
);

export const authorize = (...allowedRoles) => {
  return (request, response, next) => {
    const hasPermission = allowedRoles.some((role) =>
      request.user.roles.includes(role)
    );

    if (!hasPermission) {
      return next(
        new ApiError({
          statusCode: 403,
          message:
            "You do not have permission to access this resource",
          code: "ACCESS_DENIED",
        })
      );
    }

    return next();
  };
};