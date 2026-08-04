import { Router } from "express";

import { USER_ROLES } from "../../constants/auth.constants.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { uploadPropertyImages } from "../../middlewares/upload.middleware.js";

import {
  createProperty,
  getProperty,
  listMyPropertyListings,
  listProperties,
} from "./property.controller.js";

import { validateCreateProperty } from "./property.validation.js";

const router = Router();

/*
 * Create a new property listing
 */
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.SELLER, USER_ROLES.AGENT),
  uploadPropertyImages.array("images", 10),
  validateCreateProperty,
  createProperty
);

/*
 * List the current user's own property listings
 *
 * Registered before "/:slug" so "mine" is not treated
 * as a slug value.
 */
router.get("/mine", authenticate, listMyPropertyListings);

/*
 * List published properties
 */
router.get("/", listProperties);

/*
 * Get a single property by slug
 */
router.get("/:slug", getProperty);

export default router;
