// job.routes.ts
import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate, restrictTo, restrictToOwnJob } from '../middleware/auth.middleware';

const router = Router();

// Tạo job → chỉ HR
router.post('/', authenticate, restrictTo('HR'), JobController.createJob);

// Get all jobs of the logged-in HR – only HR
router.get('/my', authenticate, restrictTo('HR'), JobController.getMyJobs);
// Lấy chi tiết 1 job → phải là HR + là chủ job
router.get('/:id', authenticate, restrictTo('HR'), restrictToOwnJob(), JobController.getJobDetail);

// Sửa/xóa job → phải là HR + là chủ job
router.put('/:id', authenticate, restrictTo('HR'), restrictToOwnJob(), JobController.updateJob);
router.delete('/:id', authenticate, restrictTo('HR'), restrictToOwnJob(), JobController.deleteJob);

export default router;