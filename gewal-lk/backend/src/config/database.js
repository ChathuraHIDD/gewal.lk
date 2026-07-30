import mongoose from "mongoose";

import { environment } from "./environment.js";

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      environment.mongoUri,
      {
        autoIndex: !environment.isProduction,
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
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};