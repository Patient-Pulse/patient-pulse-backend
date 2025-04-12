import express from 'express';
import { getVisitAnalytics, getRevenueAnalytics, 
    getDemographicsAnalytics, getMedicationsAnalytics, getDiagnosesAnalytics, 
    getConditionsAnalytics } from '../controller/analytics.controller.js';
import authMiddleware from '../../auth/middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = express.Router();

const allowedRoles = ['admin', 'doctor'];

// Only allow admin and doctor roles to access analytics
router.get('/visits', authMiddleware, roleMiddleware(allowedRoles), getVisitAnalytics);
router.get('/revenue', authMiddleware, roleMiddleware(allowedRoles), getRevenueAnalytics);
router.get('/demographics', authMiddleware, roleMiddleware(allowedRoles), getDemographicsAnalytics);
router.get('/medications', authMiddleware, roleMiddleware(allowedRoles), getMedicationsAnalytics);
router.get('/diagnoses', authMiddleware, roleMiddleware(allowedRoles), getDiagnosesAnalytics);
router.get('/conditions', authMiddleware, roleMiddleware(allowedRoles), getConditionsAnalytics);

export default router;