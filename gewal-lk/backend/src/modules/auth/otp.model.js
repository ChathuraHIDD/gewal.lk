import mongoose from "mongoose";

import { OTP_TYPES } from "../../constants/auth.constants.js";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(OTP_TYPES),
      required: true,
      index: true,
    },

    codeHash: {
      type: String,
      required: true,
      select: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    consumedAt: {
      type: Date,
      default: null,
    },

    resetTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },

    requestedIp: {
      type: String,
      default: null,
    },

    verifiedIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "otp_codes",
  }
);

otpSchema.index({
  userId: 1,
  type: 1,
  createdAt: -1,
});

export const OtpCode =
  mongoose.models.OtpCode ||
  mongoose.model("OtpCode", otpSchema);