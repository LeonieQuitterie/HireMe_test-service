// apps/backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // Validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }

      if (!['HR', 'Candidate'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be HR or Candidate',
        });
      }

      // Map role from frontend to backend
      const mappedRole = role === 'employer' ? 'HR' : 'Candidate';

      const result = await AuthService.register({
        full_name: name,
        email,
        password,
        role: mappedRole,
      });

      const statusCode = result.success ? 201 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Register controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/auth/login - KHÔNG CẦN ROLE
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validation - CHỈ CẦN email và password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await AuthService.login({
        email,
        password,
        role: 'Candidate', // Dummy value, không dùng trong service
      });

      const statusCode = result.success ? 200 : 401;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Login controller error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current logged in user
   */
  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const result = await AuthService.getUserById(req.user.id);

      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error) {
      console.error('Get current user error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response) {
    // JWT is stateless, so we just return success
    // Client should remove token from localStorage
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}