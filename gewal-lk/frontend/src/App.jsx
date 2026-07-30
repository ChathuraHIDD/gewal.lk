import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/layout/Header/Header.jsx";
import HomePage from "./pages/public/HomePage/HomePage.jsx";

import LoginPage from "./pages/auth/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage/RegisterPage.jsx";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage/VerifyEmailPage.jsx";

const authenticationPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function App() {
  const location = useLocation();

  const isAuthenticationPage =
    authenticationPaths.includes(
      location.pathname
    );

  return (
    <div className="app">
      {!isAuthenticationPage && (
        <Header />
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmailPage />}
        />
      </Routes>
    </div>
  );
}

export default App;