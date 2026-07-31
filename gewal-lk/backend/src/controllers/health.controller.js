import mongoose from "mongoose";
import { environment } from "../config/environment.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const databaseStateNames = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getHealthStatus = (request, response) => {
  const databaseState =
    databaseStateNames[mongoose.connection.readyState] ||
    "unknown";

  const isDatabaseConnected =
    mongoose.connection.readyState === 1;

  const statusCode = isDatabaseConnected ? 200 : 503;

  response.status(statusCode).json(
    new ApiResponse({
      statusCode,
      message: isDatabaseConnected
        ? "Gewal.lk API is healthy"
        : "Gewal.lk API is running, but the database is unavailable",

      data: {
        application: "Gewal.lk API",
        environment: environment.nodeEnv,
        database: databaseState,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    })
  );
};