// src/services/auth.service.ts
import { supabase } from '../lib/supabase';
import { RegisterDTO, LoginDTO } from '../types';
import bcrypt from 'bcryptjs'; 

export class AuthService {
  async register(data: RegisterDTO) {
    const { full_name, email, password, role } = data;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ full_name, email, password_hash, role }])
      .select()
      .single();

    if (error) throw error;

    return newUser;
  }

  async login(data: LoginDTO) {
    const { email, password } = data;

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}