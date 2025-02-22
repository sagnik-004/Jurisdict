import { Router } from "express";
import { caseRegister } from "../controllers/case.controller.js";

const router = Router();

router.post("/register", caseRegister);

export default router;