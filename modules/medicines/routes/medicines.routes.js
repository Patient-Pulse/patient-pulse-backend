import express from "express";
import {
  searchMedicines,
  quickAddClinicMedicine,
  getPrescriptionTemplates
} from "../controller/medicines.controller.js";
import authMiddleware from "../../auth/middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", authMiddleware, searchMedicines);
router.post("/quick-add", authMiddleware, quickAddClinicMedicine);
router.get("/templates", authMiddleware, getPrescriptionTemplates);

export default router;