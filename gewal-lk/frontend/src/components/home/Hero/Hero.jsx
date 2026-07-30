import { useState } from "react";
import {
  Building2,
  CarFront,
  ChevronDown,
  MapPin,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import symbolLogo from "../../../assets/logos/gewal-symbol.png";

import "./Hero.css";

const heroCategories = [
  {
    id: "property",
    label: "Property",
    icon: Building2,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    icon: CarFront,
  },
  {
    id: "item",
    label: "Marketplace",
    icon: PackageSearch,
  },
];

function Hero() {
  const [activeCategory, setActiveCategory] =
    useState("property");

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    console.log({
      category: activeCategory,
      keyword,
      location,
    });
  };

  return (
    <section className="hero">
      <div className="hero__orb hero__orb--one" />
      <div className="hero__orb hero__orb--two" />

      <div className="container hero__container">
        <div className="hero__content">
          <motion.div
            className="hero__eyebrow"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
          >
            <Sparkles size={17} />
            Sri Lanka’s modern marketplace
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.08,
            }}
          >
            Find the right place,
            vehicle or item
            <span className="text-gradient">
              {" "}
              with confidence.
            </span>
          </motion.h1>

          <motion.p
            className="hero__description"
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.16,
            }}
          >
            Discover verified properties, lands,
            vehicles and marketplace listings from
            trusted sellers and professional agents
            across Sri Lanka.
          </motion.p>

          <motion.div
            className="hero__trust-row"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.24,
            }}
          >
            <span>
              <ShieldCheck size={18} />
              Verified listings
            </span>

            <span>
              <MapPin size={18} />
              Island-wide coverage
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
          initial={{
            opacity: 0,
            scale: 0.92,
            x: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="hero__visual-card">
            <div className="hero__visual-ring hero__visual-ring--one" />
            <div className="hero__visual-ring hero__visual-ring--two" />

            <img
              src={symbolLogo}
              alt=""
              className="hero__symbol float-soft"
            />

            <div className="hero__floating-card hero__floating-card--top">
              <Building2 size={21} />
              <div>
                <strong>10,000+</strong>
                <span>Active listings</span>
              </div>
            </div>

            <div className="hero__floating-card hero__floating-card--bottom">
              <ShieldCheck size={21} />
              <div>
                <strong>Trusted</strong>
                <span>Secure platform</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero__search-panel"
          initial={{
            opacity: 0,
            y: 34,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.32,
          }}
        >
          <div className="hero__category-tabs">
            {heroCategories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={
                    activeCategory === category.id
                      ? "hero__category-tab hero__category-tab--active"
                      : "hero__category-tab"
                  }
                  onClick={() =>
                    setActiveCategory(category.id)
                  }
                >
                  <Icon size={19} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <form
            className="hero__search-form"
            onSubmit={handleSearch}
          >
            <label className="hero__search-field">
              <Search size={20} />

              <input
                type="text"
                placeholder="What are you looking for?"
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
              />
            </label>

            <label className="hero__search-field">
              <MapPin size={20} />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </label>

            <button
              className="hero__search-filter"
              type="button"
            >
              Price range
              <ChevronDown size={17} />
            </button>

            <button
              className="hero__search-button"
              type="submit"
            >
              <Search size={19} />
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;