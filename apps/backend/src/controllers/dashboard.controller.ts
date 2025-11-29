// apps/backend/src/controllers/dashboard.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
    static async getTestDashboard(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;

            if (!testId) {
                return res.status(400).json({
                    success: false,
                    message: 'Test ID is required'
                });
            }

            const candidates = await DashboardService.getTestDashboard(testId);

            return res.status(200).json({
                success: true,
                data: candidates
            });

        } catch (error: any) {
            console.error('Get dashboard error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get dashboard data'
            });
        }
    }

    static async getTestStats(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;

            if (!testId) {
                return res.status(400).json({
                    success: false,
                    message: 'Test ID is required'
                });
            }

            const stats = await DashboardService.getTestStats(testId);

            return res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error: any) {
            console.error('Get stats error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Failed to get stats'
            });
        }
    }
}

// ✅ THÊM dòng này ở cuối file
export default DashboardController;