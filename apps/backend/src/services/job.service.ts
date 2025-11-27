// apps/backend/src/services/job.service.ts
import { supabase } from '../config/supabase';

interface CreateJobData {
    hr_id: string;
    title: string;
    description: string | null;
}

interface UpdateJobData {
    title: string;
    description: string | null;
}

export class JobService {

    static async getJobDetail(jobId: string, hr_id: string) {
        try {
            const { data: job, error } = await supabase
                .from('jobs')
                .select(`
                id,
                title,
                description,
                created_at,
                updated_at,
                tests!left (
                    id
                )
            `)
                .eq('id', jobId)
                .eq('hr_id', hr_id)   // Đảm bảo chỉ lấy job của chính HR này
                .single();

            if (error || !job) {
                return {
                    success: false,
                    status: error?.code === 'PGRST116' ? 404 : 400, // PGRST116 = not found
                    message: error?.message || 'Job not found',
                };
            }

            const formattedJob = {
                id: job.id,
                title: job.title,
                description: job.description || null,
                questionsCount: Array.isArray(job.tests) ? job.tests.length : 0,
                createdAt: job.created_at,
                updatedAt: job.updated_at || job.created_at,
            };

            return {
                success: true,
                message: 'Job fetched successfully',
                data: { job: formattedJob },
            };
        } catch (error) {
            console.error('Get job detail service error:', error);
            return {
                success: false,
                message: 'Internal server error',
            };
        }
    }

    static async getMyJobs(hr_id: string) {
        try {
            const { data: jobs, error } = await supabase
                .from('jobs')
                .select(`
        id,
        title,
        description,
        created_at,
        updated_at,
        tests!left (
          id
        )
      `)
                .eq('hr_id', hr_id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Get my jobs error:', error);
                return {
                    success: false,
                    message: 'Failed to fetch jobs',
                    error: error.message,
                };
            }

            // Transform dữ liệu để thêm questionsCount và đổi tên field cho frontend
            const formattedJobs = jobs.map(job => ({
                id: job.id,
                title: job.title,
                description: job.description || null,
                createdAt: job.created_at,
                updatedAt: job.updated_at || job.created_at,
                questionsCount: Array.isArray(job.tests) ? job.tests.length : 0,
            }));

            return {
                success: true,
                message: 'Jobs fetched successfully',
                data: { jobs: formattedJobs },
            };
        } catch (error) {
            console.error('Get my jobs service error:', error);
            return {
                success: false,
                message: 'Internal server error',
            };
        }
    }

    static async createJob(data: CreateJobData) {
        try {
            const { data: job, error } = await supabase
                .from('jobs')
                .insert({
                    hr_id: data.hr_id,
                    title: data.title.trim(),
                    description: data.description,
                })
                .select('id, title, description, created_at, hr_id')
                .single();

            if (error) {
                console.error('Create job error:', error);
                return {
                    success: false,
                    message: 'Failed to create job',
                    error: error.message,
                };
            }

            return {
                success: true,
                message: 'Job created successfully',
                data: { job },
            };
        } catch (error) {
            console.error('Create job service error:', error);
            return {
                success: false,
                message: 'Internal server error',
            };
        }
    }

    static async updateJob(jobId: string, hr_id: string, data: UpdateJobData) {
        try {
            // Kiểm tra job có tồn tại và thuộc về HR này không
            const { data: existingJob, error: fetchError } = await supabase
                .from('jobs')
                .select('id, hr_id')
                .eq('id', jobId)
                .single();

            if (fetchError || !existingJob) {
                return {
                    success: false,
                    status: 404,
                    message: 'Job not found',
                };
            }

            if (existingJob.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You can only edit your own jobs',
                };
            }

            const { data: updatedJob, error } = await supabase
                .from('jobs')
                .update({
                    title: data.title.trim(),
                    description: data.description,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', jobId)
                .select('id, title, description, updated_at, hr_id')
                .single();

            if (error) {
                return {
                    success: false,
                    message: 'Failed to update job',
                    error: error.message,
                };
            }

            return {
                success: true,
                message: 'Job updated successfully',
                data: { job: updatedJob },
            };
        } catch (error) {
            console.error('Update job service error:', error);
            return {
                success: false,
                message: 'Internal server error',
            };
        }
    }

    static async deleteJob(jobId: string, hr_id: string) {
        try {
            // Kiểm tra quyền sở hữu
            const { data: job, error: fetchError } = await supabase
                .from('jobs')
                .select('id, hr_id')
                .eq('id', jobId)
                .single();

            if (fetchError || !job) {
                return {
                    success: false,
                    status: 404,
                    message: 'Job not found',
                };
            }

            if (job.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You can only delete your own jobs',
                };
            }

            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', jobId);

            if (error) {
                return {
                    success: false,
                    message: 'Failed to delete job',
                    error: error.message,
                };
            }

            return {
                success: true,
                message: 'Job deleted successfully',
            };
        } catch (error) {
            console.error('Delete job service error:', error);
            return {
                success: false,
                message: 'Internal server error',
            };
        }
    }
}