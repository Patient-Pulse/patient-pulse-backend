import express from "express";
import { createPrescription, getVisitMedications } from "../controller/prescriptions.controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPrescription);
router.get("/:visitId/medications", authMiddleware, getVisitMedications);

export default router;