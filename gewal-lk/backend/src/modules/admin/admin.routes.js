import { Router } from "express";

import { USER_ROLES } from "../../constants/auth.constants.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

import {
  approveProperty,
  createAdmin,
  deleteAdmin,
  getAdmins,
  listProperties,
  rejectProperty,
} from "./admin.controller.js";

import { validateCreateAdmin } from "./admin.validation.js";

const router = Router();

router.use(authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN));

router.get("/admins", getAdmins);
router.post("/admins", validateCreateAdmin, createAdmin);
router.delete("/admins/:id", deleteAdmin);

router.get("/properties", listProperties);
router.patch("/properties/:id/approve", approveProperty);
router.patch("/properties/:id/reject", rejectProperty);

export default router;
