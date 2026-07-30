import { environment } from "../../config/environment.js";
import { getEmailTransporter } from "../../config/email.js";

import {
  emailVerificationTemplate,
  passwordResetTemplate,
} from "./authEmail.templates.js";

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  /*
   * Development mode:
   * Do not connect to SMTP.
   */
  if (!environment.email.enabled) {
    console.log(
      `[Development email skipped] Recipient: ${to} | Subject: ${subject}`
    );

    return {
      skipped: true,
    };
  }

  /*
   * Production or SMTP-enabled mode.
   */
  const transporter = getEmailTransporter();

  return transporter.sendMail({
    from: {
      name: environment.email.fromName,
      address: environment.email.fromAddress,
    },
    to,
    subject,
    text,
    html,
  });
};

export const sendVerificationOtpEmail = async ({
  user,
  otp,
}) => {
  if (
    environment.isDevelopment &&
    environment.email.showOtpInDevelopment
  ) {
    console.log("");
    console.log("========================================");
    console.log("Gewal.lk Email Verification OTP");
    console.log(`Email: ${user.email}`);
    console.log(`OTP: ${otp}`);
    console.log(
      `Expires in: ${environment.otp.expiresMinutes} minutes`
    );
    console.log("========================================");
    console.log("");
  }

  const template = emailVerificationTemplate({
    firstName: user.firstName,
    otp,
    expiryMinutes:
      environment.otp.expiresMinutes,
  });

  return sendEmail({
    to: user.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

export const sendPasswordResetOtpEmail = async ({
  user,
  otp,
}) => {
  if (
    environment.isDevelopment &&
    environment.email.showOtpInDevelopment
  ) {
    console.log("");
    console.log("========================================");
    console.log("Gewal.lk Password Reset OTP");
    console.log(`Email: ${user.email}`);
    console.log(`OTP: ${otp}`);
    console.log(
      `Expires in: ${environment.otp.expiresMinutes} minutes`
    );
    console.log("========================================");
    console.log("");
  }

  const template = passwordResetTemplate({
    firstName: user.firstName,
    otp,
    expiryMinutes:
      environment.otp.expiresMinutes,
  });

  return sendEmail({
    to: user.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};