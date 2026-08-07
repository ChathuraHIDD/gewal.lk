import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";

import {
  acceptAppointmentRequest,
  cancelMyAppointment,
  createAppointment,
  getAvailability,
  listMyAppointments,
  listReceivedAppointments,
  rejectAppointmentRequest,
} from "./appointment.controller.js";
import { validateAvailabilityQuery, validateCreateAppointment } from "./appointment.validation.js";

const router = Router();

/*
 * Already-booked time slots for a property on a given date.
 * Public so a guest can see availability before signing in.
 */
router.get("/availability", validateAvailabilityQuery, getAvailability);

/*
 * Appointments the current user has requested (as a buyer).
 */
router.get("/mine", authenticate, listMyAppointments);

/*
 * Appointments requested against properties the current user owns.
 */
router.get("/received", authenticate, listReceivedAppointments);

/*
 * Request a viewing appointment for a property. Requires
 * authentication so we know who is asking and can notify the
 * property's contact email with the requester's details.
 */
router.post("/", authenticate, validateCreateAppointment, createAppointment);

/*
 * Property owner accepts/rejects a request for their listing.
 */
router.patch("/:id/accept", authenticate, acceptAppointmentRequest);
router.patch("/:id/reject", authenticate, rejectAppointmentRequest);

/*
 * The requesting buyer cancels their own appointment.
 */
router.patch("/:id/cancel", authenticate, cancelMyAppointment);

export default router;
