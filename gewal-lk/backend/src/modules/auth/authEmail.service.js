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
  const transporter =
    getEmailTransporter();

  const result = await transporter.sendMail({
    from: {
      name: environment.email.fromName,
      address:
        environment.email.fromAddress,
    },

    to,
    subject,
    text,
    html,
  });

  return result;
};

export const sendVerificationOtpEmail = async ({
  user,
  otp,
}) => {
  const template =
    emailVerificationTemplate({
      firstName: user.firstName,
      otp,
      expiryMinutes:
        environment.otp.expiresMinutes,
    });

  return sendEmail({
    to: user.email,
    ...template,
  });
};

export const sendPasswordResetOtpEmail = async ({
  user,
  otp,
}) => {
  const template =
    passwordResetTemplate({
      firstName: user.firstName,
      otp,
      expiryMinutes:
        environment.otp.expiresMinutes,
    });

  return sendEmail({
    to: user.email,
    ...template,
  });
};