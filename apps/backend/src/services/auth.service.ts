// apps/backend/src/services/auth.service.ts
import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
    /**
     * Register new user
     */
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', data.email)
                .single();

            if (existingUser) {
                return {
                    success: false,
                    message: 'Email already registered',
                    error: 'EMAIL_EXISTS',
                };
            }

            // Hash password
            const password_hash = await bcrypt.hash(data.password, 10);

            // Insert user
            const { data: newUser, error } = await supabase
                .from('users')
                .insert({
                    full_name: data.full_name,
                    email: data.email,
                    password_hash,
                    role: data.role,
                })
                .select('id, email, full_name, role')
                .single();

            if (error) {
                console.error('❌ Register error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                });
                return {
                    success: false,
                    message: 'Failed to create account',
                    error: error.message,
                };
            }

            // Generate JWT token
            const access_token = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return {
                success: true,
                message: 'Account created successfully',
                data: {
                    user: newUser,
                    access_token,
                },
            };
        } catch (error) {
            console.error('Register service error:', error);
            return {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Login user - KHÔNG YÊU CẦU ROLE
     */
    static async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            // Find user by email ONLY (không filter theo role)
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email, full_name, password_hash, role')
                .eq('email', data.email)
                .single();

            if (error || !user) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                    error: 'INVALID_CREDENTIALS',
                };
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(data.password, user.password_hash);

            if (!isValidPassword) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                    error: 'INVALID_CREDENTIALS',
                };
            }

            // Generate JWT token
            const access_token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return {
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role,
                    },
                    access_token,
                },
            };
        } catch (error) {
            console.error('Login service error:', error);
            return {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get user by ID (from token)
     */
    static async getUserById(userId: string) {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('id, email, full_name, role, created_at')
                .eq('id', userId)
                .single();

            if (error || !user) {
                return {
                    success: false,
                    message: 'User not found',
                    error: 'USER_NOT_FOUND',
                };
            }

            return {
                success: true,
                message: 'User found',
                data: { user },
            };
        } catch (error) {
            console.error('Get user error:', error);
            return {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Verify JWT token
     */
    static verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            return { valid: true, payload };
        } catch (error) {
            return {
                valid: false,
                error: error instanceof Error ? error.message : 'Invalid token',
            };
        }
    }
}