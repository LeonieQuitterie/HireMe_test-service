// src/services/job.service.ts
import { supabase } from '../lib/supabase';
import { CreateJobDTO } from '../types';

export class JobService {
  async createJob(hrId: string, data: CreateJobDTO) {
    const { job_title, job_description } = data;

    const { data: newJob, error } = await supabase
      .from('jobs')
      .insert([{ hr_id: hrId, job_title, job_description }])
      .select()
      .single();

    if (error) throw error;
    return newJob;
  }

  async getJobsByHR(hrId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('hr_id', hrId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getJobById(jobId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateJob(jobId: string, hrId: string, data: Partial<CreateJobDTO>) {
    const { data: updatedJob, error } = await supabase
      .from('jobs')
      .update(data)
      .eq('id', jobId)
      .eq('hr_id', hrId)
      .select()
      .single();

    if (error) throw error;
    return updatedJob;
  }

  async deleteJob(jobId: string, hrId: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('hr_id', hrId);

    if (error) throw error;
    return { message: 'Job deleted successfully' };
  }
}