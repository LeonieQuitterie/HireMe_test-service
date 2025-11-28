// apps/backend/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  // GET /api/users/me - Lấy thông tin profile của mình
  static async getMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id; // từ auth middleware
      const profile = await UserService.getMyProfile(userId);
      return res.json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin người dùng',
      });
    }
  }

  // PUT /api/users/me - Cập nhật profile
  static async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { full_name, email, phone, avatar } = req.body;

      const updatedProfile = await UserService.updateMyProfile(userId, {
        full_name,
        email,
        phone,
        avatar,
      });

      return res.json({
        success: true,
        message: 'Cập nhật thành công',
        data: updatedProfile,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Cập nhật thất bại',
      });
    }
  }
}