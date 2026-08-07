import { environment } from "../../config/environment.js";
import { sendEmail } from "../../utils/mailer.js";

import {
  appointmentConfirmedTemplate,
  appointmentRequestTemplate,
} from "./appointment.email.templates.js";

/**
 * Notify the property's listed contact email about a new
 * appointment request. Silently skipped (with a console log) when
 * the property has no contact email, or when SMTP is not yet
 * configured (EMAIL_ENABLED=false) — the appointment itself is
 * still created either way.
 */
export const sendAppointmentRequestEmail = async ({
  property,
  requester,
  appointmentDate,
  appointmentTime,
  message,
}) => {
  if (!property.contactEmail) {
    console.log(
      `[Appointment email skipped] Property "${property.title}" has no contact email on file.`
    );

    return { skipped: true };
  }

  const template = appointmentRequestTemplate({
    propertyTitle: property.title,
    propertySlug: property.slug,
    siteUrl: environment.frontendUrl,
    appointmentDate,
    appointmentTime,
    requesterName: `${requester.firstName} ${requester.lastName}`.trim(),
    requesterPhone: requester.phone,
    requesterEmail: requester.email,
    message,
  });

  return sendEmail({
    to: property.contactEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Notify the requesting buyer once the property owner accepts
 * their appointment request. Same dev-mode skip behaviour as
 * sendAppointmentRequestEmail — logs instead of sending until
 * EMAIL_ENABLED=true is configured with real SMTP credentials.
 */
export const sendAppointmentConfirmationEmail = async ({
  property,
  buyer,
  appointment,
}) => {
  if (!buyer.email) {
    console.log(
      `[Appointment confirmation email skipped] Buyer for appointment ${appointment._id} has no email on file.`
    );

    return { skipped: true };
  }

  const template = appointmentConfirmedTemplate({
    propertyTitle: property.title,
    propertySlug: property.slug,
    siteUrl: environment.frontendUrl,
    appointmentDate: appointment.appointmentDate.toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    appointmentTime: appointment.appointmentTime,
    contactName: property.contactName,
    contactPhone: property.contactPhone,
    buyerFirstName: buyer.firstName,
  });

  return sendEmail({
    to: buyer.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};
