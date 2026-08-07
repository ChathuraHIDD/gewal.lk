/*
 * Preset appointment time slots a property owner can offer.
 * Keep in sync with the backend's
 * src/constants/appointment.constants.js.
 */
export const APPOINTMENT_SLOTS = [
  { value: "10:00", label: "10:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export const APPOINTMENT_SLOT_VALUES = APPOINTMENT_SLOTS.map((slot) => slot.value);

export const slotLabel = (value) =>
  APPOINTMENT_SLOTS.find((slot) => slot.value === value)?.label || value;
