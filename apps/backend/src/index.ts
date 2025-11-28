// apps/backend/src/index.ts
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import testRoutes from './routes/test.routes';
import testQuestionRoutes from './routes/test-question.routes';     // thêm
import testAccessRoutes from './routes/test-access.routes';         // thêm
import scheduledRoutes from './routes/test-schedule.routes';         // thêm
import submissionRoutes from './routes/submission.routes';
import userRoutes from './routes/user.routes';
import transcriptionRoutes from './routes/transcription.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ROUTES ĐÃ SỬA HOÀN HẢO – KO CÒN LỖI NỮA!
app.use('/api/auth', authRoutes);                    // OK
app.use('/api/jobs', jobRoutes);                     // OK
app.use('/api/tests', testRoutes);                   // HR quản lý test
app.use('/api/testsq', testQuestionRoutes);           // Candidate làm bài ← PHẢI ĐẶT SAU testRoutes
app.use('/api/test-access', testAccessRoutes);       // verify code
app.use('/api/test-schedules', scheduledRoutes);     // HR lên lịch
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transcription', transcriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});