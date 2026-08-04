import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock,
  Heart,
  HelpCircle,
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import fullLogo from "../../../assets/logos/gewal-full-logo.png";

import "./Header.css";

const mainLinks = [
  { label: "Home", path: "/" },
  { label: "New Projects", path: "/new-projects" },
  { label: "Agents", path: "/agents" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const megaMenus = {
  Buy: [
    ["Residential", "House", "Apartment", "Villa", "Townhouse", "Penthouse", "Duplex", "Annexe"],
    ["Land", "Residential Land", "Commercial Land", "Agricultural Land"],
    ["Commercial", "Office", "Shop", "Warehouse", "Factory", "Hotel"],
    ["Luxury", "Beachfront", "Waterfront", "Luxury Villas", "Gated Communities"],
    ["Special", "Featured Listings", "New Projects", "Price Reduced", "Auction Properties"],
  ],
  Rent: [
    ["Rentals", "Residential Rentals", "Commercial Rentals", "Short-Term Rentals", "Luxury Rentals", "Student Accommodation", "Office Spaces", "Warehouse Rentals"],
  ],
  Commercial: [
    ["Commercial", "Office", "Shop", "Warehouse", "Factory", "Hotel", "Co-working Spaces", "Investment Properties"],
  ],
  Services: [
    ["Property Services", "Mortgage Calculator", "Property Valuation", "Home Loan", "Legal Services", "Insurance", "Moving Services", "Interior Designers", "Architects", "Property Management"],
  ],
};

const suggestions = [
  "Luxury villa in Colombo 07",
  "Rajagiriya apartments",
  "Nawala houses for sale",
  "Galle beachfront villas",
  "Kandy land",
  "Commercial office Colombo Fort",
];

const profileItems = [
  [LayoutDashboard, "Dashboard", "/dashboard"],
  [Building2, "My Properties", "/dashboard"],
  [Plus, "Post New Property", "/post-property"],
  [Clock, "Draft Listings", "/dashboard"],
  [Heart, "Saved Properties", "/properties"],
  [Search, "Recently Viewed", "/dashboard"],
  [SlidersHorizontal, "Compare Properties", "/properties"],
  [CalendarDays, "Appointments", "/dashboard"],
  [MessageCircle, "Messages", "/dashboard"],
  [Bell, "Notifications", "/dashboard"],
  [WalletCards, "Billing & Subscription", "/dashboard"],
  [Sparkles, "Analytics", "/dashboard"],
  [Settings, "Profile Settings", "/dashboard"],
  [HelpCircle, "Help Center", "/contact"],
];

function BadgeIcon({ icon: Icon, label, badge, to = "/dashboard" }) {
  return (
    <Link to={to} className="premium-nav__icon" aria-label={label}>
      <Icon size={18} />
      {badge && <span>{badge}</span>}
    </Link>
  );
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredSuggestions = useMemo(
    () => suggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
    [query]
  );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={scrolled ? "premium-nav premium-nav--scrolled" : "premium-nav"}>
      <div className="container premium-nav__inner">
        <Link to="/" className="premium-nav__logo" onClick={closeMobileMenu}>
          <img src={fullLogo} alt="Gewal.lk" />
        </Link>

        <nav className="premium-nav__links" aria-label="Primary navigation">
          {mainLinks.slice(0, 1).map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}

          {Object.keys(megaMenus).slice(0, 3).map((label) => (
            <div
              className="premium-nav__mega-wrap"
              key={label}
              onMouseEnter={() => setActiveMega(label)}
              onMouseLeave={() => setActiveMega(null)}
            >
              <button type="button" aria-expanded={activeMega === label}>
                {label} <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {activeMega === label && <MegaMenu label={label} />}
              </AnimatePresence>
            </div>
          ))}

          {mainLinks.slice(1, 3).map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}

          <div
            className="premium-nav__mega-wrap"
            onMouseEnter={() => setActiveMega("Services")}
            onMouseLeave={() => setActiveMega(null)}
          >
            <button type="button" aria-expanded={activeMega === "Services"}>
              Services <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {activeMega === "Services" && <MegaMenu label="Services" />}
            </AnimatePresence>
          </div>

          {mainLinks.slice(3).map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="premium-nav__search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 140)}
            placeholder="Title, city, district, area, landmark or postal code"
            aria-label="Global property search"
          />
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                className="premium-nav__suggestions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <strong>Search suggestions</strong>
                {(query ? filteredSuggestions : suggestions.slice(0, 4)).map((item) => (
                  <Link to="/properties" key={item}><Search size={14} /> {item}</Link>
                ))}
                <div>
                  <span>Trending</span>
                  {['Colombo', 'Rajagiriya', 'Galle'].map((item) => <Link key={item} to="/properties">{item}</Link>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="premium-nav__actions">
          <BadgeIcon icon={Heart} label="Saved properties" to="/properties" />
          <BadgeIcon icon={SlidersHorizontal} label="Compare properties" to="/properties" />
          {isLoggedIn && <BadgeIcon icon={MessageCircle} label="Messages" badge="3" />}
          {isLoggedIn && <BadgeIcon icon={Bell} label="Notifications" badge="6" />}
          {isLoggedIn && <BadgeIcon icon={CalendarDays} label="Appointments" />}
          <button className="premium-nav__icon" aria-label="Language selector"><Languages size={18} /></button>
          <button className="premium-nav__icon" aria-label="Toggle dark mode"><Moon size={18} /></button>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="premium-nav__text-link">Login</Link>
              <Link to="/register" className="premium-nav__text-link">Register</Link>
            </>
          ) : null}

          <Link to="/post-property" className="premium-nav__cta"><Plus size={17} /> Post Property</Link>

          {isLoggedIn && (
            <div className="premium-nav__profile">
              <button onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
                <UserRound size={19} />
              </button>
              <AnimatePresence>{profileOpen && <ProfileDropdown />}</AnimatePresence>
            </div>
          )}
        </div>

        <div className="premium-nav__mobile-actions">
          <button aria-label="Search"><Search size={20} /></button>
          <button aria-label="Notifications"><Bell size={20} /><span>2</span></button>
          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      <AnimatePresence>{mobileMenuOpen && <MobileDrawer closeMobileMenu={closeMobileMenu} />}</AnimatePresence>

      <nav className="premium-bottom-nav" aria-label="Mobile bottom navigation">
        <Link to="/"><Home size={19} />Home</Link>
        <Link to="/properties"><Search size={19} />Search</Link>
        <Link to="/properties"><Heart size={19} />Saved</Link>
        <Link to="/dashboard"><MessageCircle size={19} />Messages</Link>
        <Link to="/dashboard"><UserRound size={19} />Profile</Link>
      </nav>
    </header>
  );
}

function MegaMenu({ label }) {
  return (
    <motion.div
      className="premium-nav__mega"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <div className="premium-nav__mega-head">
        <BriefcaseBusiness size={19} />
        <div><strong>{label}</strong><span>Explore curated property options</span></div>
      </div>
      <div className="premium-nav__mega-grid">
        {megaMenus[label].map(([title, ...items]) => (
          <div key={title}>
            <h4>{title}</h4>
            {items.map((item) => <Link key={item} to="/properties">{item}</Link>)}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProfileDropdown() {
  return (
    <motion.div
      className="premium-nav__profile-menu"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {profileItems.map(([Icon, label, path]) => <Link key={label} to={path}><Icon size={17} /> {label}</Link>)}
      <button><LogOut size={17} /> Logout</button>
    </motion.div>
  );
}

function MobileDrawer({ closeMobileMenu }) {
  const links = ["Home", "Buy", "Rent", "Commercial", "New Projects", "Agents", "Services", "Blog", "Contact", "Saved", "Compare", "Appointments", "Dashboard", "Settings", "Logout"];

  return (
    <motion.div
      className="premium-nav__drawer"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
    >
      <div className="container">
        <div className="premium-nav__drawer-search"><Search size={18} /><input placeholder="Search properties" /></div>
        {links.map((label) => (
          <Link key={label} to={label === "Home" ? "/" : "/properties"} onClick={closeMobileMenu}>{label}</Link>
        ))}
        <Link to="/post-property" onClick={closeMobileMenu} className="premium-nav__drawer-cta"><Plus size={17} /> Post Property</Link>
      </div>
    </motion.div>
  );
}

export default Header;
