import apiClient from "./apiClient.js";

export const getFavorites = async () => {
  const response = await apiClient.get("/favorites");

  return response.data;
};

export const getFavoriteIds = async () => {
  const response = await apiClient.get("/favorites/ids");

  return response.data;
};

export const addFavorite = async (propertyId) => {
  const response = await apiClient.post(`/favorites/${propertyId}`);

  return response.data;
};

export const removeFavorite = async (propertyId) => {
  const response = await apiClient.delete(`/favorites/${propertyId}`);

  return response.data;
};
