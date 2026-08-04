import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  Heart,
  Languages,
  Menu,
  MessageCircle,
  Moon,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import fullLogo from "../../../assets/logos/gewal-full-logo.png";

import "./Header.css";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Buy", path: "/buy" },
  { label: "Rent", path: "/rent" },
  { label: "Commercial", path: "/commercial" },
  { label: "Agents", path: "/agents" },
  { label: "New Projects", path: "/new-projects" },
  { label: "Blog", path: "/blog" },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link
          to="/"
          className="header__logo"
          onClick={closeMobileMenu}
        >
          <img
            src={fullLogo}
            alt="Gewal.lk"
          />
        </Link>

        <nav className="header__nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "header__nav-link header__nav-link--active"
                  : "header__nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__search">
          <Search size={17} />
          <input placeholder="Search properties" aria-label="Search properties" />
        </div>

        <div className="header__actions">
          <Link to="/properties" className="header__icon-button" aria-label="Saved properties"><Heart size={19} /></Link>
          <Link to="/properties" className="header__icon-button" aria-label="Compare"><SlidersHorizontal size={19} /></Link>
          <Link to="/dashboard" className="header__icon-button" aria-label="Notifications"><Bell size={19} /></Link>
          <Link to="/dashboard" className="header__icon-button" aria-label="Messages"><MessageCircle size={19} /></Link>
          <button className="header__icon-button" aria-label="Language selector"><Languages size={19} /></button>
          <button className="header__icon-button" aria-label="Toggle dark mode"><Moon size={19} /></button>
          <Link to="/login" className="header__login">Login</Link>
          <Link to="/register" className="header__login">Register</Link>
          <Link
            to="/post-property"
            className="header__post-button"
          >
            <span>Post Property</span>
          </Link>
        </div>

        <button
          className="header__mobile-toggle"
          onClick={() =>
            setMobileMenuOpen(
              (currentValue) => !currentValue
            )
          }
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{
              opacity: 0,
              y: -18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -18,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <div className="container">
              <nav className="header__mobile-nav">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      isActive
                        ? "header__mobile-link header__mobile-link--active"
                        : "header__mobile-link"
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="header__mobile-actions">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="header__mobile-login"
                >
                  <UserRound size={19} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="header__post-button"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;