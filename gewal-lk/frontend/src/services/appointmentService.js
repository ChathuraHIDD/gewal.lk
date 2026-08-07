import apiClient from "./apiClient.js";

export const createAppointment = async (payload) => {
  const response = await apiClient.post("/appointments", payload);

  return response.data;
};

export const getAppointmentAvailability = async (propertyId, date) => {
  const response = await apiClient.get("/appointments/availability", {
    params: { propertyId, date },
  });

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await apiClient.get("/appointments/mine");

  return response.data;
};

export const getReceivedAppointments = async () => {
  const response = await apiClient.get("/appointments/received");

  return response.data;
};

export const acceptAppointment = async (appointmentId) => {
  const response = await apiClient.patch(`/appointments/${appointmentId}/accept`);

  return response.data;
};

export const rejectAppointment = async (appointmentId) => {
  const response = await apiClient.patch(`/appointments/${appointmentId}/reject`);

  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await apiClient.patch(`/appointments/${appointmentId}/cancel`);

  return response.data;
};
