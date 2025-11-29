// src/services/candidate-big-five.service.ts
import { supabase } from '../config/supabase';

export class CandidateBigFiveService {
  static async getByCandidateAndTest(candidateId: string, testId: string) {
    const { data, error } = await supabase
      .from('personality_scores')
      .select(`
        submission_id,
        openness,
        conscientiousness,
        extraversion,
        agreeableness,
        neuroticism,
        total_videos_analyzed,
        analyzed_at,
        analysis_version,
        test_submission:test_submissions!submission_id (
          candidate:users!candidate_id (
            id,
            full_name,
            email
          )
        )
      `)
      .eq('test_submission.test_id', testId)
      .eq('test_submission.candidate_id', candidateId)
      .single();

    if (error || !data) return null;

    const rawSubmission = (data as any).test_submission;
    const submission = Array.isArray(rawSubmission) ? rawSubmission[0] : rawSubmission;
    const rawCandidate = submission?.candidate;
    const candidate = Array.isArray(rawCandidate) ? rawCandidate[0] : rawCandidate;

    if (!candidate) return null;

    return {
      candidate: {
        id: candidate.id,
        name: candidate.full_name || 'Chưa đặt tên',
        email: candidate.email || 'N/A',
      },
      personality: {
        submission_id: data.submission_id,
        openness: data.openness ? Number(data.openness.toFixed(4)) : null,
        conscientiousness: data.conscientiousness ? Number(data.conscientiousness.toFixed(4)) : null,
        extraversion: data.extraversion ? Number(data.extraversion.toFixed(4)) : null,
        agreeableness: data.agreeableness ? Number(data.agreeableness.toFixed(4)) : null,
        neuroticism: data.neuroticism ? Number(data.neuroticism.toFixed(4)) : null,
        total_videos_analyzed: data.total_videos_analyzed || 0,
        analyzed_at: data.analyzed_at,
        analysis_version: data.analysis_version || 'unknown',
      },
    };
  }

  static async getSubmissionScores(candidateId: string, testId: string) {
    const { data, error } = await supabase
      .from('submission_scores')
      .select(`
        id,
        submission_id,
        avg_overall_score,
        avg_bert_score,
        avg_gemini_score,
        avg_trait_scores,
        total_answers,
        assessed_answers,
        total_text_length,
        final_recommendation,
        pass_fail_status,
        created_at,
        updated_at,
        test_submission:test_submissions!submission_id (
          candidate:users!candidate_id (
            id,
            full_name,
            email
          )
        )
      `)
      .eq('test_submission.test_id', testId)
      .eq('test_submission.candidate_id', candidateId)
      .single();

    if (error || !data) return null;

    const rawSubmission = (data as any).test_submission;
    const submission = Array.isArray(rawSubmission) ? rawSubmission[0] : rawSubmission;
    const candidateRaw = submission?.candidate;
    const candidate = Array.isArray(candidateRaw) ? candidateRaw[0] : candidateRaw;

    if (!candidate) return null;

    return {
      candidate: {
        id: candidate.id,
        name: candidate.full_name || 'Chưa đặt tên',
        email: candidate.email || 'N/A',
      },
      scores: {
        submission_id: data.submission_id,
        avg_overall_score: data.avg_overall_score ? Number(data.avg_overall_score.toFixed(2)) : null,
        avg_bert_score: data.avg_bert_score ? Number(data.avg_bert_score.toFixed(2)) : null,
        avg_gemini_score: data.avg_gemini_score ? Number(data.avg_gemini_score.toFixed(2)) : null,
        avg_trait_scores: data.avg_trait_scores || [],
        total_answers: data.total_answers,
        assessed_answers: data.assessed_answers,
        total_text_length: data.total_text_length,
        final_recommendation: data.final_recommendation || 'Not assessed yet',
        pass_fail_status: data.pass_fail_status || 'pending',
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    };
  }
}

// ĐÓNG CLASS ĐÚNG CHỖ NÀY