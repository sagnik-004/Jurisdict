import { Router } from "express";
import { lawyerSignup, lawyerLogin, forwardToJudge, getOngoingCases } from "../controllers/lawyer.controller.js";

const router = Router();

router.post("/signup", lawyerSignup);
router.post("/login", lawyerLogin);
router.patch("/:caseid/forward-to-judge", forwardToJudge);
router.get("/:lawyerid/ongoing-cases", getOngoingCases);

export default router;