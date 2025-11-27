export interface ScheduleTestInput {
  start_time: string; // ISO string
  emails: string[];
}

export interface ScheduleTestResult {
  success: boolean;
  message: string;
  status?: number;
  data?: {
    schedule_id: string;
    invited_count: number;
  };
}