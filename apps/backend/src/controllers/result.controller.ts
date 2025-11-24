// src/controllers/result.controller.ts
import { Request, Response } from 'express';
import { ResultService } from '../services/result.service';
import { TestResultDTO } from '../types';

const resultService = new ResultService();

export class ResultController {
  async saveResult(req: Request, res: Response) {
    try {
      const data: TestResultDTO = req.body;
      const result = await resultService.saveResult(data);
      
      res.status(201).json({
        success: true,
        message: 'Result saved successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to save result'
      });
    }
  }

  async getResultByAttempt(req: Request, res: Response) {
    try {
      const attemptId = req.params.attemptId;
      const result = await resultService.getResultByAttempt(attemptId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Result not found'
      });
    }
  }

  async getTestOverview(req: Request, res: Response) {
    try {
      const testId = req.params.testId;
      const overview = await resultService.getTestOverview(testId);
      
      res.status(200).json({
        success: true,
        data: overview
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Overview not found'
      });
    }
  }
}