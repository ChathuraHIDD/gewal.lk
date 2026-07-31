import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div className="text-muted">
          Loading...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;