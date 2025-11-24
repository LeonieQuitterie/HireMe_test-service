// src/routes/test.routes.ts
import { Router } from 'express';
import { TestController } from '../controllers/test.controller';

const router = Router();
const testController = new TestController();

router.post('/', testController.createTest);
router.get('/job/:jobId', testController.getTestsByJob);
router.get('/:testId', testController.getTestById);
router.get('/access/:accessCode', testController.getTestByAccessCode);
router.post('/schedule', testController.scheduleTest);
router.post('/update-status', testController.updateTestStatus);
router.delete('/:testId', testController.deleteTest);

export default router;