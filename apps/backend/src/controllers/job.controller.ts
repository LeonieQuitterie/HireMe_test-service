// src/controllers/job.controller.ts
import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { CreateJobDTO } from '../types';

const jobService = new JobService();

export class JobController {
  async createJob(req: Request, res: Response) {
    try {
      const hrId = req.body.hr_id; // Should come from auth middleware
      const data: CreateJobDTO = req.body;
      const job = await jobService.createJob(hrId, data);
      
      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create job'
      });
    }
  }

  async getJobsByHR(req: Request, res: Response) {
    try {
      const hrId = req.params.hrId;
      const jobs = await jobService.getJobsByHR(hrId);
      
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch jobs'
      });
    }
  }

  async getJobById(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      const job = await jobService.getJobById(jobId);
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Job not found'
      });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      const hrId = req.body.hr_id; // Should come from auth middleware
      const data: Partial<CreateJobDTO> = req.body;
      const job = await jobService.updateJob(jobId, hrId, data);
      
      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update job'
      });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      const hrId = req.body.hr_id; // Should come from auth middleware
      const result = await jobService.deleteJob(jobId, hrId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete job'
      });
    }
  }
}