import express from "express";
import { registerClinic, login } from "../controlller/auth.controller.js";

const router = express.Router();

router.post('/register-clinic', registerClinic);
router.post('/login', login);

export default router;  