import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CandidateBigFiveService } from '../services/candidate-big-five.service';

export class CandidateBigFiveController {
  static async getByCandidateAndTest(req: AuthRequest, res: Response) {
    try {
      const { candidateId, testId } = req.params;
      const result = await CandidateBigFiveService.getByCandidateAndTest(candidateId, testId);

      if (!result) {
        return res.status(404).json({ success: false, message: 'Big Five personality scores not found' });
      }

      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('[CandidateBigFive] Error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async getSubmissionScores(req: AuthRequest, res: Response) {
    try {
      const { candidateId, testId } = req.params;
      const result = await CandidateBigFiveService.getSubmissionScores(candidateId, testId);

      if (!result) {
        return res.status(404).json({ success: false, message: 'Submission scores not found' });
      }

      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error('[CandidateBigFive] Scores Error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}