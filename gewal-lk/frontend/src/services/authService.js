import apiClient from "./apiClient.js";

export const registerUser = async (userData) => {
  const response = await apiClient.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const verifyEmailOtp = async ({
  email,
  otp,
}) => {
  const response = await apiClient.post(
    "/auth/verify-email",
    {
      email,
      otp,
    }
  );

  return response.data;
};

export const resendEmailOtp = async (email) => {
  const response = await apiClient.post(
    "/auth/resend-email-otp",
    {
      email,
    }
  );

  return response.data;
};

export const loginUser = async ({
  email,
  password,
}) => {
  const response = await apiClient.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get(
    "/auth/me"
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(
    "/auth/logout"
  );

  return response.data;
};