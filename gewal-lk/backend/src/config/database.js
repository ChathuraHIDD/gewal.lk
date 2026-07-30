import mongoose from "mongoose";
import { environment } from "./environment.js";

const databaseOptions = {
  autoIndex: !environment.isProduction,
};

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      environment.mongoUri,
      databaseOptions
    );

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();

    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error.message);

    throw error;
  }
};