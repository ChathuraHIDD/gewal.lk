import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import { User } from "../modules/users/user.model.js";
import { OtpCode } from "../modules/auth/otp.model.js";
import { RefreshToken } from "../modules/auth/refreshToken.model.js";
import {
  Amenity,
  platformModels,
} from "../models/propertyPlatform.models.js";

const defaultAmenities = [
  ["Swimming Pool", "waves"],
  ["Gym", "dumbbell"],
  ["WiFi", "wifi"],
  ["Garden", "trees"],
  ["Garage", "car"],
  ["Balcony", "building"],
  ["CCTV", "camera"],
  ["Solar Power", "sun"],
  ["Lift", "arrow-up-down"],
  ["Security", "shield-check"],
  ["Air Conditioning", "snowflake"],
  ["Water Supply", "droplets"],
];

const allModels = [
  User,
  OtpCode,
  RefreshToken,
  ...platformModels,
];

const dropLegacyTextIndexes = async (model) => {
  const indexes = await model.collection.indexes();

  for (const index of indexes) {
    const hasTextKey = Object.values(index.key).includes("text") ||
      Object.values(index.key).includes("_fts");

    if (hasTextKey) {
      await model.collection.dropIndex(index.name);
      console.log(`Dropped legacy text index: ${model.collection.name}.${index.name}`);
    }
  }
};

const syncDatabase = async () => {
  await connectDatabase();

  for (const model of allModels) {
    await model.createCollection();

    if (["properties", "blogs"].includes(model.collection.name)) {
      await dropLegacyTextIndexes(model);
    }

    await model.syncIndexes();
    console.log(`Synced collection: ${model.collection.name}`);
  }

  await Amenity.bulkWrite(
    defaultAmenities.map(([name, icon]) => ({
      updateOne: {
        filter: { name },
        update: { $setOnInsert: { name, icon } },
        upsert: true,
      },
    }))
  );

  console.log("Default amenities synced");
  console.log("Database schema sync completed successfully");

  await mongoose.connection.close();
};

syncDatabase().catch(async (error) => {
  console.error("Database schema sync failed:", error);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exit(1);
});
