import apiClient from "./apiClient.js";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/v1"
).replace(/\/api\/v1\/?$/, "");

/**
 * Uploaded property media is stored as a relative path
 * (e.g. "/uploads/properties/x.jpg"); resolve it against
 * the API's origin so it renders outside the API itself.
 */
export const resolveMediaUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
};

export const createProperty = async (formData) => {
  const response = await apiClient.post(
    "/properties",
    formData
  );

  return response.data;
};

export const getMyProperties = async () => {
  const response = await apiClient.get(
    "/properties/mine"
  );

  return response.data;
};

export const getProperties = async (params) => {
  const response = await apiClient.get(
    "/properties",
    { params }
  );

  return response.data;
};

export const getPropertyBySlug = async (slug) => {
  const response = await apiClient.get(
    `/properties/${slug}`
  );

  return response.data;
};
