// src/types/index.ts
export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'HR' | 'Candidate';
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  hr_id: string;
  job_title: string;
  job_description: string;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  job_id: string;
  test_name: string;
  duration_minutes: number;
  passing_score: number;
  status: 'Open' | 'Closed';
  access_code: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  question_order: number;
  created_at: string;
}

export interface TestSchedule {
  id: string;
  test_id: string;
  open_time: string;
  close_time: string;
  created_at: string;
}

export interface TestInvitation {
  id: string;
  test_id: string;
  email: string;
  invited_at: string;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  candidate_id: string;
  started_at: string;
  submitted_at?: string;
  total_score?: number;
  status: 'In Progress' | 'Completed' | 'Pass' | 'Fail';
}

export interface VideoResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  video_url: string;
  uploaded_at: string;
}

export interface TestResult {
  id: string;
  attempt_id: string;
  openness_score?: number;
  conscientiousness_score?: number;
  extraversion_score?: number;
  neuroticism_score?: number;
  agreeableness_score?: number;
  created_at: string;
}

// DTOs (Data Transfer Objects)
export interface RegisterDTO {
  full_name: string;
  email: string;
  password: string;
  role: 'HR' | 'Candidate';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateJobDTO {
  job_title: string;
  job_description: string;
}

export interface CreateTestDTO {
  job_id: string;
  test_name: string;
  duration_minutes: number;
  passing_score: number;
}

export interface CreateQuestionDTO {
  test_id: string;
  question_text: string;
  question_order: number;
}

export interface ScheduleTestDTO {
  test_id: string;
  open_time: string;
  close_time: string;
  invite_recipients: string[];
}

export interface SubmitTestDTO {
  attempt_id: string;
  video_responses: {
    question_id: string;
    video_url: string;
  }[];
}

export interface TestResultDTO {
  attempt_id: string;
  openness_score: number;
  conscientiousness_score: number;
  extraversion_score: number;
  neuroticism_score: number;
  agreeableness_score: number;
}