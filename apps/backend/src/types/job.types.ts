// apps/backend/src/types/job.types.ts
export interface CreateJobRequest {
  job_title: string;
  job_description: string;
}

export interface UpdateJobRequest {
  job_title?: string;
  job_description?: string;
}

export interface Job {
  id: string;
  hr_id: string;
  job_title: string;
  job_description: string;
  created_at: string;
  updated_at: string;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data?: {
    job?: Job;
    jobs?: Job[];
  };
  error?: string;
}