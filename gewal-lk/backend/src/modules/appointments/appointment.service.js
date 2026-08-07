import {
  ACTIVE_APPOINTMENT_STATUSES,
  APPOINTMENT_SLOT_MODES,
} from "../../constants/appointment.constants.js";
import { Appointment, Property } from "../../models/propertyPlatform.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../users/user.model.js";
import { attachRelations } from "../property/property.service.js";

import {
  sendAppointmentConfirmationEmail,
  sendAppointmentRequestEmail,
} from "./appointment.email.service.js";

const attachAppointmentContext = async (appointments, { includeBuyer = false } = {}) => {
  const propertyIds = [...new Set(appointments.map((appointment) => appointment.propertyId.toString()))];
  const properties = await Property.find({ _id: { $in: propertyIds } });
  const enrichedProperties = await attachRelations(properties);
  const propertyById = new Map(enrichedProperties.map((property) => [property._id.toString(), property]));

  let buyerById = new Map();

  if (includeBuyer) {
    const buyerIds = [...new Set(appointments.map((appointment) => appointment.buyerId.toString()))];
    const buyers = await User.find({ _id: { $in: buyerIds } }).select("firstName lastName email phone");
    buyerById = new Map(buyers.map((buyer) => [buyer._id.toString(), buyer]));
  }

  return appointments.map((appointment) => {
    const plain = appointment.toObject();

    return {
      ...plain,
      property: propertyById.get(appointment.propertyId.toString()) || null,
      buyer: includeBuyer
        ? buyerById.get(appointment.buyerId.toString()) || null
        : undefined,
    };
  });
};

export const getBookedSlots = async ({ propertyId, date }) => {
  const appointments = await Appointment.find({
    propertyId,
    appointmentDate: date,
    status: { $in: ACTIVE_APPOINTMENT_STATUSES },
  }).select("appointmentTime");

  return appointments.map((appointment) => appointment.appointmentTime);
};

/**
 * Appointments the current user has requested, as a buyer.
 */
export const listAppointmentsForBuyer = async (buyerId) => {
  const appointments = await Appointment.find({ buyerId }).sort({ createdAt: -1 });

  return attachAppointmentContext(appointments);
};

/**
 * Appointments requested against properties the current user owns.
 */
export const listAppointmentsForOwner = async (ownerId) => {
  const ownedProperties = await Property.find({ ownerId }).select("_id");
  const propertyIds = ownedProperties.map((property) => property._id);

  const appointments = await Appointment.find({
    propertyId: { $in: propertyIds },
  }).sort({ createdAt: -1 });

  return attachAppointmentContext(appointments, { includeBuyer: true });
};

export const createAppointment = async ({ buyer, payload }) => {
  const property = await Property.findById(payload.propertyId);

  if (!property) {
    throw new ApiError({
      statusCode: 404,
      message: "Property not found",
      code: "PROPERTY_NOT_FOUND",
    });
  }

  if (
    property.appointmentSlotMode === APPOINTMENT_SLOT_MODES.FIXED &&
    !property.availableSlots.includes(payload.appointmentTime)
  ) {
    throw new ApiError({
      statusCode: 422,
      message: "The selected time is not offered for this property",
      code: "INVALID_SLOT",
    });
  }

  const conflict = await Appointment.findOne({
    propertyId: property._id,
    appointmentDate: payload.appointmentDate,
    appointmentTime: payload.appointmentTime,
    status: { $in: ACTIVE_APPOINTMENT_STATUSES },
  });

  if (conflict) {
    throw new ApiError({
      statusCode: 409,
      message: "This time slot has just been booked by someone else. Please choose another.",
      code: "SLOT_ALREADY_BOOKED",
    });
  }

  let appointment;

  try {
    appointment = await Appointment.create({
      propertyId: property._id,
      buyerId: buyer._id,
      agentId: property.agentId || null,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      message: payload.message,
    });
  } catch (error) {
    /*
     * The unique partial index is the final guard against a
     * concurrent double-booking that slipped past the check above.
     */
    if (error.code === 11000) {
      throw new ApiError({
        statusCode: 409,
        message: "This time slot has just been booked by someone else. Please choose another.",
        code: "SLOT_ALREADY_BOOKED",
      });
    }

    throw error;
  }

  try {
    await sendAppointmentRequestEmail({
      property,
      requester: buyer,
      appointmentDate: payload.appointmentDate.toLocaleDateString("en-LK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      appointmentTime: payload.appointmentTime,
      message: payload.message,
    });
  } catch (error) {
    /*
     * The appointment itself is the source of truth; a failed or
     * unconfigured email notification should not fail the request.
     */
    console.error("Failed to send appointment request email:", error.message);
  }

  return appointment;
};

const loadOwnedAppointment = async ({ appointmentId, ownerId }) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError({
      statusCode: 404,
      message: "Appointment not found",
      code: "APPOINTMENT_NOT_FOUND",
    });
  }

  const property = await Property.findById(appointment.propertyId);

  if (!property || property.ownerId.toString() !== ownerId.toString()) {
    throw new ApiError({
      statusCode: 403,
      message: "You do not have permission to update this appointment",
      code: "ACCESS_DENIED",
    });
  }

  return { appointment, property };
};

/**
 * Property owner accepts a pending appointment request. Notifies
 * the requesting buyer by email with the confirmed details.
 */
export const acceptAppointment = async ({ appointmentId, ownerId }) => {
  const { appointment, property } = await loadOwnedAppointment({ appointmentId, ownerId });

  appointment.status = "Accepted";
  appointment.confirmedAt = new Date();
  await appointment.save();

  try {
    const buyer = await User.findById(appointment.buyerId).select("firstName lastName email");

    if (buyer) {
      await sendAppointmentConfirmationEmail({ property, buyer, appointment });
    }
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error.message);
  }

  return appointment;
};

/**
 * Property owner rejects a pending appointment request.
 */
export const rejectAppointment = async ({ appointmentId, ownerId }) => {
  const { appointment } = await loadOwnedAppointment({ appointmentId, ownerId });

  appointment.status = "Rejected";
  await appointment.save();

  return appointment;
};

/**
 * The requesting buyer cancels their own appointment.
 */
export const cancelAppointment = async ({ appointmentId, buyerId }) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError({
      statusCode: 404,
      message: "Appointment not found",
      code: "APPOINTMENT_NOT_FOUND",
    });
  }

  if (appointment.buyerId.toString() !== buyerId.toString()) {
    throw new ApiError({
      statusCode: 403,
      message: "You do not have permission to cancel this appointment",
      code: "ACCESS_DENIED",
    });
  }

  appointment.status = "Cancelled";
  await appointment.save();

  return appointment;
};
