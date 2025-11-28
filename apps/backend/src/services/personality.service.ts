// apps/backend/src/services/personality.service.ts

import { supabase } from '../config/supabase';
import FormData from 'form-data';
import fetch from 'node-fetch';

interface PersonalityScores {
    Openness: number;
    Conscientiousness: number;
    Extraversion: number;
    Agreeableness: number;
    Neuroticism: number;
}

interface PredictResponse {
    status: string;
    scores: PersonalityScores;
}

export class PersonalityService {
    /**
     * Gọi API predict và lưu kết quả cho 1 video
     * KHÔNG THROW ERROR - chỉ log và update status
     */
    static async processAnswer(answerId: string, videoUrl: string): Promise<void> {
        try {
            console.log(`🔍 Starting personality analysis for answer ${answerId}`);

            // 1. Update status = 'processing'
            await supabase
                .from('submission_answers')
                .update({ personality_analysis_status: 'processing' })
                .eq('id', answerId);

            // 2. Tải video về
            console.log(`📥 Downloading video: ${videoUrl}`);
            const videoResponse = await fetch(videoUrl);
            
            if (!videoResponse.ok) {
                throw new Error(`Failed to download video: ${videoResponse.status}`);
            }

            const videoBuffer = await videoResponse.buffer();

            // 3. Tạo FormData và gửi file
            const formData = new FormData();
            formData.append('file', videoBuffer, {
                filename: 'video.mp4',
                contentType: 'video/mp4',
            });

            // 4. Gọi API predict với multipart/form-data
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(), // Tự động set Content-Type: multipart/form-data
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`❌ API Error ${response.status}:`, errorBody);
                throw new Error(`API returned status ${response.status}`);
            }

            // 5. Parse response
            const result = await response.json() as PredictResponse;

            if (result.status !== 'success' || !result.scores) {
                throw new Error('API returned invalid response');
            }

            // 6. Lưu scores vào DB
            const { error: updateErr } = await supabase
                .from('submission_answers')
                .update({
                    openness: result.scores.Openness,
                    conscientiousness: result.scores.Conscientiousness,
                    extraversion: result.scores.Extraversion,
                    agreeableness: result.scores.Agreeableness,
                    neuroticism: result.scores.Neuroticism,
                    personality_analyzed_at: new Date().toISOString(),
                    personality_analysis_status: 'completed',
                })
                .eq('id', answerId);

            if (updateErr) throw updateErr;

            console.log(`✅ Personality analysis completed for answer ${answerId}`);

            // 7. Kiểm tra xem đã xong hết chưa → tính điểm trung bình
            await this.checkAndCalculateFinalScores(answerId);

        } catch (error) {
            console.error(`❌ Personality analysis failed for ${answerId}:`, error);

            // Update status = 'failed'
            await supabase
                .from('submission_answers')
                .update({ personality_analysis_status: 'failed' })
                .eq('id', answerId);
        }
    }

    /**
     * Kiểm tra xem tất cả videos đã analyze xong chưa
     * Nếu xong → tính trung bình và lưu vào personality_scores
     */
    private static async checkAndCalculateFinalScores(answerId: string): Promise<void> {
        try {
            // 1. Lấy submission_id
            const { data: answer } = await supabase
                .from('submission_answers')
                .select('submission_id')
                .eq('id', answerId)
                .single();

            if (!answer) return;

            const submissionId = answer.submission_id;

            // 2. Đếm tổng số videos và số videos đã completed
            const { data: allAnswers } = await supabase
                .from('submission_answers')
                .select('personality_analysis_status')
                .eq('submission_id', submissionId);

            if (!allAnswers) return;

            const total = allAnswers.length;
            const completed = allAnswers.filter(
                a => a.personality_analysis_status === 'completed'
            ).length;

            console.log(`📊 Submission ${submissionId}: ${completed}/${total} videos analyzed`);

            // 3. Nếu chưa xong hết → return
            if (completed !== total) return;

            // 4. Tính điểm trung bình
            const { data: scores } = await supabase
                .from('submission_answers')
                .select('openness, conscientiousness, extraversion, agreeableness, neuroticism')
                .eq('submission_id', submissionId)
                .eq('personality_analysis_status', 'completed');

            if (!scores || scores.length === 0) return;

            const calculateAvg = (field: keyof typeof scores[0]) => {
                const values = scores.map(s => s[field]).filter(v => v !== null) as number[];
                return values.reduce((sum, v) => sum + v, 0) / values.length;
            };

            // 5. Lưu vào personality_scores
            await supabase.from('personality_scores').insert({
                submission_id: submissionId,
                openness: calculateAvg('openness'),
                conscientiousness: calculateAvg('conscientiousness'),
                extraversion: calculateAvg('extraversion'),
                agreeableness: calculateAvg('agreeableness'),
                neuroticism: calculateAvg('neuroticism'),
                total_videos_analyzed: total,
                analysis_version: 'v1.0',
            });

            // 6. Update submission status
            await supabase
                .from('test_submissions')
                .update({ scoring_status: 'completed' })
                .eq('id', submissionId);

            console.log(`🎉 Final personality scores saved for submission ${submissionId}`);

        } catch (error) {
            console.error('Error calculating final scores:', error);
        }
    }
}