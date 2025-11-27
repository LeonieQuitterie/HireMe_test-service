// apps/backend/src/types/auth.types.ts
export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: 'HR' | 'Candidate';
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'HR' | 'Candidate'; // Optional vì không dùng nữa
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      full_name: string;
      role: string;
    };
    access_token: string;
  };
  error?: string;
}