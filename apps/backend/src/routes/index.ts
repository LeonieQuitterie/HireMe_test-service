// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import jobRoutes from './job.routes';
import testRoutes from './test.routes';
import questionRoutes from './question.routes';
import testAttemptRoutes from './testAttempt.routes';
import resultRoutes from './result.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'HireMeAI API is running' });
});

// API routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/tests', testRoutes);
router.use('/questions', questionRoutes);
router.use('/attempts', testAttemptRoutes);
router.use('/results', resultRoutes);

export default router;