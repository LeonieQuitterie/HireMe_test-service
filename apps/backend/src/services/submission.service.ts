import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { supabase } from '../config/supabase';
import { TranscriptionService } from './transcription.service';

export class SubmissionService {
    private static client: S3Client;
    private static bucketName: string = process.env.R2_BUCKET_NAME!;
    private static publicUrl: string = process.env.R2_PUBLIC_URL!;

    private static initClient() {
        if (!this.client) {
            this.client = new S3Client({
                region: 'auto',
                endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
                },
            });
        }
        return this.client;
    }

    static async uploadVideoToR2(
        file: Express.Multer.File,
        candidateId: string,
        testId: string,
        questionId: string
    ): Promise<string> {
        const client = this.initClient();
        const timestamp = Date.now();
        const fileName = `videos/${testId}/${candidateId}/${questionId}_${timestamp}.webm`;

        await client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype || 'video/webm',
            })
        );

        return `${this.publicUrl}/${fileName}`;
    }

    static async validateQuestions(testId: string, questionIds: string[]) {
        const { data, error } = await supabase
            .from('test_questions')
            .select('id')
            .eq('test_id', testId)
            .in('id', questionIds);

        if (error || !data || data.length !== questionIds.length) {
            throw new Error('Một số câu hỏi không hợp lệ cho bài test này');
        }
    }

    static async checkExistingSubmission(testId: string, candidateId: string): Promise<boolean> {
        const { data } = await supabase
            .from('test_submissions')
            .select('id')
            .eq('test_id', testId)
            .eq('candidate_id', candidateId)
            .maybeSingle();

        return !!data;
    }

    // CHỈ GIỮ LẠI 1 FUNCTION createSubmission
    static async createSubmission(
        testId: string,
        candidateId: string,
        answers: Array<{
            questionId: string;
            videoUrl: string;
            durationSeconds?: number;
        }>
    ) {
        // 1. Tạo submission
        const { data: submission, error: subErr } = await supabase
            .from('test_submissions')
            .insert({
                test_id: testId,
                candidate_id: candidateId,
                submitted_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (subErr || !submission) {
            throw new Error(`Không thể tạo submission: ${subErr?.message || 'unknown'}`);
        }

        // 2. Tạo answers với transcript_status = 'pending'
        const answerPayload = answers.map((a) => ({
            submission_id: submission.id,
            question_id: a.questionId,
            video_url: a.videoUrl,
            duration_seconds: a.durationSeconds ?? null,
            transcript_status: 'pending', // ← Thêm để tự động transcribe
        }));

        const { data: insertedAnswers, error: ansErr } = await supabase
            .from('submission_answers')
            .insert(answerPayload)
            .select('id, question_id, video_url');

        if (ansErr) {
            // Rollback submission nếu lỗi
            await supabase.from('test_submissions').delete().eq('id', submission.id);
            throw new Error(`Lưu câu trả lời thất bại: ${ansErr.message}`);
        }

        const TEST_VIDEO_URL = 'https://pub-bfdecf5d8cac4a05a979137be6ce403f.r2.dev/videos/snaptik.vn_Y5HSd.mp4';


        // 3. AUTO TRANSCRIBE (async, không chờ kết quả)
        // for (const answer of insertedAnswers) {
        //     TranscriptionService.processAnswer(answer.id, answer.video_url)
        //         .catch(err => console.error(`Transcription error for ${answer.id}:`, err));
        // }

        for (const answer of insertedAnswers) {
            TranscriptionService.processAnswer(answer.id, TEST_VIDEO_URL)
                .catch(err => console.error(`Transcription error for ${answer.id}:`, err));
        }

        return {
            submissionId: submission.id,
            answers: insertedAnswers.map((a) => ({
                id: a.id,
                questionId: a.question_id,
                videoUrl: a.video_url,
            })),
        };
    }
}