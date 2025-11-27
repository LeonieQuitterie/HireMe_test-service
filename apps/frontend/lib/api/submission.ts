const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface SubmitTestPayload {
  testId: string;
  answers: {
    questionId: string;
    blob: Blob;
  }[];
}

export async function submitTest(payload: SubmitTestPayload) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  // Create FormData
  const formData = new FormData();

  // Add video files with field names matching question IDs
  payload.answers.forEach((answer) => {
    formData.append(`video_${answer.questionId}`, answer.blob, `${answer.questionId}.mp4`);
  });

  const response = await fetch(`${API_BASE_URL}/api/submissions/submit/${payload.testId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to submit test');
  }

  return result;
}