// apps/backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthService } from '../services/auth.service';

export interface JwtPayload {
  id: string;
 email: string;
 role: 'HR' | 'Candidate';
}

export interface AuthRequest extends Request {
 user?: JwtPayload;
}

// 1. Xác thực token
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
 const authHeader = req.headers.authorization;

 if (!authHeader?.startsWith('Bearer ')) {
   return res.status(401).json({
     success: false,
     message: 'Access token is required',
   });
 }

 const token = authHeader.split(' ')[1];
 const { valid, payload, error } = AuthService.verifyToken(token);

 if (!valid || !payload) {
   return res.status(401).json({
     success: false,
     message: error === 'jwt expired' ? 'Token has expired' : 'Invalid token',
   });
 }

 req.user = payload as JwtPayload;
 next();
};

// 2. Phân quyền theo role (đổi tên thành restrictTo cho chuẩn)
export const restrictTo = (...allowedRoles: Array<'HR' | 'Candidate' | 'hr' | 'candidate'>) => {
 return (req: AuthRequest, res: Response, next: NextFunction) => {
   if (!req.user || !allowedRoles.includes(req.user.role)) {
     return res.status(403).json({
       success: false,
       message: 'You do not have permission to perform this action',
     });
   }
   next();
 };
};

// 3. KIỂM TRA CHỦ SỞ HỮU TÀI NGUYÊN (job, application, v.v.) - ĐÃ SỬA LỖI TS
export const restrictToOwnJob = () => {
 return async (req: AuthRequest, res: Response, next: NextFunction) => {
   if (!req.user) {
     return res.status(401).json({ success: false, message: 'Unauthorized' });
   }

   const jobId = req.params.id || req.params.jobId;
   if (!jobId) {
     return res.status(400).json({ success: false, message: 'Job ID is required' });
   }

   const { data: job, error } = await supabase
     .from('jobs')
     .select('hr_id')
     .eq('id', jobId)
     .single();

   if (error || !job) {
     return res.status(404).json({ success: false, message: 'Job not found' });
   }

   if (job.hr_id !== req.user.id) {
     return res.status(403).json({
       success: false,
       message: 'You can only modify your own jobs',
     });
   }

   // Gắn thêm job vào req để controller dùng nếu cần
   (req as any).job = job;

   next();
 };
};