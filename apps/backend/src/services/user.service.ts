// apps/backend/src/services/user.service.ts
import { supabase } from '../config/supabase';

export class UserService {
  // Lấy profile của chính mình
  static async getMyProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, phone, avatar, role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Cập nhật profile (tên, email, phone, avatar)
  static async updateMyProfile(
    userId: string,
    updates: {
      full_name?: string;
      email?: string;
      phone?: string;
      avatar?: string;
    }
  ) {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: updates.full_name,
        email: updates.email,
        phone: updates.phone,
        avatar: updates.avatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Email hoặc số điện thoại đã được sử dụng');
      }
      throw error;
    }

    return data;
  }
}