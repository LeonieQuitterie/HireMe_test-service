// backend/src/routes/transcription.routes.ts
import express from 'express';
import { TranscriptionController } from '../controllers/transcription.controller';
import { authenticate } from '../middleware/auth.middleware'; // ← Import authenticate

const router = express.Router();

// Auth required
router.use(authenticate); // ← Đổi từ authMiddleware thành authenticate

// Routes
router.post('/answers/:answerId/transcribe', 
  TranscriptionController.transcribeAnswer
);

router.post('/submissions/:submissionId/transcribe', 
  TranscriptionController.transcribeSubmission
);

router.get('/answers/:answerId/transcript', 
  TranscriptionController.getTranscript
);

router.post('/process-pending', 
  TranscriptionController.processPending
);

router.get('/stats', 
  TranscriptionController.getStats
);

export default router;