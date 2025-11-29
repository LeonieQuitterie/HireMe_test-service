// apps/backend/src/services/dashboard.service.ts
import { supabase } from '../config/supabase';

export interface TraitScore {
    trait: string;
    bert_score: number | null;
    gemini_score: number | null;
    ensemble_score: number;
    priority: number;
    confidence: number;
}

export interface CandidateAssessment {
    id: string;
    name: string;
    email: string;
    videoUrl: string;
    submittedAt: string;
    overall_score: number;
    bert_overall: number | null;
    gemini_overall: number | null;
    trait_scores: TraitScore[];
    recommendation: string;
    method_used: string;
    text_length: number;
    status: 'passed' | 'failed';
}

export class DashboardService {
    /**
     * Lấy tất cả candidates của 1 test với assessment scores
     */
    static async getTestDashboard(testId: string): Promise<CandidateAssessment[]> {
        // Query: Join test_submissions + users + submission_scores
        const { data, error } = await supabase
            .from('test_submissions')
            .select(`
                id,
                submitted_at,
                candidate_id,
                users!candidate_id (
                    id,
                    full_name,
                    email
                ),
                submission_scores (
                    avg_overall_score,
                    avg_bert_score,
                    avg_gemini_score,
                    avg_trait_scores,
                    total_text_length,
                    final_recommendation,
                    pass_fail_status
                )
            `)
            .eq('test_id', testId)
            .not('submitted_at', 'is', null)
            .order('submitted_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch dashboard: ${error.message}`);
        }

        if (!data) {
            return [];
        }

        // Map to CandidateAssessment format
        const candidates: CandidateAssessment[] = data.map((submission: any) => {
            const user = submission.users;
            const scores = submission.submission_scores;

            // return {
            //     id: user?.id || '',
            //     name: user?.full_name || 'Unknown',
            //     email: user?.email || '',
            //     videoUrl: '', // TODO: Lấy video đầu tiên nếu cần
            //     submittedAt: submission.submitted_at?.split('T')[0] || '',
            //     overall_score: scores?.avg_overall_score || 0,
            //     bert_overall: scores?.avg_bert_score || null,
            //     gemini_overall: scores?.avg_gemini_score || null,
            //     trait_scores: scores?.avg_trait_scores || [],
            //     recommendation: scores?.final_recommendation || 'Not assessed',
            //     method_used: this.determineMethodUsed(scores),
            //     text_length: scores?.total_text_length || 0,
            //     status: scores?.pass_fail_status === 'passed' ? 'passed' : 'failed'
            // };

            return {
                id: user?.id || '',
                name: user?.full_name || 'Unknown',
                email: user?.email || '',
                videoUrl: '', // TODO: Lấy video đầu tiên nếu cần
                submittedAt: submission.submitted_at?.split('T')[0] || '',
                overall_score: (scores?.avg_overall_score || 0) * 2,
                bert_overall: (scores?.avg_bert_score || 0) * 2,
                gemini_overall: (scores?.avg_gemini_score || 0) * 2,
                trait_scores: scores?.avg_trait_scores?.map((ts: TraitScore) => ({
                    ...ts,
                    bert_score: ts.bert_score != null ? ts.bert_score * 2 : null,
                    gemini_score: ts.gemini_score != null ? ts.gemini_score * 2 : null,
                    ensemble_score: ts.ensemble_score * 2
                })) || [],

                recommendation: scores?.final_recommendation || 'Not assessed',
                method_used: this.determineMethodUsed(scores),
                text_length: scores?.total_text_length || 0,
                status: scores?.pass_fail_status === 'passed' ? 'passed' : 'failed'
            };

        });

        return candidates;
    }

    /**
     * Determine method used (majority method)
     * TODO: Có thể enhance bằng cách lưu method_counts trong submission_scores
     */
    private static determineMethodUsed(scores: any): string {
        if (!scores) return 'Not assessed';

        // Nếu có cả BERT và Gemini scores
        if (scores.avg_bert_score && scores.avg_gemini_score) {
            return 'Ensemble (BERT + Gemini)';
        } else if (scores.avg_bert_score) {
            return 'BERT only (Gemini unavailable)';
        } else if (scores.avg_gemini_score) {
            return 'Gemini only (BERT unavailable)';
        }

        return 'Not assessed';
    }

    /**
     * Get dashboard stats
     */
    static async getTestStats(testId: string) {
        const candidates = await this.getTestDashboard(testId);

        const assessedCandidates = candidates.filter(c => c.overall_score > 0);

        return {
            total_candidates: candidates.length,
            assessed_candidates: assessedCandidates.length,
            passed_count: candidates.filter(c => c.status === 'passed').length,
            failed_count: candidates.filter(c => c.status === 'failed').length,
            avg_score: assessedCandidates.length > 0
                ? assessedCandidates.reduce((sum, c) => sum + c.overall_score, 0) / assessedCandidates.length
                : null,
            highest_score: assessedCandidates.length > 0
                ? Math.max(...assessedCandidates.map(c => c.overall_score))
                : null,
            lowest_score: assessedCandidates.length > 0
                ? Math.min(...assessedCandidates.map(c => c.overall_score))
                : null
        };
    }
}