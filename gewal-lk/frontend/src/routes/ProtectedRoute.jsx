import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children, roles, redirectTo = "/dashboard" }) {
  const location = useLocation();

  const {
    user,
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

  if (
    roles &&
    !roles.some((role) => user?.roles?.includes(role))
  ) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;