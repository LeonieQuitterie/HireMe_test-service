// src/controllers/testSchedule.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestScheduleService } from '../services/schedule.service';

export class TestScheduleController {
    static async getMyTestSchedules(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const hrId = req.user.id;

            const schedules = await TestScheduleService.getSchedulesByHrId(hrId);

            return res.status(200).json({
                success: true,
                data: schedules,
            });
        } catch (error: any) {
            console.error('Error in getMyTestSchedules:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    static async deleteSchedule(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const hrId = req.user.id;
            const { scheduleId } = req.params;

            if (!scheduleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Schedule ID is required',
                });
            }

            await TestScheduleService.deleteSchedule(scheduleId, hrId);

            return res.status(200).json({
                success: true,
                message: 'Schedule deleted successfully',
            });
        } catch (error: any) {
            console.error('Error in deleteSchedule:', error);

            // Xử lý các lỗi cụ thể
            if (error.message === 'Schedule not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Schedule not found',
                });
            }

            if (error.message.includes('Unauthorized')) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete this schedule',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }
}