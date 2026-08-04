import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import {
  ACCOUNT_STATUSES,
  AUTH_PROVIDERS,
  USER_ROLES,
} from "../../constants/auth.constants.js";

const socialAccountSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: [
        AUTH_PROVIDERS.GOOGLE,
        AUTH_PROVIDERS.FACEBOOK,
        AUTH_PROVIDERS.MICROSOFT,
        AUTH_PROVIDERS.APPLE,
      ],
      required: true,
    },

    providerUserId: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must contain at least 2 characters"],
      maxlength: [80, "First name cannot exceed 80 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must contain at least 2 characters"],
      maxlength: [80, "Last name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      /*
       * No default value on purpose: the "phone" unique
       * index below is sparse, which only skips documents
       * where the field is entirely absent. An explicit
       * `null` default would still populate the index and
       * collide across every phone-less account.
       */
      type: String,
      trim: true,
    },

    password: {
      type: String,
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    roles: {
      type: [
        {
          type: String,
          enum: Object.values(USER_ROLES),
        },
      ],
      default: [USER_ROLES.BUYER],
    },

    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUSES),
      default: ACCOUNT_STATUSES.ACTIVE,
      index: true,
    },

    primaryAuthProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
    },

    socialAccounts: {
      type: [socialAccountSchema],
      default: [],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: "version",
    collection: "users",

    toJSON: {
      transform(document, returnedObject) {
        delete returnedObject.password;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
  }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    sparse: true,
  }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
});

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function hasRole(role) {
  return this.roles.includes(role);
};

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);