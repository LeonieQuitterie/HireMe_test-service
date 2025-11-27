// apps/frontend/types/job.ts
// export interface Job {
//   id: string
//   title: string
//   description: string | null
//   questionsCount: number
//   createdAt: string
//   updatedAt: string
// }

export interface Job {
    id: string;                   // UUID
    hr_id: string;               // UUID reference
    title: string;
    description: string | null;
    created_at: string;          // ISO date string
    updated_at: string;          // ISO date string
    
    // Additional calculated fields
    questions_count?: number;
}

export interface ApiJobResponse {
    id: string;
    title: string;
    description: string;
    questionsCount: number;
    createdAt: string;
    updatedAt: string;
}