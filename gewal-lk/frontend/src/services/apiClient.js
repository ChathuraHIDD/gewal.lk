import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5001/api/v1";

const apiClient = axios.create({
  baseURL,

  withCredentials: true,

  headers: {
    Accept: "application/json",
  },

  timeout: 15000,
});

const authEndpointPatterns = ["/auth/login", "/auth/register", "/auth/refresh"];

let refreshPromise = null;

/**
 * The access token cookie is short-lived (15 minutes). Rather than
 * surface a 401 to the user on every request that outlives it, use
 * the long-lived refresh token cookie to silently mint a new access
 * token and retry the request once. Concurrent 401s share a single
 * in-flight refresh call instead of each triggering their own.
 */
const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = authEndpointPatterns.some((pattern) =>
      originalRequest?.url?.includes(pattern)
    );

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return apiClient(originalRequest);
      } catch {
        // Refresh token is also invalid/expired; fall through to the normal error below.
      }
    }

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
