export interface Candidate {
  id: string
  name: string
  email: string
  videoUrl: string
  submittedAt: string
  scores: {
    confidence: number
    bodyLanguage: number
    eyeContact: number
    speechClarity: number
    pace: number
    energy: number
    openness: number // Thêm Big Five traits
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  nlpAnalysis: {
    vocabulary: number
    prosody: number
    clarity: number
    fluency: number
    confidence: number
    energy: number
  }
  emotions: {
    happy: number
    sad: number
    anxious: number
    stressed: number
    neutral: number
  }
  status: "passed" | "failed"
  averageScore: number
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    videoUrl: "https://example.com/video/sarah-johnson",
    submittedAt: "2025-01-05",
    scores: {
      confidence: 9.2,
      bodyLanguage: 8.8,
      eyeContact: 9.0,
      speechClarity: 8.5,
      pace: 8.7,
      energy: 9.1,
      openness: 8.8, // Derived: (speechClarity + energy) / 2
      conscientiousness: 8.7, // pace
      extraversion: 9.15, // (confidence + energy) / 2
      agreeableness: 8.9, // (eyeContact + bodyLanguage) / 2
      neuroticism: 1.0, // 10 - (confidence + bodyLanguage) / 2 (inverted for stability)
    },
    nlpAnalysis: {
      vocabulary: 8.9,
      prosody: 8.6,
      clarity: 8.8,
      fluency: 9.0,
      confidence: 9.1,
      energy: 8.7,
    },
    emotions: {
      happy: 45,
      sad: 5,
      anxious: 10,
      stressed: 8,
      neutral: 32,
    },
    status: "passed",
    averageScore: 8.88,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    videoUrl: "https://example.com/video/michael-chen",
    submittedAt: "2025-01-07",
    scores: {
      confidence: 7.8,
      bodyLanguage: 7.5,
      eyeContact: 8.0,
      speechClarity: 7.9,
      pace: 7.6,
      energy: 7.7,
      openness: 7.8, // Derived: (speechClarity + energy) / 2
      conscientiousness: 7.6, // pace
      extraversion: 7.75, // (confidence + energy) / 2
      agreeableness: 7.75, // (eyeContact + bodyLanguage) / 2
      neuroticism: 2.35, // 10 - (confidence + bodyLanguage) / 2
    },
    nlpAnalysis: {
      vocabulary: 8.2,
      prosody: 7.8,
      clarity: 7.9,
      fluency: 8.0,
      confidence: 7.7,
      energy: 7.5,
    },
    emotions: {
      happy: 30,
      sad: 8,
      anxious: 22,
      stressed: 15,
      neutral: 25,
    },
    status: "passed",
    averageScore: 7.75,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    videoUrl: "https://example.com/video/emily-rodriguez",
    submittedAt: "2025-01-08",
    scores: {
      confidence: 9.5,
      bodyLanguage: 9.3,
      eyeContact: 9.7,
      speechClarity: 9.2,
      pace: 9.0,
      energy: 9.4,
      openness: 9.3, // Derived: (speechClarity + energy) / 2
      conscientiousness: 9.0, // pace
      extraversion: 9.45, // (confidence + energy) / 2
      agreeableness: 9.5, // (eyeContact + bodyLanguage) / 2
      neuroticism: 0.7, // 10 - (confidence + bodyLanguage) / 2
    },
    nlpAnalysis: {
      vocabulary: 9.3,
      prosody: 9.1,
      clarity: 9.4,
      fluency: 9.5,
      confidence: 9.6,
      energy: 9.2,
    },
    emotions: {
      happy: 55,
      sad: 3,
      anxious: 5,
      stressed: 4,
      neutral: 33,
    },
    status: "passed",
    averageScore: 9.35,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    videoUrl: "https://example.com/video/david-kim",
    submittedAt: "2025-01-09",
    scores: {
      confidence: 5.8,
      bodyLanguage: 6.2,
      eyeContact: 5.5,
      speechClarity: 6.0,
      pace: 5.9,
      energy: 5.7,
      openness: 5.85, // Derived: (speechClarity + energy) / 2
      conscientiousness: 5.9, // pace
      extraversion: 5.75, // (confidence + energy) / 2
      agreeableness: 5.85, // (eyeContact + bodyLanguage) / 2
      neuroticism: 4.0, // 10 - (confidence + bodyLanguage) / 2
    },
    nlpAnalysis: {
      vocabulary: 6.5,
      prosody: 6.0,
      clarity: 6.2,
      fluency: 6.3,
      confidence: 5.9,
      energy: 5.8,
    },
    emotions: {
      happy: 15,
      sad: 12,
      anxious: 35,
      stressed: 28,
      neutral: 10,
    },
    status: "failed",
    averageScore: 5.85,
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@email.com",
    videoUrl: "https://example.com/video/jessica-martinez",
    submittedAt: "2025-01-10",
    scores: {
      confidence: 8.5,
      bodyLanguage: 8.3,
      eyeContact: 8.7,
      speechClarity: 8.4,
      pace: 8.2,
      energy: 8.6,
      openness: 8.5, // Derived: (speechClarity + energy) / 2
      conscientiousness: 8.2, // pace
      extraversion: 8.55, // (confidence + energy) / 2
      agreeableness: 8.5, // (eyeContact + bodyLanguage) / 2
      neuroticism: 1.7, // 10 - (confidence + bodyLanguage) / 2
    },
    nlpAnalysis: {
      vocabulary: 8.6,
      prosody: 8.4,
      clarity: 8.5,
      fluency: 8.7,
      confidence: 8.5,
      energy: 8.3,
    },
    emotions: {
      happy: 42,
      sad: 6,
      anxious: 12,
      stressed: 10,
      neutral: 30,
    },
    status: "passed",
    averageScore: 8.45,
  },
]

export const systemAverageScore = 8.06

export const testQuestions = [
  {
    id: 1,
    question: "Tell us about yourself and your professional background.",
    duration: 120,
  },
  {
    id: 2,
    question: "Describe a challenging situation you faced at work and how you handled it.",
    duration: 120,
  },
  {
    id: 3,
    question: "What are your greatest strengths and how do they apply to this role?",
    duration: 120,
  },
  {
    id: 4,
    question: "Where do you see yourself in five years?",
    duration: 120,
  },
]
