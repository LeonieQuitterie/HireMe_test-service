// apps/backend/src/controllers/test.controller.ts
import { Response } from 'express';
import { TestService } from '../services/test.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class TestController {
    /**
     * GET /api/tests/job/:jobId
     * Lấy tất cả tests của 1 job
     */
    static async getTestsByJob(req: AuthRequest, res: Response) {
        try {
            const { jobId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await TestService.getTestsByJob(jobId, hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Get tests by job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * GET /api/tests/:testId
     * Lấy chi tiết 1 test bao gồm questions
     */
    static async getTestById(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await TestService.getTestById(testId, hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Get test by id controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * GET /api/tests/my
     * Lấy tất cả tests của HR hiện tại
     */
    static async getMyTests(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await TestService.getMyTests(hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Get my tests controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * POST /api/tests/job/:jobId
     * Tạo test cho 1 job cụ thể
     * Body: { title, time_limit_minutes, pass_score, status, questions }
     */
    static async createTestForJob(req: AuthRequest, res: Response) {
        try {
            const { jobId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const { title, time_limit_minutes, pass_score, status, questions } = req.body;

            // Validation
            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required',
                });
            }

            if (!time_limit_minutes || time_limit_minutes <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Time limit must be greater than 0',
                });
            }

            if (pass_score === undefined || pass_score < 0 || pass_score > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Pass score must be between 0 and 100',
                });
            }

            // Validation cho questions
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one question is required',
                });
            }

            // Validate từng question
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.question_text || !q.question_text.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: `Question ${i + 1} text is required`,
                    });
                }
            }

            const testData = {
                job_id: jobId,
                title: title.trim(),
                time_limit_minutes,
                pass_score,
                status: status || 'closed',
                questions: questions.map((q: any, index: number) => ({
                    question_text: q.question_text.trim(),
                    order: q.order !== undefined ? q.order : index,
                })),
            };

            const result = await TestService.createTestForJob(testData, hr_id);

            return res.status(result.status || 201).json(result);
        } catch (error) {
            console.error('Create test for job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * POST /api/tests
     * Tạo test (cần chọn job)
     * Body: { job_id, title, time_limit_minutes, pass_score, status, questions }
     */
    static async createTest(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const { job_id, title, time_limit_minutes, pass_score, status, questions } = req.body;

            // Validation
            if (!job_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Job ID is required',
                });
            }

            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required',
                });
            }

            if (!time_limit_minutes || time_limit_minutes <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Time limit must be greater than 0',
                });
            }

            if (pass_score === undefined || pass_score < 0 || pass_score > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Pass score must be between 0 and 100',
                });
            }

            // Validation cho questions
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one question is required',
                });
            }

            // Validate từng question
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                if (!q.question_text || !q.question_text.trim()) {
                    return res.status(400).json({
                        success: false,
                        message: `Question ${i + 1} text is required`,
                    });
                }
            }

            const testData = {
                job_id,
                title: title.trim(),
                time_limit_minutes,
                pass_score,
                status: status || 'closed',
                questions: questions.map((q: any, index: number) => ({
                    question_text: q.question_text.trim(),
                    order: q.order !== undefined ? q.order : index,
                })),
            };

            const result = await TestService.createTest(testData, hr_id);

            return res.status(result.status || 201).json(result);
        } catch (error) {
            console.error('Create test controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * PUT /api/tests/:testId
     * Cập nhật test (không đổi job)
     * Body: { title?, time_limit_minutes?, pass_score?, status?, questions? }
     */
    static async updateTest(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const { title, time_limit_minutes, pass_score, status, questions } = req.body;

            // Validation
            if (title !== undefined && !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty',
                });
            }

            if (time_limit_minutes !== undefined && time_limit_minutes <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Time limit must be greater than 0',
                });
            }

            if (pass_score !== undefined && (pass_score < 0 || pass_score > 100)) {
                return res.status(400).json({
                    success: false,
                    message: 'Pass score must be between 0 and 100',
                });
            }

            // Validate questions nếu có
            if (questions !== undefined) {
                if (!Array.isArray(questions)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Questions must be an array',
                    });
                }

                // Nếu gửi questions thì phải có ít nhất 1 câu
                if (questions.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'At least one question is required',
                    });
                }

                for (let i = 0; i < questions.length; i++) {
                    const q = questions[i];
                    if (!q.question_text || !q.question_text.trim()) {
                        return res.status(400).json({
                            success: false,
                            message: `Question ${i + 1} text is required`,
                        });
                    }
                }
            }

            const testData: any = {};

            if (title !== undefined) testData.title = title.trim();
            if (time_limit_minutes !== undefined) testData.time_limit_minutes = time_limit_minutes;
            if (pass_score !== undefined) testData.pass_score = pass_score;
            if (status !== undefined) testData.status = status;
            if (questions !== undefined) {
                testData.questions = questions.map((q: any, index: number) => ({
                    question_text: q.question_text.trim(),
                    order: q.order !== undefined ? q.order : index,
                }));
            }

            const result = await TestService.updateTest(testId, testData, hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Update test controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * PUT /api/tests/:testId/with-job
     * Cập nhật test (có thể đổi job)
     * Body: { job_id?, title?, time_limit_minutes?, pass_score?, status?, questions? }
     */
    static async updateTestWithJob(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const { job_id, title, time_limit_minutes, pass_score, status, questions } = req.body;

            // Validation
            if (title !== undefined && !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty',
                });
            }

            if (time_limit_minutes !== undefined && time_limit_minutes <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Time limit must be greater than 0',
                });
            }

            if (pass_score !== undefined && (pass_score < 0 || pass_score > 100)) {
                return res.status(400).json({
                    success: false,
                    message: 'Pass score must be between 0 and 100',
                });
            }

            // Validate questions nếu có
            if (questions !== undefined) {
                if (!Array.isArray(questions)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Questions must be an array',
                    });
                }

                if (questions.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'At least one question is required',
                    });
                }

                for (let i = 0; i < questions.length; i++) {
                    const q = questions[i];
                    if (!q.question_text || !q.question_text.trim()) {
                        return res.status(400).json({
                            success: false,
                            message: `Question ${i + 1} text is required`,
                        });
                    }
                }
            }

            const testData: any = {};

            if (job_id !== undefined) testData.job_id = job_id;
            if (title !== undefined) testData.title = title.trim();
            if (time_limit_minutes !== undefined) testData.time_limit_minutes = time_limit_minutes;
            if (pass_score !== undefined) testData.pass_score = pass_score;
            if (status !== undefined) testData.status = status;
            if (questions !== undefined) {
                testData.questions = questions.map((q: any, index: number) => ({
                    question_text: q.question_text.trim(),
                    order: q.order !== undefined ? q.order : index,
                }));
            }

            const result = await TestService.updateTestWithJob(testId, testData, hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Update test with job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * DELETE /api/tests/:testId
     * Xóa test
     */
    static async deleteTest(req: AuthRequest, res: Response) {
        try {
            const { testId } = req.params;
            const hr_id = req.user?.id;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await TestService.deleteTest(testId, hr_id);

            return res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Delete test controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}