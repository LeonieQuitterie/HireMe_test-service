// src/services/result.service.ts
import { supabase } from '../lib/supabase';
import { TestResultDTO } from '../types';

export class ResultService {
  async saveResult(data: TestResultDTO) {
    const {
      attempt_id,
      openness_score,
      conscientiousness_score,
      extraversion_score,
      neuroticism_score,
      agreeableness_score
    } = data;

    // Calculate total score (average of 5 criteria)
    const total_score = (
      openness_score +
      conscientiousness_score +
      extraversion_score +
      neuroticism_score +
      agreeableness_score
    ) / 5;

    // Save detailed result
    const { data: result, error: resultError } = await supabase
      .from('test_results')
      .insert([{
        attempt_id,
        openness_score,
        conscientiousness_score,
        extraversion_score,
        neuroticism_score,
        agreeableness_score
      }])
      .select()
      .single();

    if (resultError) throw resultError;

    // Update total score in test_attempts
    const { error: attemptError } = await supabase
      .from('test_attempts')
      .update({ total_score })
      .eq('id', attempt_id);

    if (attemptError) throw attemptError;

    return result;
  }

  async getResultByAttempt(attemptId: string) {
    const { data, error } = await supabase
      .from('test_results')
      .select(`
        *,
        attempt:test_attempts(
          id,
          total_score,
          status,
          submitted_at,
          test:tests(test_name, passing_score),
          candidate:users(full_name, email)
        )
      `)
      .eq('attempt_id', attemptId)
      .single();

    if (error) throw error;
    return data;
  }

  async getTestOverview(testId: string) {
    const { data, error } = await supabase
      .from('test_overview_stats')
      .select('*')
      .eq('test_id', testId)
      .single();

    if (error) throw error;
    return data;
  }
}