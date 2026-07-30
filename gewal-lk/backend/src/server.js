import http from "node:http";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { environment } from "./config/environment.js";

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = http.createServer(app);

    server.listen(environment.port, () => {
      console.log(
        `Gewal.lk API running in ${environment.nodeEnv} mode`
      );

      console.log(
        `Server URL: http://localhost:${environment.port}`
      );

      console.log(
        `Health check: http://localhost:${environment.port}/api/${environment.apiVersion}/health`
      );
    });
  } catch (error) {
    console.error(
      "Gewal.lk server could not start:",
      error.message
    );

    process.exit(1);
  }
};

const shutdownServer = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  try {
    if (server) {
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
    }

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    console.log("Graceful shutdown completed");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error during graceful shutdown:",
      error.message
    );

    process.exit(1);
  }
};

process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});

process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);

  shutdownServer("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);

  process.exit(1);
});

startServer();