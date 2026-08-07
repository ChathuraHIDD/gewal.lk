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

export const getAdminProperties = async (approvalStatus) => {
  const response = await apiClient.get("/admin/properties", {
    params: approvalStatus ? { approvalStatus } : undefined,
  });

  return response.data;
};

export const approveAdminProperty = async (propertyId) => {
  const response = await apiClient.patch(`/admin/properties/${propertyId}/approve`);

  return response.data;
};

export const rejectAdminProperty = async (propertyId) => {
  const response = await apiClient.patch(`/admin/properties/${propertyId}/reject`);

  return response.data;
};
