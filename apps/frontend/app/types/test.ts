// Types dựa theo database schema

export interface Question {
    id: string;                    // UUID from database
    test_id: string;              // UUID reference
    question_text: string;
    order: number;
    created_at: string;           // ISO date string
}

export interface Test {
    // Database fields (snake_case từ backend)
    id: string;                   // UUID
    job_id: string;               // UUID reference
    title: string;
    time_limit_minutes: number;
    pass_score: number;           // 0-100
    status: 'open' | 'closed' | 'scheduled';
    created_at: string;           // ISO date string
    updated_at: string;           // ISO date string
    
    // Additional fields từ API joins/calculations
    job_name?: string;
    questions_count: number;
    questions?: Question[];       // Optional, loaded separately
}

// lib/types.ts hoặc ngay cạnh file Test
export interface TestSchedule {
  id: string;
  test_id: string;
  start_time: string;     // ISO string
  end_time?: string | null;
  created_at: string;
}

export interface TestWithSchedule extends Test {
  schedule?: TestSchedule | null;
  invited_emails?: string[]; // danh sách đã mời (nếu cần hiển thị lại)
}

// API Response từ backend (camelCase)
export interface ApiTestResponse {
    id: string;
    testName: string;
    jobName: string;
    questionsCount: number;
    timeLimit: number;
    status: 'open' | 'closed' | 'scheduled';
    createdAt: string;
    updatedAt: string;
}

// Create Test Request
export interface CreateTestData {
    job_id: string;
    title: string;
    time_limit_minutes: number;
    pass_score: number;
    status?: 'open' | 'closed' | 'scheduled';
    questions: {
        question_text: string;
        order?: number;
    }[];
}

// Update Test Request
export interface UpdateTestData {
    job_id?: string;
    title?: string;
    time_limit_minutes?: number;
    pass_score?: number;
    status?: 'open' | 'closed' | 'scheduled';
    questions?: {
        question_text: string;
        order?: number;
    }[];
}