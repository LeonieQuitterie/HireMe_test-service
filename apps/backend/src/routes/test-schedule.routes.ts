// routes/test-schedule.routes.ts
import { Router } from 'express';
import { TestScheduleController } from '../controllers/test-schedule.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// POST /api/tests/:testId/schedule
// Chỉ HR mới được lên lịch + phải là chủ sở hữu của job chứa test đó
router.post(
  '/:testId/schedule',
  authenticate,                                   // 1. Check token
  restrictTo('HR'),                               // 2. Chỉ HR mới được phép
  TestScheduleController.createSchedule           // 3. Vào controller
);

export default router;