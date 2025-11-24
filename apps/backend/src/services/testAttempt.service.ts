// src/services/testAttempt.service.ts
import { supabase } from '../lib/supabase';
import { SubmitTestDTO } from '../types';

export class TestAttemptService {
  async startAttempt(testId: string, candidateId: string) {
    // Check if already attempted
    const { data: existing } = await supabase
      .from('test_attempts')
      .select('id')
      .eq('test_id', testId)
      .eq('candidate_id', candidateId)
      .single();

    if (existing) {
      throw new Error('You have already attempted this test');
    }

    const { data: attempt, error } = await supabase
      .from('test_attempts')
      .insert([{
        test_id: testId,
        candidate_id: candidateId,
        status: 'In Progress'
      }])
      .select()
      .single();

    if (error) throw error;
    return attempt;
  }

  async submitAttempt(data: SubmitTestDTO) {
    const { attempt_id, video_responses } = data;

    // Insert video responses
    const videoData = video_responses.map(vr => ({
      attempt_id,
      question_id: vr.question_id,
      video_url: vr.video_url
    }));

    const { error: videoError } = await supabase
      .from('video_responses')
      .insert(videoData);

    if (videoError) throw videoError;

    // Update attempt as submitted (trigger will calculate Pass/Fail)
    const { data: updatedAttempt, error: attemptError } = await supabase
      .from('test_attempts')
      .update({
        submitted_at: new Date().toISOString(),
        status: 'Completed'
      })
      .eq('id', attempt_id)
      .select()
      .single();

    if (attemptError) throw attemptError;
    return updatedAttempt;
  }

  async getAttemptById(attemptId: string) {
    const { data, error } = await supabase
      .from('test_attempts')
      .select(`
        *,
        test:tests(*),
        candidate:users(id, full_name, email)
      `)
      .eq('id', attemptId)
      .single();

    if (error) throw error;
    return data;
  }

  async getAttemptsByTest(testId: string) {
    const { data, error } = await supabase
      .from('test_candidates_detail')
      .select('*')
      .eq('test_id', testId);

    if (error) throw error;
    return data;
  }

  async getAttemptsByCandidate(candidateId: string) {
    const { data, error } = await supabase
      .from('test_attempts')
      .select(`
        *,
        test:tests(test_name, duration_minutes, passing_score)
      `)
      .eq('candidate_id', candidateId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getVideoResponses(attemptId: string) {
    const { data, error } = await supabase
      .from('video_responses')
      .select(`
        *,
        question:questions(question_text, question_order)
      `)
      .eq('attempt_id', attemptId)
      .order('question.question_order', { ascending: true });

    if (error) throw error;
    return data;
  }
}