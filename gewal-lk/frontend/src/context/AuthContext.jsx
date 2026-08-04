import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailOtp,
  verifyEmailOtp,
} from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const loadCurrentUser = useCallback(
    async () => {
      try {
        const result =
          await getCurrentUser();

        const currentUser = result.data.user;

        setUser(currentUser);
        setIsAuthenticated(Boolean(currentUser));
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const register = async (formData) => {
    return registerUser(formData);
  };

  const verifyEmail = async ({
    email,
    otp,
  }) => {
    const result =
      await verifyEmailOtp({
        email,
        otp,
      });

    setUser(result.data.user);
    setIsAuthenticated(true);

    return result;
  };

  const resendOtp = async (email) => {
    return resendEmailOtp(email);
  };

  const login = async ({
    email,
    password,
  }) => {
    const result = await loginUser({
      email,
      password,
    });

    setUser(result.data.user);
    setIsAuthenticated(true);

    return result;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      register,
      verifyEmail,
      resendOtp,
      login,
      logout,
      refreshUser: loadCurrentUser,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      loadCurrentUser,
    ]
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}