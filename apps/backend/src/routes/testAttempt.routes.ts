// src/routes/testAttempt.routes.ts
import { Router } from 'express';
import { TestAttemptController } from '../controllers/testAttempt.controller';

const router = Router();
const testAttemptController = new TestAttemptController();

router.post('/start', testAttemptController.startAttempt);
router.post('/submit', testAttemptController.submitAttempt);
router.get('/:attemptId', testAttemptController.getAttemptById);
router.get('/test/:testId', testAttemptController.getAttemptsByTest);
router.get('/candidate/:candidateId', testAttemptController.getAttemptsByCandidate);
router.get('/:attemptId/videos', testAttemptController.getVideoResponses);

export default router;