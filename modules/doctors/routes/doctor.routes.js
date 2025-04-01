import express from "express";
import authMiddleware from "../../auth/middleware/auth.middleware.js";
import { 
    registerDoctor
} from '../controllers/doctor.controller.js';

const router = express.Router();

router.post("/", registerDoctor);

export default router;
