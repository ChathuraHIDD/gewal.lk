import http from "node:http";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { environment } from "./config/environment.js";

let server = null;
let isShuttingDown = false;

/**
 * Start the Gewal.lk backend server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas first
    await connectDatabase();

    // Create the HTTP server using the Express app
    server = http.createServer(app);

    // Start listening for requests
    server.listen(environment.port, () => {
      console.log("========================================");
      console.log("Gewal.lk backend started successfully");
      console.log(`Environment: ${environment.nodeEnv}`);
      console.log(`Port: ${environment.port}`);
      console.log(
        `Server URL: http://localhost:${environment.port}`
      );
      console.log(
        `Health check: http://localhost:${environment.port}/api/${environment.apiVersion}/health`
      );
      console.log(
        `Database: ${mongoose.connection.name || "not connected"}`
      );
      console.log("========================================");
    });

    // Handle HTTP server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${environment.port} is already in use.`
        );
      } else {
        console.error("HTTP server error:", error);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error("========================================");
    console.error("Gewal.lk backend failed to start");
    console.error(error.message);
    console.error("========================================");

    process.exit(1);
  }
};

/**
 * Close the HTTP server
 */
const closeHttpServer = async () => {
  if (!server) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  console.log("HTTP server closed");
};

/**
 * Close the MongoDB connection
 */
const closeDatabaseConnection = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close();

  console.log("MongoDB connection closed");
};

/**
 * Gracefully stop the backend
 */
const shutdownServer = async (
  signal,
  exitCode = 0
) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log("");
  console.log("========================================");
  console.log(`${signal} received`);
  console.log("Starting graceful shutdown...");
  console.log("========================================");

  try {
    await closeHttpServer();
    await closeDatabaseConnection();

    console.log("Gewal.lk backend stopped successfully");

    process.exit(exitCode);
  } catch (error) {
    console.error(
      "Error during graceful shutdown:",
      error.message
    );

    process.exit(1);
  }
};

/**
 * Handle Ctrl + C
 */
process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});

/**
 * Handle deployment or system termination
 */
process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

/**
 * Handle unhandled promise errors
 */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);

  shutdownServer("UNHANDLED_REJECTION", 1);
});

/**
 * Handle unexpected synchronous errors
 */
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);

  shutdownServer("UNCAUGHT_EXCEPTION", 1);
});

// Start the application
startServer();