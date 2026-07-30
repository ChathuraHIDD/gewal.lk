import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
} from "./auth.controller.js";
import {
  validateLogin,
  validateRegistration,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRegistration,
  register
);

router.post(
  "/login",
  validateLogin,
  login
);

router.post(
  "/refresh",
  refresh
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  authenticate,
  getCurrentUser
);

export default router;