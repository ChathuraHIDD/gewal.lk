import nodemailer from "nodemailer";

import { environment } from "./environment.js";

let transporter = null;

export const getEmailTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (
    !environment.email.smtpHost ||
    !environment.email.smtpUser ||
    !environment.email.smtpPass
  ) {
    throw new Error(
      "SMTP configuration is incomplete"
    );
  }

  transporter = nodemailer.createTransport({
    host: environment.email.smtpHost,
    port: environment.email.smtpPort,
    secure: environment.email.smtpSecure,

    auth: {
      user: environment.email.smtpUser,
      pass: environment.email.smtpPass,
    },

    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  return transporter;
};

export const verifyEmailConnection = async () => {
  if (
    !environment.email.smtpHost ||
    !environment.email.smtpUser ||
    !environment.email.smtpPass
  ) {
    console.warn(
      "Email service skipped: SMTP credentials are missing"
    );

    return false;
  }

  try {
    const emailTransporter =
      getEmailTransporter();

    await emailTransporter.verify();

    console.log(
      "Email SMTP connection verified successfully"
    );

    return true;
  } catch (error) {
    console.error(
      "Email SMTP verification failed:",
      error.message
    );

    return false;
  }
};