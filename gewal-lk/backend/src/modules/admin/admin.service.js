import {
  ACCOUNT_STATUSES,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../../constants/auth.constants.js";

import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";

const adminRoles = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN];

/**
 * List every account that holds an admin-level role.
 */
export const listAdmins = async () => {
  return User.find({ roles: { $in: adminRoles } }).sort({ createdAt: 1 });
};

/**
 * Create a new admin account.
 *
 * Only existing admins can reach this service — enforced
 * by the "authorize" route middleware.
 */
export const createAdmin = async ({ firstName, lastName, email, password }) => {
  const normalisedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalisedEmail });

  if (existingUser) {
    throw new ApiError({
      statusCode: 409,
      message: "An account already exists with this email address",
      code: "EMAIL_ALREADY_EXISTS",
    });
  }

  const admin = await User.create({
    firstName,
    lastName,
    email: normalisedEmail,
    password,
    roles: [USER_ROLES.ADMIN],
    primaryAuthProvider: AUTH_PROVIDERS.LOCAL,
    accountStatus: ACCOUNT_STATUSES.ACTIVE,
    emailVerified: true,
  });

  return admin;
};

/**
 * Remove an existing admin account.
 *
 * An admin cannot delete their own account through this
 * endpoint to avoid accidentally locking themselves out.
 */
export const deleteAdmin = async ({ adminId, requestingUserId }) => {
  if (adminId === requestingUserId.toString()) {
    throw new ApiError({
      statusCode: 400,
      message: "You cannot delete your own admin account",
      code: "CANNOT_DELETE_SELF",
    });
  }

  const target = await User.findById(adminId);

  if (!target || !target.roles.some((role) => adminRoles.includes(role))) {
    throw new ApiError({
      statusCode: 404,
      message: "Admin account not found",
      code: "ADMIN_NOT_FOUND",
    });
  }

  await User.findByIdAndDelete(adminId);
};
