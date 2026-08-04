import { Link } from "react-router-dom";
import {
  Building2,
  CarFront,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

import fullLogo from "../../../assets/logos/gewal-full-logo.png";
import symbolLogo from "../../../assets/logos/gewal-symbol.png";

import "./AuthLayout.css";

const featureItems = [
  {
    icon: Building2,
    text: "Premium verified properties",
  },
  {
    icon: CarFront,
    text: "Trusted island-wide marketplace",
  },
  {
    icon: ShieldCheck,
    text: "Safe accounts and secure access",
  },
];

function AuthLayout({
  title,
  description,
  children,
}) {
  return (
    <main className="auth-layout">
      <section className="auth-layout__visual">
        <div className="auth-layout__orb auth-layout__orb--one" />
        <div className="auth-layout__orb auth-layout__orb--two" />

        <Link
          to="/"
          className="auth-layout__brand"
        >
          <img
            src={fullLogo}
            alt="Gewal.lk"
          />
        </Link>

        <div className="auth-layout__visual-content">
          <motion.img
            src={symbolLogo}
            alt=""
            className="auth-layout__symbol"
            initial={{
              opacity: 0,
              scale: 0.85,
              rotate: -8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.15,
            }}
          >
            <p className="auth-layout__eyebrow">
              <CheckCircle2 size={17} />
              Sri Lanka’s modern marketplace
            </p>

            <h2>
              Step into a smarter way to find home.
            </h2>

            <p className="auth-layout__visual-description">
              Access premium listings, trusted agents and a secure Sri Lankan real estate experience.
            </p>
          </motion.div>

          <div className="auth-layout__features">
            {featureItems.map(
              ({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="auth-layout__feature"
                >
                  <span>
                    <Icon size={18} />
                  </span>

                  {text}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="auth-layout__form-section">
        <div className="auth-layout__mobile-logo">
          <Link to="/">
            <img
              src={fullLogo}
              alt="Gewal.lk"
            />
          </Link>
        </div>

        <motion.div
          className="auth-layout__form-container"
          initial={{
            opacity: 0,
            x: 24,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="auth-layout__heading">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {children}
        </motion.div>
      </section>
    </main>
  );
}

export default AuthLayout;