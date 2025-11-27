export interface SubmitTestRequest {
  testId: string;
  answers: {
    questionId: string;
    durationSeconds?: number;
  }[];
}

export interface SubmitTestResponse {
  success: boolean;
  data?: {
    submissionId: string;
    answers: {
      id: string;
      questionId: string;
      videoUrl: string;
    }[];
  };
  message?: string;
}