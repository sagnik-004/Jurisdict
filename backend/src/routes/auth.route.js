import { Router } from 'express';
import { refreshToken } from "../controllers/auth.controller.js";

const router = Router();

router.get('/refresh', refreshToken);

export default router;