import { Router } from "express";
import { caseRegister, getCaseProcessed } from "../controllers/case.controller.js";

const router = Router();

router.post("/register", caseRegister);
router.post("/:entity/:caseid/process-case", getCaseProcessed);

export default router;