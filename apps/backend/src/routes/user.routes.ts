// apps/backend/src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Tất cả route này đều cần đăng nhập
router.use(authenticate);

// Lấy thông tin cá nhân
router.get('/me', UserController.getMyProfile);

// Cập nhật thông tin cá nhân
router.put('/me', UserController.updateMyProfile);

export default router;