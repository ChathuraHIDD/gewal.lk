import apiClient from "./apiClient.js";

export const getAdmins = async () => {
  const response = await apiClient.get("/admin/admins");

  return response.data;
};

export const createAdmin = async (adminData) => {
  const response = await apiClient.post("/admin/admins", adminData);

  return response.data;
};

export const deleteAdmin = async (adminId) => {
  const response = await apiClient.delete(`/admin/admins/${adminId}`);

  return response.data;
};
