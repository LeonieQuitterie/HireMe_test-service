// apps/backend/src/controllers/job.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { JobService } from '../services/job.service';

export class JobController {

    /**
 * GET /api/jobs/:id
 * Lấy chi tiết 1 job - chỉ chủ job (HR đã tạo) mới được xem
 */
    static async getJobDetail(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;
            const { id } = req.params;

            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await JobService.getJobDetail(id, hr_id);

            if (!result.success) {
                return res.status(result.status || 400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Get job detail controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * POST /api/jobs
     * Tạo job mới - chỉ HR được tạo
     */



    static async getMyJobs(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;
            if (!hr_id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const result = await JobService.getMyJobs(hr_id);

            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            console.error('Get my jobs controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    static async createJob(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;
            const { title, description } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Job title is required',
                });
            }

            const result = await JobService.createJob({
                hr_id: hr_id!,
                title,
                description: description?.trim() || null,
            });

            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            console.error('Create job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * PUT /api/jobs/:id
     * Cập nhật job - chỉ chủ job (HR đã tạo) mới được sửa
     */
    static async updateJob(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;
            const { id } = req.params;
            const { title, description } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Job title is required',
                });
            }

            const result = await JobService.updateJob(id, hr_id!, {
                title,
                description: description?.trim() || null,
            });

            if (!result.success) {
                return res.status(result.status || 400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Update job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    /**
     * DELETE /api/jobs/:id
     * Xóa job - chỉ chủ job mới được xóa
     */
    static async deleteJob(req: AuthRequest, res: Response) {
        try {
            const hr_id = req.user?.id;
            const { id } = req.params;

            const result = await JobService.deleteJob(id, hr_id!);

            if (!result.success) {
                return res.status(result.status || 400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Delete job controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}