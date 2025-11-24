// src/routes/question.routes.ts
import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';

const router = Router();
const questionController = new QuestionController();

router.post('/', questionController.createQuestion);
router.post('/bulk', questionController.createMultipleQuestions);
router.get('/test/:testId', questionController.getQuestionsByTest);
router.put('/:questionId', questionController.updateQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

export default router;