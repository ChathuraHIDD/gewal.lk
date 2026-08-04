import { useEffect, useState } from "react";
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
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserDashboardPage from "./pages/dashboard/UserDashboardPage/UserDashboardPage.jsx";
import AgentProfilePage from "./pages/agents/AgentProfilePage/AgentProfilePage.jsx";
import AdminPanelPage from "./pages/admin/AdminPanelPage/AdminPanelPage.jsx";
import BlogPage from "./pages/blog/BlogPage/BlogPage.jsx";
import ContactPage from "./pages/public/ContactPage/ContactPage.jsx";
import AboutPage from "./pages/public/AboutPage/AboutPage.jsx";
import NewProjectsPage from "./pages/projects/NewProjectsPage/NewProjectsPage.jsx";
import CommercialPage from "./pages/commercial/CommercialPage/CommercialPage.jsx";
import MessagesPage from "./pages/messages/MessagesPage/MessagesPage.jsx";
import AppointmentsPage from "./pages/appointments/AppointmentsPage/AppointmentsPage.jsx";
import NotificationsPage from "./pages/notifications/NotificationsPage/NotificationsPage.jsx";

import LoginPage from "./pages/auth/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage/RegisterPage.jsx";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage/VerifyEmailPage.jsx";
import { CaretUp } from "@phosphor-icons/react";

const authenticationPaths = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function GlobalBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={visible ? "global-back-to-top is-visible" : "global-back-to-top"}
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <CaretUp size={22} weight="bold" />
    </button>
  );
}

function App() {
  const location = useLocation();

  const isAuthenticationPage =
    authenticationPaths.includes(
      location.pathname
    );

  return (
    <div className="app">
      <ScrollToTop />
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
        <Route path="/commercial" element={<CommercialPage />} />
        <Route path="/agents" element={<AgentProfilePage />} />
        <Route path="/agents/:id" element={<AgentProfilePage />} />
        <Route path="/new-projects" element={<NewProjectsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "super_admin"]} redirectTo="/">
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-property"
          element={
            <ProtectedRoute roles={["seller", "agent"]} redirectTo="/dashboard">
              <PostPropertyPage />
            </ProtectedRoute>
          }
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

      {!isAuthenticationPage && <GlobalBackToTop />}
    </div>
  );
}

export default App;