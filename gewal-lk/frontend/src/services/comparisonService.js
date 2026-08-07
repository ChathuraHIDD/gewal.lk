import apiClient from "./apiClient.js";

export const MAX_COMPARISON_ITEMS = 4;

export const getComparison = async () => {
  const response = await apiClient.get("/comparison");

  return response.data;
};

export const addToComparison = async (propertyId) => {
  const response = await apiClient.post(`/comparison/${propertyId}`);

  return response.data;
};

export const removeFromComparison = async (propertyId) => {
  const response = await apiClient.delete(`/comparison/${propertyId}`);

  return response.data;
};

export const clearComparison = async () => {
  const response = await apiClient.delete("/comparison");

  return response.data;
};
