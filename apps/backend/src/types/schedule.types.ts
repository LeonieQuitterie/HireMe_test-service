// types/schedule.types.ts
export interface ScheduleTestInput {
    start_time: string;
    emails: string[];
}

export interface ScheduleTestResult {
    success: boolean;
    status?: number;
    message: string;
    data?: {
        schedule_id: string;
        invited_count: number;
        access_code?: string; // ← THÊM DÒNG NÀY
    };
}