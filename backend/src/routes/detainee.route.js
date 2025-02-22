import { Router } from "express";
import { detaineeSignup, detaineeLogin, detaineeLogout } from "../controllers/detainee.controller.js";

const router = Router();

// Auth routes
router.post("/signup", detaineeSignup);
router.post("/login", detaineeLogin);
router.post("/logout", detaineeLogout);

export default router;