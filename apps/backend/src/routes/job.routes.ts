// src/routes/job.routes.ts
import { Router } from 'express';
import { JobController } from '../controllers/job.controller';

const router = Router();
const jobController = new JobController();

router.post('/', jobController.createJob);
router.get('/hr/:hrId', jobController.getJobsByHR);
router.get('/:jobId', jobController.getJobById);
router.put('/:jobId', jobController.updateJob);
router.delete('/:jobId', jobController.deleteJob);

export default router;