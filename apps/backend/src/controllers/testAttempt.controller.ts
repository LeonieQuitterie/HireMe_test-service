// src/controllers/testAttempt.controller.ts
import { Request, Response } from 'express';
import { TestAttemptService } from '../services/testAttempt.service';
import { SubmitTestDTO } from '../types';

const testAttemptService = new TestAttemptService();

export class TestAttemptController {
  async startAttempt(req: Request, res: Response) {
    try {
      const { test_id, candidate_id } = req.body;
      const attempt = await testAttemptService.startAttempt(test_id, candidate_id);
      
      res.status(201).json({
        success: true,
        message: 'Test attempt started',
        data: attempt
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to start test'
      });
    }
  }

  async submitAttempt(req: Request, res: Response) {
    try {
      const data: SubmitTestDTO = req.body;
      const attempt = await testAttemptService.submitAttempt(data);
      
      res.status(200).json({
        success: true,
        message: 'Test submitted successfully',
        data: attempt
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit test'
      });
    }
  }

  async getAttemptById(req: Request, res: Response) {
    try {
      const attemptId = req.params.attemptId;
      const attempt = await testAttemptService.getAttemptById(attemptId);
      
      res.status(200).json({
        success: true,
        data: attempt
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Attempt not found'
      });
    }
  }

  async getAttemptsByTest(req: Request, res: Response) {
    try {
      const testId = req.params.testId;
      const attempts = await testAttemptService.getAttemptsByTest(testId);
      
      res.status(200).json({
        success: true,
        data: attempts
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch attempts'
      });
    }
  }

  async getAttemptsByCandidate(req: Request, res: Response) {
    try {
      const candidateId = req.params.candidateId;
      const attempts = await testAttemptService.getAttemptsByCandidate(candidateId);
      
      res.status(200).json({
        success: true,
        data: attempts
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch attempts'
      });
    }
  }

  async getVideoResponses(req: Request, res: Response) {
    try {
      const attemptId = req.params.attemptId;
      const videos = await testAttemptService.getVideoResponses(attemptId);
      
      res.status(200).json({
        success: true,
        data: videos
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch video responses'
      });
    }
  }
}