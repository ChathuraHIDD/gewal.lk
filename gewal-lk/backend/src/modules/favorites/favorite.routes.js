import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";

import {
  addFavorite,
  getFavoriteIds,
  getFavorites,
  removeFavorite,
} from "./favorite.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getFavorites);
router.get("/ids", getFavoriteIds);
router.post("/:propertyId", addFavorite);
router.delete("/:propertyId", removeFavorite);

export default router;
