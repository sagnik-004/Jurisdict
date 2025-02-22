import { Router } from "express";
import { judgeLogin, judgeSignup, judgeLogout, getCasesForJudge, getBailAppeals, bailDecision, getDecidedCases  } from "../controllers/judge.controller.js";

const router = Router();

// Auth routes
router.post("/signup", judgeSignup);
router.post("/login", judgeLogin);
router.post("/logout", judgeLogout);

// Route for getting cases assigned to a judge

router.get("/cases/:username", getCasesForJudge);
router.get("/bail-appeals/:username", getBailAppeals);
router.post("/bail-decision", bailDecision);
router.get("/decided-cases/:username", getDecidedCases);

export default router;