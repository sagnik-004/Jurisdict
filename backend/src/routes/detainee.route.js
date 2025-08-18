import { Router } from "express";
import { detaineeSignup, detaineeLogin, getOngoingCases, raiseBail } from "../controllers/detainee.controller.js";

const router = Router();

router.post("/signup", detaineeSignup);
router.post("/login", detaineeLogin);
router.patch("/:caseid/raise-bail", raiseBail);
router.get("/:username/ongoing-cases", getOngoingCases);

export default router;