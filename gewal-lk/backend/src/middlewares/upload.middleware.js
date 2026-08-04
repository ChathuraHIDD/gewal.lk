import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import { ApiError } from "../utils/ApiError.js";

const uploadsRoot = path.resolve("uploads");
const propertyImagesDirectory = path.join(uploadsRoot, "properties");

fs.mkdirSync(propertyImagesDirectory, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, propertyImagesDirectory);
  },

  filename(request, file, callback) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (request, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(
      new ApiError({
        statusCode: 422,
        message: "Only JPG, PNG, WebP and AVIF images are allowed",
        code: "INVALID_FILE_TYPE",
      })
    );
    return;
  }

  callback(null, true);
};

export const uploadPropertyImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});
