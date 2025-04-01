import express from "express";
import authMiddleware from "../../auth/middleware/auth.middleware.js";
import { 
    getPatientById, 
    getPatients, 
    registerPatient, 
    updatePatient
} from '../controller/patients.controller.js';

import { addVisit, 
    editVisit, 
    getVisitById, 
    getPatientVisits,
    sendEmail
} from '../controller/visits.controller.js';

const router = express.Router();

router.get("/", authMiddleware, getPatients);
router.get("/:id", authMiddleware, getPatientById);
router.post("/register-patient", authMiddleware, registerPatient);
router.put("/update-patient/:id", authMiddleware, updatePatient);

router.post("/:patientId/add-visit/", authMiddleware, addVisit);
router.patch("/:patientId/edit-visit/:visitId", authMiddleware, editVisit)
router.get("/:patientId/visit/:visitId", authMiddleware, getVisitById)
router.get("/:patientId/visits", authMiddleware, getPatientVisits);

router.post("/:patientId/visit/:visitId/send-report-email", authMiddleware, sendEmail)

export default router;
