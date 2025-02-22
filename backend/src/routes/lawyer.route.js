import { Router } from "express";
import { lawyerLogin, lawyerSignup, logout } from "../controllers/lawyer.controller.js";


const router = Router();

// Auth routes
router.post("/signup", lawyerSignup);
router.post("/login", lawyerLogin);
router.post("/logout", logout);


export default router;