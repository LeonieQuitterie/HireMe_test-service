// src/routes/result.routes.ts
import { Router } from 'express';
import { ResultController } from '../controllers/result.controller';

const router = Router();
const resultController = new ResultController();

router.post('/', resultController.saveResult);
router.get('/attempt/:attemptId', resultController.getResultByAttempt);
router.get('/overview/:testId', resultController.getTestOverview);

export default router;