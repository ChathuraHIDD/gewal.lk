import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  Globe2,
  Heart,
  HelpCircle,
  Home,
  LogIn,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { UserCircle } from "@phosphor-icons/react";

import fullLogo from "../../../assets/logos/gewal-full-logo.png";
import { useAuth } from "../../../hooks/useAuth.js";
import "./Header.css";

const canPostProperty = (user) =>
  Boolean(user?.roles?.some((role) => role === "seller" || role === "agent"));

const isAdminUser = (user) =>
  Boolean(user?.roles?.some((role) => role === "admin" || role === "super_admin"));

const roleLabel = (user) => {
  if (!user) return "";
  if (isAdminUser(user)) return "Admin account";
  if (user.roles?.includes("agent")) return "Agent account";
  if (user.roles?.includes("seller")) return "Seller account";
  return "Buyer account";
};

const navItems = [
  { label: "Buy", path: "/buy", menu: "buy" },
  { label: "Rent", path: "/rent", menu: "rent" },
  { label: "Commercial", path: "/commercial", menu: "commercial" },
  { label: "New Projects", path: "/new-projects" },
  { label: "Agents", path: "/agents" },
  { label: "Services", path: "/services", menu: "services" },
  { label: "Blog", path: "/blog" },
];

const megaMenus = {
  buy: {
    title: "Buy Properties",
    columns: [
      ["Residential", "House", "Apartment", "Villa", "Townhouse", "Penthouse", "Annexe"],
      ["Land", "Residential Land", "Commercial Land", "Agricultural Land"],
      ["Popular", "Featured Listings", "New Projects", "Price Reduced", "Auction Properties"],
    ],
  },
  rent: {
    title: "Rent Properties",
    columns: [
      ["Residential Rentals", "Apartments", "Houses", "Luxury Rentals", "Short-Term Rentals"],
      ["Commercial Rentals", "Office Spaces", "Shops", "Warehouse Rentals"],
      ["Special", "Student Accommodation", "Furnished", "Pet Friendly"],
    ],
  },
  commercial: {
    title: "Commercial Real Estate",
    columns: [
      ["Property Type", "Office", "Shop", "Warehouse", "Factory", "Hotel"],
      ["For Business", "Co-working Spaces", "Retail Space", "Investment Property"],
      ["Locations", "Colombo", "Gampaha", "Kandy", "Galle"],
    ],
  },
  services: {
    title: "Property Services",
    columns: [
      ["Finance", "Mortgage Calculator", "Property Valuation", "Home Loan", "Insurance"],
      ["Professional", "Legal Services", "Architects", "Interior Designers"],
      ["Home", "Moving Services", "Property Management", "Home Inspection"],
    ],
  },
};

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <header className="market-header">
      <div className="market-header__top">
        <div className="container market-header__top-inner">
          <div className="market-header__top-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/blog">Guides</Link>
            <Link to="/agents">Find Agents</Link>
          </div>
          <div className="market-header__top-actions">
            <button type="button"><Globe2 size={14} /> English</button>
            <button type="button"><Moon size={14} /> Theme</button>
            {isAuthenticated ? (
              <button type="button" onClick={logout}><LogIn size={14} /> Logout</button>
            ) : (
              <>
                <Link to="/login"><LogIn size={14} /> Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="market-header__main">
        <div className="container market-header__main-inner">
          <Link to="/" className="market-header__logo" aria-label="Gewal.lk home">
            <img src={fullLogo} alt="Gewal.lk" />
          </Link>

          <nav className="market-header__nav" aria-label="Main navigation">
            <NavLink to="/">Home</NavLink>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="market-header__nav-item"
                onMouseEnter={() => item.menu && setActiveMenu(item.menu)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <NavLink to={item.path}>
                  {item.label}
                  {item.menu && <ChevronDown size={14} />}
                </NavLink>
                <AnimatePresence>
                  {activeMenu === item.menu && <MegaMenu menu={megaMenus[item.menu]} />}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="market-header__user-actions">
            <div
              className="market-header__notification-wrap"
              onMouseEnter={() => {
                setNotificationOpen(true);
                setProfileOpen(false);
              }}
              onMouseLeave={() => setNotificationOpen(false)}
            >
              <button
                type="button"
                className="market-header__badge"
                aria-label="Show unread notifications"
                aria-expanded={notificationOpen}
                onClick={() => {
                  setNotificationOpen((open) => !open);
                  setProfileOpen(false);
                }}
              >
                <Bell size={19} /><i>3</i>
              </button>
              <AnimatePresence>
                {notificationOpen && <NotificationMenu />}
              </AnimatePresence>
            </div>
            {canPostProperty(user) && (
              <Link to="/post-property" className="market-header__post"><Plus size={18} /> Post Property</Link>
            )}
            <div
              className="market-header__profile-wrap"
              onMouseEnter={() => {
                setProfileOpen(true);
                setNotificationOpen(false);
              }}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                className="market-header__avatar"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationOpen(false);
                }}
              >
                <UserCircle size={23} weight="regular" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <ProfileMenu
                    user={user}
                    isAuthenticated={isAuthenticated}
                    logout={logout}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="market-header__mobile-buttons">
            <button aria-label="Search"><Search size={21} /></button>
            <Link to="/notifications" aria-label="Notifications"><Bell size={21} /></Link>
            <button aria-label="Menu" onClick={() => setMobileOpen((open) => !open)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && <MobileDrawer close={() => setMobileOpen(false)} />}
      </AnimatePresence>

      <nav className="market-bottom-nav" aria-label="Mobile bottom navigation">
        <Link to="/"><Home size={19} />Home</Link>
        <Link to="/properties"><Search size={19} />Search</Link>
        <Link to="/properties"><Heart size={19} />Saved</Link>
        <Link to="/dashboard"><MessageCircle size={19} />Messages</Link>
        <Link to="/dashboard"><UserRound size={19} />Profile</Link>
      </nav>
    </header>
  );
}

function MegaMenu({ menu }) {
  return (
    <motion.div
      className="market-header__mega"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.18 }}
    >
      <div className="market-header__mega-title">
        <Building2 size={20} />
        <div>
          <strong>{menu.title}</strong>
          <span>Browse curated property categories</span>
        </div>
      </div>
      <div className="market-header__mega-grid">
        {menu.columns.map(([title, ...items]) => (
          <div key={title}>
            <h4>{title}</h4>
            {items.map((item) => <Link to="/properties" key={item}>{item}</Link>)}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NotificationMenu() {
  const unreadNotifications = [
    ["Property approved", "Your villa listing is now published."],
    ["Appointment accepted", "Danial Doe accepted your viewing request."],
    ["New message", "You have a new message from Nimali Perera."],
  ];

  return (
    <motion.div
      className="market-header__notification-menu"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.16 }}
    >
      <div className="market-header__notification-head">
        <strong>Unread Notifications</strong>
        <Link to="/notifications" onClick={() => window.scrollTo(0, 0)}>View all</Link>
      </div>
      {unreadNotifications.map(([title, message]) => (
        <Link to="/notifications" key={title} onClick={() => window.scrollTo(0, 0)}>
          <Bell size={17} />
          <span><strong>{title}</strong><small>{message}</small></span>
        </Link>
      ))}
    </motion.div>
  );
}

function ProfileMenu({ user, isAuthenticated, logout }) {
  return (
    <motion.div
      className="market-header__profile-menu"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.16 }}
    >
      <div className="market-header__profile-head">
        <span><UserCircle size={22} weight="regular" /></span>
        <div>
          <strong>{isAuthenticated ? `${user?.firstName} ${user?.lastName}` : "Guest User"}</strong>
          <small>{isAuthenticated ? roleLabel(user) : "Sign in to manage your account"}</small>
        </div>
      </div>
      <Link to="/properties"><Heart size={17} /> Saved Properties</Link>
      <Link to="/properties"><SlidersHorizontal size={17} /> Compare Properties</Link>
      <Link to="/messages"><MessageCircle size={17} /> Messages <em>3</em></Link>
      <Link to="/appointments"><CalendarDays size={17} /> Appointments</Link>
      <Link to="/dashboard"><UserRound size={17} /> Dashboard</Link>
      {canPostProperty(user) && <Link to="/post-property"><Plus size={17} /> Post Property</Link>}
      {isAdminUser(user) && <Link to="/admin"><UserCircle size={17} /> Admin Panel</Link>}
      <Link to="/contact"><HelpCircle size={17} /> Help Center</Link>
      {isAuthenticated ? (
        <button type="button" onClick={logout}><LogIn size={17} /> Logout</button>
      ) : (
        <Link to="/login"><LogIn size={17} /> Login</Link>
      )}
    </motion.div>
  );
}

function MobileDrawer({ close }) {
  const items = ["Home", "Buy", "Rent", "Commercial", "New Projects", "Agents", "Services", "Blog", "Contact", "Saved", "Compare", "Appointments", "Dashboard", "Settings"];

  return (
    <motion.div
      className="market-header__drawer"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="container">
        <div className="market-header__drawer-search"><Search size={18} /><input placeholder="Search properties" /></div>
        {items.map((item) => <Link key={item} to={item === "Home" ? "/" : "/properties"} onClick={close}>{item}</Link>)}
        <Link to="/post-property" onClick={close} className="market-header__drawer-post"><Plus size={18} /> Post Property</Link>
      </div>
    </motion.div>
  );
}

export default Header;
