import { APPOINTMENT_SLOT_MODES, APPOINTMENT_SLOT_VALUES } from "../../constants/appointment.constants.js";
import { ApiError } from "../../utils/ApiError.js";

const propertyTypes = [
  "House",
  "Apartment",
  "Land",
  "Commercial",
  "Villa",
  "Office",
  "Shop",
  "Warehouse",
  "Annexe",
];

const listingTypes = ["Sale", "Rent", "Lease"];

const cleanString = (value) => (typeof value === "string" ? value.trim() : "");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const toBoolean = (value) => {
  return value === true || value === "true" || value === "1" || value === "on";
};

const parseStringArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(cleanString).filter(Boolean);
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.map(cleanString).filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

export const validateCreateProperty = (request, response, next) => {
  const title = cleanString(request.body.title);
  const description = cleanString(request.body.description);
  const propertyType = cleanString(request.body.propertyType);
  const listingType = cleanString(request.body.listingType);
  const price = toNumber(request.body.price);

  const country = cleanString(request.body.country) || "Sri Lanka";
  const province = cleanString(request.body.province);
  const district = cleanString(request.body.district);
  const city = cleanString(request.body.city);
  const street = cleanString(request.body.street);

  const contactName = cleanString(request.body.contactName);
  const contactPhone = cleanString(request.body.contactPhone);
  const contactEmail = cleanString(request.body.contactEmail).toLowerCase();

  const appointmentSlotMode =
    cleanString(request.body.appointmentSlotMode) || APPOINTMENT_SLOT_MODES.FIXED;

  const availableSlots = parseStringArray(request.body.availableSlots).filter((slot) =>
    APPOINTMENT_SLOT_VALUES.includes(slot)
  );

  const errors = [];

  if (title.length < 5 || title.length > 150) {
    errors.push({
      field: "title",
      message: "Title must be between 5 and 150 characters",
    });
  }

  if (description.length < 20) {
    errors.push({
      field: "description",
      message: "Description must contain at least 20 characters",
    });
  }

  if (!propertyTypes.includes(propertyType)) {
    errors.push({
      field: "propertyType",
      message: "Select a valid property type",
    });
  }

  if (!listingTypes.includes(listingType)) {
    errors.push({
      field: "listingType",
      message: "Select a valid listing type",
    });
  }

  if (price === null || price <= 0) {
    errors.push({
      field: "price",
      message: "Enter a valid price greater than zero",
    });
  }

  if (!district) {
    errors.push({
      field: "district",
      message: "District is required",
    });
  }

  if (!city) {
    errors.push({
      field: "city",
      message: "City / area is required",
    });
  }

  if (!contactName) {
    errors.push({
      field: "contactName",
      message: "Contact name is required",
    });
  }

  if (!contactPhone) {
    errors.push({
      field: "contactPhone",
      message: "Contact phone is required",
    });
  }

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    errors.push({
      field: "contactEmail",
      message: "Enter a valid contact email address",
    });
  }

  if (!Object.values(APPOINTMENT_SLOT_MODES).includes(appointmentSlotMode)) {
    errors.push({
      field: "appointmentSlotMode",
      message: "Select a valid appointment scheduling mode",
    });
  }

  if (appointmentSlotMode === APPOINTMENT_SLOT_MODES.FIXED && availableSlots.length === 0) {
    errors.push({
      field: "availableSlots",
      message: "Select at least one appointment time slot, or enable custom scheduling",
    });
  }

  const files = request.files || [];

  if (files.length > 10) {
    errors.push({
      field: "images",
      message: "You can upload a maximum of 10 images",
    });
  }

  if (errors.length > 0) {
    return next(
      new ApiError({
        statusCode: 422,
        message: "Property validation failed",
        code: "VALIDATION_ERROR",
        errors,
      })
    );
  }

  request.propertyPayload = {
    title,
    description,
    propertyType,
    listingType,
    price,
    negotiable: toBoolean(request.body.negotiable),
    bedrooms: toNumber(request.body.bedrooms) || 0,
    bathrooms: toNumber(request.body.bathrooms) || 0,
    buildingSize: toNumber(request.body.buildingSize),
    landSize: toNumber(request.body.landSize),
    ownershipType: cleanString(request.body.ownershipType) || null,
    availableFrom: cleanString(request.body.availableFrom) || null,

    location: {
      country,
      province: province || null,
      district,
      city,
      street: street || null,
    },

    contactName,
    contactPhone,
    contactEmail: contactEmail || null,

    seoTitle: cleanString(request.body.seoTitle) || null,
    seoDescription: cleanString(request.body.seoDescription) || null,

    videoUrl: cleanString(request.body.videoUrl) || null,

    amenities: parseStringArray(request.body.amenities),

    appointmentSlotMode,
    availableSlots:
      appointmentSlotMode === APPOINTMENT_SLOT_MODES.FIXED ? availableSlots : [],
  };

  return next();
};
