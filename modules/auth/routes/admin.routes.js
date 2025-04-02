import express from "express";
import { registerClinic, login, registerUser } from "../controlller/auth.controller.js";

const router = express.Router();

router.post('/register-clinic', registerClinic);
router.post('/register-user', registerUser);
router.post('/login', login);

export default router;  