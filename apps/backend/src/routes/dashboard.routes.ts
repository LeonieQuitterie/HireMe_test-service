// apps/backend/src/routes/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/tests/:testId/dashboard
 * Lấy tất cả candidates với assessment scores
 */
router.get(
    '/:testId/dashboard',
    authenticate,
    restrictTo('HR'),
    DashboardController.getTestDashboard
);

/**
 * GET /api/tests/:testId/dashboard/stats
 * Lấy statistics summary
 */
router.get(
    '/:testId/dashboard/stats',
    authenticate,
    restrictTo('HR'),
    DashboardController.getTestStats
);

export default router;