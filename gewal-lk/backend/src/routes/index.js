import { Router } from "express";

import { getHealthStatus } from "../controllers/health.controller.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.get("/health", getHealthStatus);

router.use("/auth", authRoutes);

export default router;