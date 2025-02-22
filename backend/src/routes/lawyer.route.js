import { Router } from "express";
import { lawyerLogin, lawyerSignup, logout, getOngoingCases, getBailAppeals, getPendingBails } from "../controllers/lawyer.controller.js";

const router = Router();

// Auth routes
router.post("/signup", lawyerSignup);
router.post("/login", lawyerLogin);
router.post("/logout", logout);

// Ongoing Cases route
router.get("/ongoing-cases/:lawyerId", getOngoingCases);

// New bail tracking routes
router.get('/bail-appeals/:lawyerId', getBailAppeals);
router.get('/pending-bails/:lawyerId', getPendingBails);

export default router;