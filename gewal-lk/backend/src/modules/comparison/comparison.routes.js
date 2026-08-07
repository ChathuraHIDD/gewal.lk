import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";

import {
  addComparisonItem,
  clearMyComparison,
  getMyComparison,
  removeComparisonItem,
} from "./comparison.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getMyComparison);
router.delete("/", clearMyComparison);
router.post("/:propertyId", addComparisonItem);
router.delete("/:propertyId", removeComparisonItem);

export default router;
