// services/test-question.service.ts
import { supabase } from '../config/supabase';

export class TestQuestionService {
    static async getTestWithQuestions(testId: string) {
        // Lấy test info
        const { data: test, error: testError } = await supabase
            .from('tests')
            .select('id, title, time_limit_minutes, pass_score, status')
            .eq('id', testId)
            .single();

            console.log('Supabase test error:', testError);

        if (testError || !test) {
            return {
                success: false,
                status: 404,
                message: 'Test not found',
            };
        }

        // Lấy questions
        const { data: questions, error: questionsError } = await supabase
            .from('test_questions')
            .select('id, question_text, "order"')
            .eq('test_id', testId)
            .order('order', { ascending: true });

        if (questionsError) {
            return {
                success: false,
                status: 400,
                message: questionsError.message,
            };
        }

        return {
            success: true,
            status: 200,
            message: 'Test questions retrieved successfully',
            data: {
                test,
                questions: questions || [],
            },
        };
    }
}