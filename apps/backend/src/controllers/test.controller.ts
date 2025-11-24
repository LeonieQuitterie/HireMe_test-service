// src/controllers/test.controller.ts
import { Request, Response } from 'express';
import { TestService } from '../services/test.service';
import { CreateTestDTO, ScheduleTestDTO } from '../types';

const testService = new TestService();

export class TestController {
  async createTest(req: Request, res: Response) {
    try {
      const data: CreateTestDTO = req.body;
      const test = await testService.createTest(data);
      
      res.status(201).json({
        success: true,
        message: 'Test created successfully',
        data: test
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create test'
      });
    }
  }

  async getTestsByJob(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      const tests = await testService.getTestsByJob(jobId);
      
      res.status(200).json({
        success: true,
        data: tests
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch tests'
      });
    }
  }

  async getTestById(req: Request, res: Response) {
    try {
      const testId = req.params.testId;
      const test = await testService.getTestById(testId);
      
      res.status(200).json({
        success: true,
        data: test
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Test not found'
      });
    }
  }

  async getTestByAccessCode(req: Request, res: Response) {
    try {
      const accessCode = req.params.accessCode;
      const test = await testService.getTestByAccessCode(accessCode);
      
      res.status(200).json({
        success: true,
        data: test
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Test not found or not open'
      });
    }
  }

  async scheduleTest(req: Request, res: Response) {
    try {
      const data: ScheduleTestDTO = req.body;
      const result = await testService.scheduleTest(data);
      
      res.status(201).json({
        success: true,
        message: 'Test scheduled successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to schedule test'
      });
    }
  }

  async updateTestStatus(req: Request, res: Response) {
    try {
      const result = await testService.updateTestStatus();
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update test status'
      });
    }
  }

  async deleteTest(req: Request, res: Response) {
    try {
      const testId = req.params.testId;
      const result = await testService.deleteTest(testId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete test'
      });
    }
  }
}