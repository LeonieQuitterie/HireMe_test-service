// routes/test-question.routes.ts
import { Router } from 'express';
import { TestQuestionController } from '../controllers/test-question.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// ĐÚNG 100% → khi mount /api/tests sẽ thành /api/tests/:testId/questions
router.get('/:testId/questions', authenticate, restrictTo('Candidate'), TestQuestionController.getTestQuestions);

export default router;