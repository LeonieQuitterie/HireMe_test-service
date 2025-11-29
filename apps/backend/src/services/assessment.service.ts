// backend/src/services/assessment.service.ts
import { supabase } from '../config/supabase';

interface AIAssessmentResult {
    overall_score: number;
    bert_overall: number | null;
    gemini_overall: number | null;
    trait_scores: any[];
    recommendation: string;
    method_used: string;
    text_length: number;
}

export class AssessmentService {
    /**
     * Assess 1 answer - ghép question + transcript → gọi AI API
     */
    static async assessAnswer(answerId: string): Promise<void> {
        try {
            // 1. Lấy question_text và transcript
            const { data: answer } = await supabase
                .from('submission_answers')
                .select(`
                    id,
                    transcript,
                    submission_id,
                    test_questions!inner(question_text)
                `)
                .eq('id', answerId)
                .single();

            if (!answer?.transcript) {
                throw new Error('Transcript not available');
            }

            // 2. Ghép câu hỏi + trả lời
            const questionText = (answer.test_questions as any)[0]?.question_text || '';
            const text = `Question: ${questionText}\n\nResponse: ${answer.transcript}`;

            console.log(`🤖 Calling AI API for answer ${answerId}...`);

            // 3. Gọi AI API
            const response = await fetch('http://localhost:9000/assess-bert-only', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    include_confidence: true,
                    use_ensemble: true
                })
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.statusText}`);
            }

           const result = await response.json() as AIAssessmentResult;

            console.log(`✅ AI Assessment: ${result.overall_score}/10 - ${result.recommendation}`);

            // 4. Lưu kết quả assessment
            await supabase
                .from('submission_answers')
                .update({
                    overall_score: result.overall_score,
                    bert_overall: result.bert_overall,
                    gemini_overall: result.gemini_overall,
                    trait_scores: result.trait_scores,
                    recommendation: result.recommendation,
                    method_used: result.method_used,
                    text_length: result.text_length,
                    assessed_at: new Date().toISOString()
                })
                .eq('id', answerId);

            // 5. Tính lại submission_scores
            await this.recalculateSubmissionScores(answer.submission_id);

            console.log(`✅ Assessment completed for answer ${answerId}`);

        } catch (error: any) {
            console.error(`❌ Assessment failed:`, error.message);
            throw error;
        }
    }

    /**
     * Tính điểm trung bình cho submission
     */
    static async recalculateSubmissionScores(submissionId: string): Promise<void> {
        try {
            // 1. Lấy submission info
            const { data: submission } = await supabase
                .from('test_submissions')
                .select('test_id, candidate_id')
                .eq('id', submissionId)
                .single();

            if (!submission) {
                throw new Error('Submission not found');
            }

            // 2. Lấy tất cả answers đã assess
            const { data: answers } = await supabase
                .from('submission_answers')
                .select('overall_score, bert_overall, gemini_overall, trait_scores, text_length')
                .eq('submission_id', submissionId)
                .not('assessed_at', 'is', null);

            if (!answers || answers.length === 0) {
                console.log('⏳ No assessed answers yet');
                return;
            }

            // 3. Tính trung bình scores
            const avgOverall = answers.reduce((sum, a) => sum + (a.overall_score || 0), 0) / answers.length;
            const avgBert = answers.reduce((sum, a) => sum + (a.bert_overall || 0), 0) / answers.length;
            const avgGemini = answers.reduce((sum, a) => sum + (a.gemini_overall || 0), 0) / answers.length;

            // 4. Tính trung bình traits
            const allTraits = answers.flatMap(a => a.trait_scores || []);
            const traitGroups: any = {};
            
            allTraits.forEach((trait: any) => {
                if (!traitGroups[trait.trait]) {
                    traitGroups[trait.trait] = [];
                }
                traitGroups[trait.trait].push(trait);
            });

            const avgTraitScores = Object.entries(traitGroups).map(([traitName, traits]: [string, any]) => {
                const avgEnsemble = traits.reduce((sum: number, t: any) => sum + t.ensemble_score, 0) / traits.length;
                const avgConfidence = traits.reduce((sum: number, t: any) => sum + t.confidence, 0) / traits.length;
                
                return {
                    trait: traitName,
                    ensemble_score: Math.round(avgEnsemble * 100) / 100,
                    confidence: Math.round(avgConfidence * 1000) / 1000,
                    priority: traits[0].priority
                };
            }).sort((a, b) => a.priority - b.priority);

            // 5. Tính total text length
            const totalTextLength = answers.reduce((sum, a) => sum + (a.text_length || 0), 0);

            // 6. Determine recommendation
            let finalRecommendation = '';
            if (avgOverall >= 9.0) {
                finalRecommendation = 'Excellent candidate - Highly recommended';
            } else if (avgOverall >= 8.0) {
                finalRecommendation = 'Strong candidate - Recommended';
            } else if (avgOverall >= 7.0) {
                finalRecommendation = 'Good candidate - Recommended';
            } else if (avgOverall >= 6.0) {
                finalRecommendation = 'Average candidate - Consider for specific roles';
            } else {
                finalRecommendation = 'Weak candidate - Not recommended';
            }

            // 7. Get pass_score từ test
            const { data: test } = await supabase
                .from('tests')
                .select('pass_score')
                .eq('id', submission.test_id)
                .single();

            const passFailStatus = avgOverall >= (test?.pass_score || 6) ? 'passed' : 'failed';

            // 8. Get total answers count
            const { count: totalAnswers } = await supabase
                .from('submission_answers')
                .select('*', { count: 'exact', head: true })
                .eq('submission_id', submissionId);

            // 9. Upsert vào submission_scores
            const { error } = await supabase
                .from('submission_scores')
                .upsert({
                    submission_id: submissionId,
                    candidate_id: submission.candidate_id,
                    test_id: submission.test_id,
                    avg_overall_score: Math.round(avgOverall * 100) / 100,
                    avg_bert_score: Math.round(avgBert * 100) / 100,
                    avg_gemini_score: Math.round(avgGemini * 100) / 100,
                    avg_trait_scores: avgTraitScores,
                    total_answers: totalAnswers || 0,
                    assessed_answers: answers.length,
                    total_text_length: totalTextLength,
                    final_recommendation: finalRecommendation,
                    pass_fail_status: passFailStatus,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'submission_id'
                });

            if (error) {
                throw error;
            }

            console.log(`✅ Updated submission_scores: ${avgOverall.toFixed(2)}/10 - ${passFailStatus}`);

        } catch (error: any) {
            console.error(`❌ Recalculate failed:`, error.message);
            throw error;
        }
    }
}