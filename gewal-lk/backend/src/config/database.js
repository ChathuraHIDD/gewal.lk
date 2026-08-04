import dns from "node:dns";
import mongoose from "mongoose";

import { environment } from "./environment.js";

if (environment.dnsServers.length > 0) {
  dns.setServers(environment.dnsServers);
}

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      environment.mongoUri,
      {
        autoIndex: !environment.isProduction,
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log("MongoDB connected successfully");
    console.log(
      `MongoDB host: ${connection.connection.host}`
    );
    console.log(
      `Database name: ${connection.connection.name}`
    );

    return connection;
  } catch (error) {
    if (environment.isDevelopment) {
      console.warn(
        "MongoDB connection failed. Continuing without a database in development mode.",
        error.message
      );

      return null;
    }

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};