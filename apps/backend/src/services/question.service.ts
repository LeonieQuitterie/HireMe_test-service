// src/services/question.service.ts
import { supabase } from '../lib/supabase';
import { CreateQuestionDTO } from '../types';

export class QuestionService {
  async createQuestion(data: CreateQuestionDTO) {
    const { test_id, question_text, question_order } = data;

    const { data: newQuestion, error } = await supabase
      .from('questions')
      .insert([{ test_id, question_text, question_order }])
      .select()
      .single();

    if (error) throw error;
    return newQuestion;
  }

  async createMultipleQuestions(testId: string, questions: { question_text: string; question_order: number }[]) {
    const questionsData = questions.map(q => ({
      test_id: testId,
      ...q
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(questionsData)
      .select();

    if (error) throw error;
    return data;
  }

  async getQuestionsByTest(testId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_order', { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateQuestion(questionId: string, data: Partial<CreateQuestionDTO>) {
    const { data: updatedQuestion, error } = await supabase
      .from('questions')
      .update(data)
      .eq('id', questionId)
      .select()
      .single();

    if (error) throw error;
    return updatedQuestion;
  }

  async deleteQuestion(questionId: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) throw error;
    return { message: 'Question deleted successfully' };
  }
}