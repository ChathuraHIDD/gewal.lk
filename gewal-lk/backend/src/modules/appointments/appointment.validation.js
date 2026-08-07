import mongoose from "mongoose";

import { ApiError } from "../../utils/ApiError.js";

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const validateCreateAppointment = (request, response, next) => {
  const propertyId = cleanString(request.body.propertyId);
  const appointmentDate = cleanString(request.body.appointmentDate);
  const appointmentTime = cleanString(request.body.appointmentTime);
  const message = cleanString(request.body.message);

  const errors = [];

  if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
    errors.push({
      field: "propertyId",
      message: "A valid property is required",
    });
  }

  const parsedDate = appointmentDate ? new Date(appointmentDate) : null;

  if (!appointmentDate || !parsedDate || Number.isNaN(parsedDate.getTime())) {
    errors.push({
      field: "appointmentDate",
      message: "Select a valid appointment date",
    });
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      errors.push({
        field: "appointmentDate",
        message: "Appointment date cannot be in the past",
      });
    }
  }

  if (!timePattern.test(appointmentTime)) {
    errors.push({
      field: "appointmentTime",
      message: "Select a valid appointment time",
    });
  }

  if (message.length > 500) {
    errors.push({
      field: "message",
      message: "Note must be 500 characters or fewer",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message: "Appointment validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.appointmentPayload = {
    propertyId,
    appointmentDate: parsedDate,
    appointmentTime,
    message: message || "",
  };

  return next();
};

export const validateAvailabilityQuery = (request, response, next) => {
  const propertyId = cleanString(request.query.propertyId);
  const date = cleanString(request.query.date);

  const errors = [];

  if (!propertyId || !mongoose.isValidObjectId(propertyId)) {
    errors.push({
      field: "propertyId",
      message: "A valid property is required",
    });
  }

  const parsedDate = date ? new Date(date) : null;

  if (!date || !parsedDate || Number.isNaN(parsedDate.getTime())) {
    errors.push({
      field: "date",
      message: "A valid date is required",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message: "Availability query validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.availabilityQuery = { propertyId, date: parsedDate };

  return next();
};
