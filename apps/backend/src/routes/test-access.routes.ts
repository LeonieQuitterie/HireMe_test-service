// routes/test-access.routes.ts
import { Router } from 'express';
import { TestAccessController } from '../controllers/test-access.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// ĐÚNG 100% → khi mount /api/test-access sẽ thành /api/test-access/verify
router.post('/verify', authenticate, restrictTo('Candidate'), TestAccessController.verifyCode);

export default router;