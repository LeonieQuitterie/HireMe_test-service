// controllers/test-schedule.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TestScheduleService } from '../services/test-schedule.service';

export class TestScheduleController {
  static async createSchedule(req: AuthRequest, res: Response) {
    try {
      const { testId } = req.params;
      const hr_id = req.user?.id;

      if (!hr_id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { start_time, emails } = req.body;

      if (!start_time || !emails || !Array.isArray(emails)) {
        return res.status(400).json({
          success: false,
          message: 'start_time and emails array are required',
        });
      }

      const result = await TestScheduleService.scheduleTest(testId, { start_time, emails }, hr_id);

      return res.status(result.status || 201).json(result);
    } catch (error) {
      console.error('Schedule test controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}