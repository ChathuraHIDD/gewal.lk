import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import {
  acceptAppointment,
  cancelAppointment,
  createAppointment as createAppointmentService,
  getBookedSlots,
  listAppointmentsForBuyer,
  listAppointmentsForOwner,
  rejectAppointment,
} from "./appointment.service.js";

export const createAppointment = asyncHandler(async (request, response) => {
  const appointment = await createAppointmentService({
    buyer: request.user,
    payload: request.appointmentPayload,
  });

  return response.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Appointment request sent successfully",
      data: { appointment },
    })
  );
});

export const getAvailability = asyncHandler(async (request, response) => {
  const bookedSlots = await getBookedSlots(request.availabilityQuery);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Availability retrieved successfully",
      data: { bookedSlots },
    })
  );
});

export const listMyAppointments = asyncHandler(async (request, response) => {
  const appointments = await listAppointmentsForBuyer(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Your appointments retrieved successfully",
      data: { appointments },
    })
  );
});

export const listReceivedAppointments = asyncHandler(async (request, response) => {
  const appointments = await listAppointmentsForOwner(request.user._id);

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Received appointments retrieved successfully",
      data: { appointments },
    })
  );
});

export const acceptAppointmentRequest = asyncHandler(async (request, response) => {
  const appointment = await acceptAppointment({
    appointmentId: request.params.id,
    ownerId: request.user._id,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Appointment accepted and the requester has been notified",
      data: { appointment },
    })
  );
});

export const rejectAppointmentRequest = asyncHandler(async (request, response) => {
  const appointment = await rejectAppointment({
    appointmentId: request.params.id,
    ownerId: request.user._id,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Appointment rejected",
      data: { appointment },
    })
  );
});

export const cancelMyAppointment = asyncHandler(async (request, response) => {
  const appointment = await cancelAppointment({
    appointmentId: request.params.id,
    buyerId: request.user._id,
  });

  return response.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Appointment cancelled",
      data: { appointment },
    })
  );
});
