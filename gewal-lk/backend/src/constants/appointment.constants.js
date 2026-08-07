/*
 * Preset appointment time slots a property owner can offer.
 * Values are 24-hour "HH:mm" strings; keep in sync with the
 * frontend's src/utils/appointmentSlots.js.
 */
export const APPOINTMENT_SLOTS = [
  { value: "10:00", label: "10:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export const APPOINTMENT_SLOT_VALUES = APPOINTMENT_SLOTS.map((slot) => slot.value);

export const APPOINTMENT_SLOT_MODES = Object.freeze({
  FIXED: "Fixed",
  CUSTOMIZABLE: "Customizable",
});

export const ACTIVE_APPOINTMENT_STATUSES = ["Pending", "Accepted", "Completed"];
