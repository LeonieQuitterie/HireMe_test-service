// backend/src/controllers/transcription.controller.ts
import { Response } from 'express';
import { TranscriptionService } from '../services/transcription.service';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware'; // ← Import AuthRequest

export class TranscriptionController {
  
  /**
   * POST /api/transcription/answers/:answerId/transcribe
   * Transcribe 1 answer
   */
  static async transcribeAnswer(req: AuthRequest, res: Response) { // ← Đổi Request thành AuthRequest
    try {
      const { answerId } = req.params;
      
      const { data: answer, error } = await supabase
        .from('submission_answers')
        .select('id, video_url, transcript_status')
        .eq('id', answerId)
        .single();
      
      if (error || !answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
      
      if (!answer.video_url) {
        return res.status(400).json({ error: 'No video URL' });
      }
      
      if (answer.transcript_status === 'completed') {
        return res.status(400).json({ 
          error: 'Already transcribed'
        });
      }
      
      // Process async
      TranscriptionService.processAnswer(answerId, answer.video_url)
        .catch(err => console.error('Error:', err));
      
      res.json({ 
        success: true,
        message: 'Transcription started',
        answerId
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * POST /api/transcription/submissions/:submissionId/transcribe
   * Transcribe tất cả answers của submission
   */
  static async transcribeSubmission(req: AuthRequest, res: Response) { // ← Đổi
    try {
      const { submissionId } = req.params;
      
      const { data: answers, error } = await supabase
        .from('submission_answers')
        .select('id, video_url, transcript_status')
        .eq('submission_id', submissionId)
        .not('video_url', 'is', null);
      
      if (error || !answers || answers.length === 0) {
        return res.status(404).json({ error: 'No answers found' });
      }
      
      const pending = answers.filter(
        a => a.transcript_status === 'pending' || a.transcript_status === 'failed'
      );
      
      if (pending.length === 0) {
        return res.json({ 
          message: 'All answers already transcribed',
          total: answers.length
        });
      }
      
      // Process async
      for (const answer of pending) {
        TranscriptionService.processAnswer(answer.id, answer.video_url)
          .catch(err => console.error('Error:', err));
      }
      
      res.json({ 
        success: true,
        message: 'Transcription started',
        total: answers.length,
        started: pending.length
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * GET /api/transcription/answers/:answerId/transcript
   * Lấy transcript
   */
  static async getTranscript(req: AuthRequest, res: Response) { // ← Đổi
    try {
      const { answerId } = req.params;
      
      const { data: answer, error } = await supabase
        .from('submission_answers')
        .select('transcript, transcript_status')
        .eq('id', answerId)
        .single();
      
      if (error || !answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
      
      res.json({
        transcript: answer.transcript,
        status: answer.transcript_status
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * POST /api/transcription/process-pending
   * Process tất cả pending (HR only)
   */
  static async processPending(req: AuthRequest, res: Response) { // ← Đổi
    try {
      // Check HR role
      if (req.user?.role !== 'HR') { // ← Sửa 'hr' thành 'HR' (theo JwtPayload)
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      const limit = parseInt(req.query.limit as string) || 10;
      
      TranscriptionService.processPendingAnswers(limit)
        .catch(err => console.error('Error:', err));
      
      res.json({ 
        success: true,
        message: `Processing up to ${limit} pending answers`
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * GET /api/transcription/stats
   */
  static async getStats(req: AuthRequest, res: Response) { // ← Đổi
    try {
      const stats = await TranscriptionService.getStats();
      res.json(stats || {});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}