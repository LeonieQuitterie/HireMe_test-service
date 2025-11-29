// ✅ Cấu trúc phù hợp với API assessment
export interface TraitScore {
  trait: string
  bert_score: number | null
  gemini_score: number | null
  ensemble_score: number
  priority: number
  confidence: number
}

export interface CandidateAssessment {
  id: number
  name: string
  email: string
  videoUrl: string
  submittedAt: string
  
  // ✅ Từ API assessment
  overall_score: number  // Thay vì averageScore
  bert_overall: number | null
  gemini_overall: number | null
  trait_scores: TraitScore[]
  recommendation: string  // "Strong candidate", "Weak candidate", etc.
  method_used: string  // "BERT only", "Gemini only", "Ensemble"
  text_length: number
  
  // ✅ Giữ lại để xử lý sau
  status: "passed" | "failed"  // Sẽ tự xử lý dựa trên overall_score
}

// ✅ Mock data với structure mới (giống API response)
export const candidates: CandidateAssessment[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    videoUrl: "https://example.com/video/john-smith",
    submittedAt: "2024-01-15",
    overall_score: 8.5,
    bert_overall: 8.3,
    gemini_overall: 8.7,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 9, gemini_score: 8, ensemble_score: 8.5, priority: 1, confidence: 0.85 },
      { trait: "Technical Knowledge", bert_score: 8, gemini_score: 9, ensemble_score: 8.5, priority: 2, confidence: 0.82 },
      { trait: "Emotional Intelligence", bert_score: 8, gemini_score: 9, ensemble_score: 8.5, priority: 3, confidence: 0.80 },
      { trait: "Communication", bert_score: 9, gemini_score: 8, ensemble_score: 8.5, priority: 4, confidence: 0.88 }
    ],
    recommendation: "Strong candidate - Recommended",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 450,
    status: "passed"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    videoUrl: "https://example.com/video/sarah-johnson",
    submittedAt: "2024-01-16",
    overall_score: 7.2,
    bert_overall: 7.0,
    gemini_overall: 7.4,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 7, gemini_score: 8, ensemble_score: 7.5, priority: 1, confidence: 0.75 },
      { trait: "Technical Knowledge", bert_score: 7, gemini_score: 7, ensemble_score: 7.0, priority: 2, confidence: 0.78 },
      { trait: "Emotional Intelligence", bert_score: 7, gemini_score: 7, ensemble_score: 7.0, priority: 3, confidence: 0.72 },
      { trait: "Communication", bert_score: 7, gemini_score: 8, ensemble_score: 7.5, priority: 4, confidence: 0.80 }
    ],
    recommendation: "Good candidate - Recommended with reservations",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 380,
    status: "passed"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@example.com",
    videoUrl: "https://example.com/video/michael-chen",
    submittedAt: "2024-01-17",
    overall_score: 5.8,
    bert_overall: 5.5,
    gemini_overall: 6.1,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 6, gemini_score: 6, ensemble_score: 6.0, priority: 1, confidence: 0.65 },
      { trait: "Technical Knowledge", bert_score: 6, gemini_score: 7, ensemble_score: 6.5, priority: 2, confidence: 0.68 },
      { trait: "Emotional Intelligence", bert_score: 5, gemini_score: 6, ensemble_score: 5.5, priority: 3, confidence: 0.60 },
      { trait: "Communication", bert_score: 6, gemini_score: 6, ensemble_score: 6.0, priority: 4, confidence: 0.62 }
    ],
    recommendation: "Average candidate - Consider for specific roles",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 290,
    status: "failed"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    videoUrl: "https://example.com/video/emily-davis",
    submittedAt: "2024-01-18",
    overall_score: 9.1,
    bert_overall: 9.0,
    gemini_overall: 9.2,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 9, gemini_score: 10, ensemble_score: 9.5, priority: 1, confidence: 0.92 },
      { trait: "Technical Knowledge", bert_score: 9, gemini_score: 9, ensemble_score: 9.0, priority: 2, confidence: 0.90 },
      { trait: "Emotional Intelligence", bert_score: 9, gemini_score: 9, ensemble_score: 9.0, priority: 3, confidence: 0.88 },
      { trait: "Communication", bert_score: 9, gemini_score: 9, ensemble_score: 9.0, priority: 4, confidence: 0.91 }
    ],
    recommendation: "Excellent candidate - Highly recommended",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 520,
    status: "passed"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@example.com",
    videoUrl: "https://example.com/video/david-wilson",
    submittedAt: "2024-01-19",
    overall_score: 6.3,
    bert_overall: 6.0,
    gemini_overall: null,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 6, gemini_score: null, ensemble_score: 6.0, priority: 1, confidence: 0.58 },
      { trait: "Technical Knowledge", bert_score: 7, gemini_score: null, ensemble_score: 7.0, priority: 2, confidence: 0.62 },
      { trait: "Emotional Intelligence", bert_score: 6, gemini_score: null, ensemble_score: 6.0, priority: 3, confidence: 0.55 },
      { trait: "Communication", bert_score: 6, gemini_score: null, ensemble_score: 6.0, priority: 4, confidence: 0.60 }
    ],
    recommendation: "Average candidate - BERT only analysis",
    method_used: "BERT only (Gemini unavailable)",
    text_length: 180,
    status: "failed"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    videoUrl: "https://example.com/video/lisa-anderson",
    submittedAt: "2024-01-20",
    overall_score: 8.7,
    bert_overall: 8.5,
    gemini_overall: 8.9,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 9, gemini_score: 9, ensemble_score: 9.0, priority: 1, confidence: 0.87 },
      { trait: "Technical Knowledge", bert_score: 8, gemini_score: 9, ensemble_score: 8.5, priority: 2, confidence: 0.85 },
      { trait: "Emotional Intelligence", bert_score: 9, gemini_score: 9, ensemble_score: 9.0, priority: 3, confidence: 0.89 },
      { trait: "Communication", bert_score: 8, gemini_score: 9, ensemble_score: 8.5, priority: 4, confidence: 0.86 }
    ],
    recommendation: "Strong candidate - Recommended",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 470,
    status: "passed"
  },
  {
    id: 7,
    name: "James Taylor",
    email: "j.taylor@example.com",
    videoUrl: "https://example.com/video/james-taylor",
    submittedAt: "2024-01-21",
    overall_score: 7.9,
    bert_overall: 7.8,
    gemini_overall: 8.0,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 8, gemini_score: 8, ensemble_score: 8.0, priority: 1, confidence: 0.79 },
      { trait: "Technical Knowledge", bert_score: 8, gemini_score: 8, ensemble_score: 8.0, priority: 2, confidence: 0.81 },
      { trait: "Emotional Intelligence", bert_score: 7, gemini_score: 8, ensemble_score: 7.5, priority: 3, confidence: 0.76 },
      { trait: "Communication", bert_score: 8, gemini_score: 8, ensemble_score: 8.0, priority: 4, confidence: 0.82 }
    ],
    recommendation: "Good candidate - Recommended",
    method_used: "Ensemble (BERT + Gemini)",
    text_length: 410,
    status: "passed"
  },
  {
    id: 8,
    name: "Jennifer Martinez",
    email: "jen.m@example.com",
    videoUrl: "https://example.com/video/jennifer-martinez",
    submittedAt: "2024-01-22",
    overall_score: 1.9,
    bert_overall: 2.0,
    gemini_overall: null,
    trait_scores: [
      { trait: "Problem-Solving", bert_score: 1, gemini_score: null, ensemble_score: 1.0, priority: 1, confidence: 0.53 },
      { trait: "Technical Knowledge", bert_score: 3, gemini_score: null, ensemble_score: 3.0, priority: 2, confidence: 0.55 },
      { trait: "Emotional Intelligence", bert_score: 2, gemini_score: null, ensemble_score: 2.0, priority: 3, confidence: 0.36 },
      { trait: "Communication", bert_score: 2, gemini_score: null, ensemble_score: 2.0, priority: 4, confidence: 0.37 }
    ],
    recommendation: "Weak candidate - Not recommended",
    method_used: "BERT only (Gemini unavailable)",
    text_length: 104,
    status: "failed"
  }
]