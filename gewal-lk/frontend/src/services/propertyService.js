import apiClient from "./apiClient.js";

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
