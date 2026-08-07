import { environment } from "../config/environment.js";
import { getEmailTransporter } from "../config/email.js";

/**
 * Central email dispatcher shared by every module that needs to
 * notify someone (OTPs, appointment requests, etc).
 *
 * In development with EMAIL_ENABLED=false, sends are skipped and
 * logged instead so the app works fully offline until real SMTP
 * credentials are configured in .env.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!environment.email.enabled) {
    console.log(
      `[Development email skipped] Recipient: ${to} | Subject: ${subject}`
    );

    return {
      skipped: true,
    };
  }

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
