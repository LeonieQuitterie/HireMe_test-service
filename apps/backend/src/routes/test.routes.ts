// apps/backend/src/routes/test.routes.ts
import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Áp dụng auth middleware cho tất cả routes
router.use(authenticate);
router.use(restrictTo('HR')); // Chỉ HR mới được truy cập

/**
 * @route   GET /api/tests/my
 * @desc    Lấy tất cả tests của HR hiện tại
 * @access  Private (HR)
 */
router.get('/my', TestController.getMyTests);

/**
 * @route   GET /api/tests/job/:jobId
 * @desc    Lấy tất cả tests của 1 job
 * @access  Private (HR)
 */
router.get('/job/:jobId', TestController.getTestsByJob);

/**
 * @route   GET /api/tests/:testId
 * @desc    Lấy chi tiết 1 test bao gồm questions
 * @access  Private (HR)
 */
router.get('/:testId', TestController.getTestById);

/**
 * @route   POST /api/tests
 * @desc    Tạo test mới (cần chọn job)
 * @access  Private (HR)
 * @body    { job_id, title, time_limit_minutes, pass_score, status?, questions }
 */
router.post('/', TestController.createTest);

/**
 * @route   POST /api/tests/job/:jobId
 * @desc    Tạo test cho 1 job cụ thể
 * @access  Private (HR)
 * @body    { title, time_limit_minutes, pass_score, status?, questions }
 */
router.post('/job/:jobId', TestController.createTestForJob);

/**
 * @route   PUT /api/tests/:testId
 * @desc    Cập nhật test (không đổi job)
 * @access  Private (HR)
 * @body    { title?, time_limit_minutes?, pass_score?, status?, questions? }
 */
router.put('/:testId', TestController.updateTest);

/**
 * @route   PUT /api/tests/:testId/with-job
 * @desc    Cập nhật test (có thể đổi job)
 * @access  Private (HR)
 * @body    { job_id?, title?, time_limit_minutes?, pass_score?, status?, questions? }
 */
router.put('/:testId/with-job', TestController.updateTestWithJob);

/**
 * @route   DELETE /api/tests/:testId
 * @desc    Xóa test
 * @access  Private (HR)
 */
router.delete('/:testId', TestController.deleteTest);

export default router;