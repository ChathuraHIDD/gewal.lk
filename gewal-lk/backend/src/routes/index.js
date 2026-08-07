import { Router } from "express";

import { getHealthStatus } from "../controllers/health.controller.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import appointmentRoutes from "../modules/appointments/appointment.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import comparisonRoutes from "../modules/comparison/comparison.routes.js";
import favoriteRoutes from "../modules/favorites/favorite.routes.js";
import propertyRoutes from "../modules/property/property.routes.js";

const router = Router();

router.get("/health", getHealthStatus);

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/comparison", comparisonRoutes);
router.use("/admin", adminRoutes);

export default router;
