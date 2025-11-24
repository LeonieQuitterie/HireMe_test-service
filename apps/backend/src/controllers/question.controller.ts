// src/controllers/question.controller.ts
import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDTO } from '../types';

const questionService = new QuestionService();

export class QuestionController {
  async createQuestion(req: Request, res: Response) {
    try {
      const data: CreateQuestionDTO = req.body;
      const question = await questionService.createQuestion(data);
      
      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: question
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create question'
      });
    }
  }

  async createMultipleQuestions(req: Request, res: Response) {
    try {
      const { test_id, questions } = req.body;
      const result = await questionService.createMultipleQuestions(test_id, questions);
      
      res.status(201).json({
        success: true,
        message: 'Questions created successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create questions'
      });
    }
  }

  async getQuestionsByTest(req: Request, res: Response) {
    try {
      const testId = req.params.testId;
      const questions = await questionService.getQuestionsByTest(testId);
      
      res.status(200).json({
        success: true,
        data: questions
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch questions'
      });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.questionId;
      const data: Partial<CreateQuestionDTO> = req.body;
      const question = await questionService.updateQuestion(questionId, data);
      
      res.status(200).json({
        success: true,
        message: 'Question updated successfully',
        data: question
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update question'
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const questionId = req.params.questionId;
      const result = await questionService.deleteQuestion(questionId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete question'
      });
    }
  }
}