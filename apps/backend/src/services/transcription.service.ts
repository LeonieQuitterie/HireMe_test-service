// backend/src/services/transcription.service.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase';
import os from 'os';

const execAsync = promisify(exec);

export class TranscriptionService {
    private static tempDir: string = path.join(os.tmpdir(), 'whisper');
    private static whisperModel: string = 'base'; // tiny, base, small, medium, large

    // Khởi tạo temp directory
    private static init() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Download video từ R2 về server
     */
    /**
     * Download video từ R2 về server
     */
    private static async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
        console.log(`📥 Downloading video: ${videoUrl}`);

        const response = await fetch(videoUrl);

        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }

        // Dùng arrayBuffer() thay vì buffer()
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(outputPath, buffer);

        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        console.log(`✅ Downloaded ${sizeMB}MB`);
    }

    /**
     * Chạy Whisper để transcribe video
     */
    private static async runWhisper(videoPath: string): Promise<string> {
        console.log(`🎙️ Running Whisper...`);

        const outputDir = path.dirname(videoPath);
        const videoName = path.basename(videoPath, path.extname(videoPath));

        try {
            // Command Whisper (Windows compatible)
            const command = `whisper "${videoPath}" --model ${this.whisperModel} --language en --output_format txt --output_dir "${outputDir}"`;

            const startTime = Date.now();

            const { stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                shell: os.platform() === 'win32' ? 'cmd.exe' : undefined
            });

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);

            if (stderr) {
                console.log('Whisper output:', stderr);
            }

            // Đọc file transcript
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

    /**
     * Cleanup temp files
     */
    private static cleanup(...filePaths: string[]): void {
        for (const filePath of filePaths) {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error(`Cleanup error:`, error);
            }
        }
    }

    /**
     * Main: Transcribe video từ URL
     */
    static async transcribeVideo(videoUrl: string): Promise<string> {
        this.init();

        const timestamp = Date.now();
        const videoPath = path.join(this.tempDir, `video-${timestamp}.mp4`);
        const transcriptPath = path.join(this.tempDir, `video-${timestamp}.txt`);

        try {
            console.log('\n========== TRANSCRIPTION START ==========');

            // Download video
            await this.downloadVideo(videoUrl, videoPath);

            // Run Whisper
            const transcript = await this.runWhisper(videoPath);

            // Cleanup
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
     * Process 1 answer - transcribe và lưu vào DB
     */
    static async processAnswer(answerId: string, videoUrl: string): Promise<void> {
        console.log(`\n🎬 Processing answer: ${answerId}`);

        try {
            // Update status → processing
            await supabase
                .from('submission_answers')
                .update({ transcript_status: 'processing' })
                .eq('id', answerId);

            // Transcribe
            const transcript = await this.transcribeVideo(videoUrl);

            if (!transcript || transcript.length === 0) {
                throw new Error('Empty transcript');
            }

            // Save transcript to DB
            const { error } = await supabase
                .from('submission_answers')
                .update({
                    transcript: transcript,
                    transcript_status: 'completed'
                })
                .eq('id', answerId);

            if (error) throw error;

            console.log(`✅ Saved transcript: "${transcript.substring(0, 100)}..."`);

        } catch (error: any) {
            console.error(`❌ Failed:`, error.message);

            // Update status → failed
            await supabase
                .from('submission_answers')
                .update({ transcript_status: 'failed' })
                .eq('id', answerId);

            throw error;
        }
    }

    /**
     * Process tất cả pending answers
     */
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

                // Delay 2s giữa mỗi video
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

    /**
     * Get stats
     */
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