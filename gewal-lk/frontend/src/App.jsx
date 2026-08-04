import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/layout/Header/Header.jsx";
import HomePage from "./pages/public/HomePage/HomePage.jsx";
import PropertiesPage from "./pages/public/PropertiesPage/PropertiesPage.jsx";
import PropertyListPage from "./pages/public/PropertyListPage/PropertyListPage.jsx";
import StaticPage from "./pages/public/StaticPage/StaticPage.jsx";
import PostPropertyPage from "./pages/property/PostPropertyPage/PostPropertyPage.jsx";

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
          path="/properties"
          element={<PropertyListPage />}
        />

        <Route
          path="/properties/:slug"
          element={<PropertiesPage />}
        />

        <Route path="/buy" element={<PropertyListPage />} />
        <Route path="/rent" element={<PropertyListPage />} />
        <Route path="/commercial" element={<StaticPage page="commercial" />} />
        <Route path="/agents" element={<StaticPage page="agents" />} />
        <Route path="/new-projects" element={<StaticPage page="new-projects" />} />
        <Route path="/blog" element={<StaticPage page="blog" />} />
        <Route path="/about" element={<StaticPage page="about" />} />
        <Route path="/contact" element={<StaticPage page="contact" />} />
        <Route path="/dashboard" element={<StaticPage page="dashboard" />} />
        <Route path="/admin" element={<StaticPage page="admin" />} />
        <Route path="/post-property" element={<PostPropertyPage />} />

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