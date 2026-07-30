import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5001/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalisedError = {
      statusCode:
        error.response?.data?.statusCode ||
        error.response?.status ||
        500,

      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",

      code:
        error.response?.data?.code ||
        "REQUEST_FAILED",

      errors:
        error.response?.data?.errors || [],
    };

    return Promise.reject(normalisedError);
  }
);

export default apiClient;