import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { SubmissionService } from '../services/submission.service';
import { supabase } from '../config/supabase'; // Sửa lỗi require() → import đúng cách

interface SubmissionAnswer {
    id: string;
    question_id: string;
    video_url: string;
    duration_seconds: number | null;
}

interface SubmissionData {
    id: string;
    test_id: string;
    candidate_id: string;
    submitted_at: string;
    total_score?: number | null;
    pass?: boolean | null;
    scoring_status?: string | null;
    submission_answers: SubmissionAnswer[];
}

export class SubmissionController {
    /**
     * Submit test with video answers
     * POST /api/submissions/submit/:testId
     */
    static async submitTest(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;
            const candidateId = req.user!.id;
            const files = req.files as Express.Multer.File[];

            console.log('Files received:', files?.length || 0);
            console.log('Request body:', req.body);

            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Không nhận được video nào',
                });
            }

            // Kiểm tra đã nộp chưa
            const hasSubmitted = await SubmissionService.checkExistingSubmission(testId, candidateId);
            if (hasSubmitted) {
                return res.status(400).json({
                    success: false,
                    message: 'Bạn đã nộp bài test này rồi',
                });
            }

            // Lấy danh sách questionId từ tên field (video_xxx)
            const questionIds = files.map((f) => f.fieldname.replace('video_', ''));

            // Validate câu hỏi có thuộc test không
            await SubmissionService.validateQuestions(testId, questionIds);

            // Upload tất cả video lên R2 song song
            const uploadedAnswers = await Promise.all(
                files.map(async (file) => {
                    const questionId = file.fieldname.replace('video_', '');
                    const videoUrl = await SubmissionService.uploadVideoToR2(
                        file,           // ← đây là Express.Multer.File, không phải file.buffer
                        candidateId,
                        testId,
                        questionId
                    );
                    return {
                        questionId,
                        videoUrl,
                        durationSeconds: undefined, // có thể lấy từ frontend sau
                    };
                })
            );

            // Lưu submission + answers vào DB
            const result = await SubmissionService.createSubmission(
                testId,
                candidateId,
                uploadedAnswers
            );

            return res.status(201).json({
                success: true,
                data: result,
                message: 'Nộp bài thành công! Video đã được lưu và đang chờ chấm điểm.',
            });
        } catch (error: any) {
            console.error('Submit test error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Nộp bài thất bại. Vui lòng thử lại.',
            });
        }
    }

    /**
     * Get submission by ID
     * GET /api/submissions/:submissionId
     */
    static async getSubmission(req: AuthRequest, res: Response) {
        try {
            const { submissionId } = req.params;
            const userId = req.user!.id;
            const userRole = req.user!.role;

            const { data: submission, error } = await supabase
                .from('test_submissions')
                .select(`
                    id,
                    test_id,
                    candidate_id,
                    submitted_at,
                    total_score,
                    pass,
                    scoring_status,
                    submission_answers (
                        id,
                        question_id,
                        video_url,
                        duration_seconds
                    )
                `)
                .eq('id', submissionId)
                .single();

            if (error || !submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bài nộp',
                });
            }

            // Kiểm tra quyền truy cập
            if (userRole === 'Candidate' && submission.candidate_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn chỉ có thể xem bài nộp của chính mình',
                });
            }

            return res.json({
                success: true,
                data: {
                    id: submission.id,
                    testId: submission.test_id,
                    candidateId: submission.candidate_id,
                    submittedAt: submission.submitted_at,
                    totalScore: submission.total_score ?? null,        // có thể null
                    passStatus: submission.pass ?? null,                // có thể null
                    scoringStatus: submission.scoring_status ?? 'pending', // nếu có cột này
                    answers: (submission.submission_answers || []).map((a: any) => ({
                        id: a.id,
                        questionId: a.question_id,
                        videoUrl: a.video_url,
                        durationSeconds: a.duration_seconds,
                    })),
                },
            });
        } catch (error: any) {
            console.error('Get submission error:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin bài nộp',
            });
        }
    }
}