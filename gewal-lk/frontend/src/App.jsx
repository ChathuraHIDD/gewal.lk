import { motion } from "motion/react";

import fullLogo from "./assets/logos/gewal-full-logo.png";

function App() {
  return (
    <main className="app">
      <section
        className="section"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "var(--gradient-hero)",
        }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
          }}
        >
          <motion.img
            src={fullLogo}
            alt="Gewal.lk"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: "260px",
              margin: "0 auto 36px",
            }}
          />

          <motion.h1
            className="heading-xl"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              marginInline: "auto",
              marginBottom: "24px",
            }}
          >
            Find your next
            <span className="text-gradient">
              {" "}
              perfect opportunity
            </span>
          </motion.h1>

          <motion.p
            className="text-muted"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              fontSize: "1.12rem",
            }}
          >
            Properties, lands, vehicles and
            marketplace items — all in one
            trusted Sri Lankan platform.
          </motion.p>
        </div>
      </section>
    </main>
  );
}

export default App;