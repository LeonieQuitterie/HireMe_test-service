// controllers/test-question.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestQuestionService } from '../services/test-question.service';

export class TestQuestionController {
    static async getTestQuestions(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;

            const result = await TestQuestionService.getTestWithQuestions(testId);

            return res.status(result.status).json(result);
        } catch (error) {
            console.error('Get test questions error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}