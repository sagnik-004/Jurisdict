import { Router } from "express";
import { detaineeSignup, detaineeLogin, detaineeLogout, getOngoingCases, getBailAppeals } from "../controllers/detainee.controller.js";

const router = Router();

// Auth routes
router.post("/signup", detaineeSignup);
router.post("/login", detaineeLogin);
router.post("/logout", detaineeLogout);

router.get("/ongoing/:username", getOngoingCases);
router.get("/bail-appeals/:username", getBailAppeals);

export default router;