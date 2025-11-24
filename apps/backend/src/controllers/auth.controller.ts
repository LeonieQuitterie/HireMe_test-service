// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body;
      const user = await authService.register(data);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body;
      const user = await authService.login(data);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: user
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }
}