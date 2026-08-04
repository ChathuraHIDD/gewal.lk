import { Router } from "express";

import { getHealthStatus } from "../controllers/health.controller.js";
import authRoutes from "../modules/auth/auth.routes.js";
import propertyRoutes from "../modules/property/property.routes.js";

const router = Router();

router.get("/health", getHealthStatus);

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);

export default router;