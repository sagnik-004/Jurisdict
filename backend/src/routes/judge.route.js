import { Router } from "express";
import { judgeLogin, judgeSignup, getOngoingCases, decideBail } from "../controllers/judge.controller.js";

const router = Router();

router.post("/signup", judgeSignup);
router.post("/login", judgeLogin);
router.patch("/:caseid/decide-bail", decideBail);
router.get("/:judgeid/ongoing-cases", getOngoingCases);

export default router;