// src/routes/test.routes.ts
import { Router } from 'express';
import { authenticate, restrictTo } from '../middleware/auth.middleware';
import { TestScheduleController } from '../controllers/schedule.controller';

const router = Router();

// Lấy tất cả lịch test của HR
router.get(
    '/me',
    authenticate,
    restrictTo('HR'),
    TestScheduleController.getMyTestSchedules
);

// Thêm invites vào schedule có sẵn
router.post(
    '/:scheduleId/invite',
    authenticate,
    restrictTo('HR'),
    TestScheduleController.addInvitesToSchedule
);

// Xóa lịch test theo schedule_id
router.delete(
    '/:scheduleId',
    authenticate,
    restrictTo('HR'),
    TestScheduleController.deleteSchedule
);

export default router;