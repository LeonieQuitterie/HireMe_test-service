// controllers/test-access.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestAccessService } from '../services/test-access.service';

export class TestAccessController {
    static async verifyCode(req: AuthRequest, res: Response) {
        try {
            const { code } = req.body;
            const candidateEmail = req.user?.email;

            if (!candidateEmail) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            if (!code || code.length !== 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid code format',
                });
            }

            const result = await TestAccessService.verifyAccessCode(code, candidateEmail);

            return res.status(result.status).json(result);
        } catch (error) {
            console.error('Verify code error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}