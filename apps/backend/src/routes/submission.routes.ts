import { Router } from 'express';
import multer from 'multer';
import { SubmissionController } from '../controllers/submission.controller';
import { authenticate, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for multiple files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 20, // Max 20 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

// Submit test (Candidate only)
router.post(
  '/submit/:testId',
  authenticate,
  restrictTo('Candidate'),
  upload.any(), // Accept multiple files with dynamic field names
  SubmissionController.submitTest
);

// Get submission
router.get(
  '/:submissionId',
  authenticate,
  SubmissionController.getSubmission
);

export default router;