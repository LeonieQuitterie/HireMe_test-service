// backend/src/services/transcription.service.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase';
import os from 'os';

const execAsync = promisify(exec);
interface AIAssessmentResult {
    overall_score: number;
    bert_overall: number | null;
    gemini_overall: number | null;
    trait_scores: any[];
    recommendation: string;
    method_used: string;
    text_length: number;
}


export class TranscriptionService {
    private static tempDir: string = path.join(os.tmpdir(), 'whisper');
    private static whisperModel: string = 'base';

    private static init() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    private static async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
        console.log(`📥 Downloading video: ${videoUrl}`);
        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(outputPath, buffer);
        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        console.log(`✅ Downloaded ${sizeMB}MB`);
    }

    private static async runWhisper(videoPath: string): Promise<string> {
        console.log(`🎙️ Running Whisper...`);
        const outputDir = path.dirname(videoPath);
        const videoName = path.basename(videoPath, path.extname(videoPath));

        try {
            const command = `whisper "${videoPath}" --model ${this.whisperModel} --language en --output_format txt --output_dir "${outputDir}"`;
            const startTime = Date.now();
            const { stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 10,
                shell: os.platform() === 'win32' ? 'cmd.exe' : undefined
            });
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            if (stderr) console.log('Whisper output:', stderr);

            const transcriptPath = path.join(outputDir, `${videoName}.txt`);
            if (!fs.existsSync(transcriptPath)) {
                throw new Error('Transcript file not created');
            }
            const transcript = fs.readFileSync(transcriptPath, 'utf-8');
            console.log(`✅ Transcribed in ${duration}s (${transcript.length} chars)`);
            return transcript.trim();
        } catch (error: any) {
            console.error('❌ Whisper error:', error.message);
            throw error;
        }
    }

    private static cleanup(...filePaths: string[]): void {
        for (const filePath of filePaths) {
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (error) {
                console.error(`Cleanup error:`, error);
            }
        }
    }

    static async transcribeVideo(videoUrl: string): Promise<string> {
        this.init();
        const timestamp = Date.now();
        const videoPath = path.join(this.tempDir, `video-${timestamp}.mp4`);
        const transcriptPath = path.join(this.tempDir, `video-${timestamp}.txt`);

        try {
            console.log('\n========== TRANSCRIPTION START ==========');
            await this.downloadVideo(videoUrl, videoPath);
            const transcript = await this.runWhisper(videoPath);
            this.cleanup(videoPath, transcriptPath);
            console.log('========== TRANSCRIPTION COMPLETE ==========\n');
            return transcript;
        } catch (error) {
            console.error('========== TRANSCRIPTION FAILED ==========\n');
            this.cleanup(videoPath, transcriptPath);
            throw error;
        }
    }

    /**
     * ✅ UPDATED: Process 1 answer - transcribe và GỌI ASSESS
     */
    static async processAnswer(answerId: string, videoUrl: string): Promise<void> {
        console.log(`\n🎬 Processing answer: ${answerId}`);

        try {
            // 1. Update status → processing
            await supabase
                .from('submission_answers')
                .update({ transcript_status: 'processing' })
                .eq('id', answerId);

            // 2. Transcribe
            const transcript = await this.transcribeVideo(videoUrl);

            if (!transcript || transcript.length === 0) {
                throw new Error('Empty transcript');
            }

            // 3. Save transcript to DB
            const { error } = await supabase
                .from('submission_answers')
                .update({
                    transcript: transcript,
                    transcript_status: 'completed'
                })
                .eq('id', answerId);

            if (error) throw error;

            console.log(`✅ Saved transcript: "${transcript.substring(0, 100)}..."`);

            // 4. ✅ GỌI ASSESS NGAY SAU KHI TRANSCRIPT XONG
            console.log(`🤖 Starting AI assessment...`);
            await this.assessAnswer(answerId);

        } catch (error: any) {
            console.error(`❌ Failed:`, error.message);
            await supabase
                .from('submission_answers')
                .update({ transcript_status: 'failed' })
                .eq('id', answerId);
            throw error;
        }
    }

    /**
     * ✅ NEW: Assess answer - ghép question + transcript → gọi AI API
     */
    private static async assessAnswer(answerId: string): Promise<void> {
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
     * ✅ NEW: Tính điểm trung bình cho submission
     */
    private static async recalculateSubmissionScores(submissionId: string): Promise<void> {
        // 1. Lấy submission info
        const { data: submission } = await supabase
            .from('test_submissions')
            .select('test_id, candidate_id')
            .eq('id', submissionId)
            .single();

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
            if (!traitGroups[trait.trait]) traitGroups[trait.trait] = [];
            traitGroups[trait.trait].push(trait);
        });

        const avgTraitScores = Object.entries(traitGroups).map(([traitName, traits]: [string, any]) => ({
            trait: traitName,
            ensemble_score: Math.round(traits.reduce((sum: number, t: any) => sum + t.ensemble_score, 0) / traits.length * 100) / 100,
            confidence: Math.round(traits.reduce((sum: number, t: any) => sum + t.confidence, 0) / traits.length * 1000) / 1000,
            priority: traits[0].priority
        })).sort((a, b) => a.priority - b.priority);

        // 5. Determine recommendation
        let finalRecommendation = '';
        if (avgOverall >= 9.0) finalRecommendation = 'Excellent candidate - Highly recommended';
        else if (avgOverall >= 8.0) finalRecommendation = 'Strong candidate - Recommended';
        else if (avgOverall >= 7.0) finalRecommendation = 'Good candidate - Recommended';
        else if (avgOverall >= 6.0) finalRecommendation = 'Average candidate - Consider for specific roles';
        else finalRecommendation = 'Weak candidate - Not recommended';

        // 6. Get pass_score
        const { data: test } = await supabase
            .from('tests')
            .select('pass_score')
            .eq('id', submission?.test_id)
            .single();

        const passFailStatus = avgOverall >= (test?.pass_score || 6) ? 'passed' : 'failed';

        // 7. Get total answers
        const { count: totalAnswers } = await supabase
            .from('submission_answers')
            .select('*', { count: 'exact', head: true })
            .eq('submission_id', submissionId);

        // 8. Upsert submission_scores
        await supabase
            .from('submission_scores')
            .upsert({
                submission_id: submissionId,
                candidate_id: submission?.candidate_id,
                test_id: submission?.test_id,
                avg_overall_score: Math.round(avgOverall * 100) / 100,
                avg_bert_score: Math.round(avgBert * 100) / 100,
                avg_gemini_score: Math.round(avgGemini * 100) / 100,
                avg_trait_scores: avgTraitScores,
                total_answers: totalAnswers || 0,
                assessed_answers: answers.length,
                total_text_length: answers.reduce((sum, a) => sum + (a.text_length || 0), 0),
                final_recommendation: finalRecommendation,
                pass_fail_status: passFailStatus,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'submission_id'
            });

        console.log(`✅ Updated submission_scores: ${avgOverall.toFixed(2)}/10 - ${passFailStatus}`);
    }

    // Các function khác giữ nguyên...
    static async processPendingAnswers(limit: number = 10): Promise<void> {
        this.init();
        console.log(`\n🔄 Processing pending answers (limit: ${limit})...`);

        const { data: pendingAnswers, error } = await supabase
            .from('submission_answers')
            .select('id, video_url')
            .eq('transcript_status', 'pending')
            .not('video_url', 'is', null)
            .limit(limit);

        if (error) {
            console.error('Fetch error:', error);
            return;
        }

        if (!pendingAnswers || pendingAnswers.length === 0) {
            console.log('✨ No pending answers');
            return;
        }

        console.log(`📋 Found ${pendingAnswers.length} pending answer(s)`);

        for (let i = 0; i < pendingAnswers.length; i++) {
            const answer = pendingAnswers[i];
            console.log(`\n[${i + 1}/${pendingAnswers.length}]`);

            try {
                await this.processAnswer(answer.id, answer.video_url);

                if (i < pendingAnswers.length - 1) {
                    console.log('⏳ Waiting 2s...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (error) {
                console.error(`Failed, continuing...`);
            }
        }

        console.log('\n✅ Batch completed\n');
    }

    static async getStats() {
        const { data, error } = await supabase
            .from('submission_answers')
            .select('transcript_status')
            .not('video_url', 'is', null);

        if (error || !data) return null;

        return {
            total: data.length,
            pending: data.filter(a => a.transcript_status === 'pending').length,
            processing: data.filter(a => a.transcript_status === 'processing').length,
            completed: data.filter(a => a.transcript_status === 'completed').length,
            failed: data.filter(a => a.transcript_status === 'failed').length,
        };
    }
}