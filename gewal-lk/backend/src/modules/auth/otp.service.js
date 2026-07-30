import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { environment } from "../../config/environment.js";
import { ApiError } from "../../utils/ApiError.js";

import { OtpCode } from "./otp.model.js";

const generateOtp = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

const generateResetToken = () => {
  return crypto
    .randomBytes(48)
    .toString("hex");
};

const calculateOtpExpiry = () => {
  return new Date(
    Date.now() +
      environment.otp.expiresMinutes *
        60 *
        1000
  );
};

export const createOtp = async ({
  user,
  type,
  request,
}) => {
  const latestOtp = await OtpCode.findOne({
    userId: user._id,
    type,
    consumedAt: null,
  }).sort({
    createdAt: -1,
  });

  if (latestOtp) {
    const cooldownMilliseconds =
      environment.otp.resendCooldownSeconds *
      1000;

    const nextAllowedTime =
      latestOtp.createdAt.getTime() +
      cooldownMilliseconds;

    if (Date.now() < nextAllowedTime) {
      const remainingSeconds = Math.ceil(
        (nextAllowedTime - Date.now()) /
          1000
      );

      throw new ApiError({
        statusCode: 429,
        message:
          `Please wait ${remainingSeconds} seconds before requesting another code`,
        code: "OTP_RESEND_COOLDOWN",
      });
    }
  }

  await OtpCode.updateMany(
    {
      userId: user._id,
      type,
      consumedAt: null,
    },
    {
      consumedAt: new Date(),
    }
  );

  const otp = generateOtp();

  const codeHash = await bcrypt.hash(
    otp,
    10
  );

  const otpRecord = await OtpCode.create({
    userId: user._id,
    email: user.email,
    type,
    codeHash,
    maxAttempts:
      environment.otp.maxAttempts,
    expiresAt: calculateOtpExpiry(),
    requestedIp: request.ip,
  });

  return {
    otp,
    otpRecord,
  };
};

export const verifyOtp = async ({
  user,
  type,
  code,
  request,
}) => {
  const otpRecord = await OtpCode.findOne({
    userId: user._id,
    type,
    consumedAt: null,
  })
    .sort({
      createdAt: -1,
    })
    .select("+codeHash");

  if (!otpRecord) {
    throw new ApiError({
      statusCode: 400,
      message:
        "No active verification code was found",
      code: "OTP_NOT_FOUND",
    });
  }

  if (otpRecord.expiresAt <= new Date()) {
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    throw new ApiError({
      statusCode: 400,
      message:
        "The verification code has expired",
      code: "OTP_EXPIRED",
    });
  }

  if (
    otpRecord.attempts >=
    otpRecord.maxAttempts
  ) {
    otpRecord.consumedAt = new Date();
    await otpRecord.save();

    throw new ApiError({
      statusCode: 429,
      message:
        "Maximum verification attempts exceeded",
      code: "OTP_ATTEMPTS_EXCEEDED",
    });
  }

  const codeMatches = await bcrypt.compare(
    code,
    otpRecord.codeHash
  );

  if (!codeMatches) {
    otpRecord.attempts += 1;

    if (
      otpRecord.attempts >=
      otpRecord.maxAttempts
    ) {
      otpRecord.consumedAt = new Date();
    }

    await otpRecord.save();

    throw new ApiError({
      statusCode: 400,
      message:
        "The verification code is incorrect",
      code: "INVALID_OTP",
      errors: [
        {
          field: "otp",
          message:
            "Enter the correct verification code",
        },
      ],
    });
  }

  otpRecord.verifiedAt = new Date();
  otpRecord.verifiedIp = request.ip;

  await otpRecord.save();

  return otpRecord;
};

export const createPasswordResetToken =
  async (otpRecord) => {
    const resetToken =
      generateResetToken();

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    otpRecord.resetTokenHash =
      resetTokenHash;

    otpRecord.resetTokenExpiresAt =
      new Date(Date.now() + 15 * 60 * 1000);

    await otpRecord.save();

    return resetToken;
  };

export const consumePasswordResetToken =
  async ({
    email,
    resetToken,
  }) => {
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const otpRecord = await OtpCode.findOne({
      email: email.trim().toLowerCase(),
      resetTokenHash,
      verifiedAt: {
        $ne: null,
      },
      consumedAt: null,
      resetTokenExpiresAt: {
        $gt: new Date(),
      },
    }).select("+resetTokenHash");

    if (!otpRecord) {
      throw new ApiError({
        statusCode: 400,
        message:
          "The password reset session is invalid or expired",
        code: "INVALID_RESET_TOKEN",
      });
    }

    otpRecord.consumedAt = new Date();

    await otpRecord.save();

    return otpRecord;
  };