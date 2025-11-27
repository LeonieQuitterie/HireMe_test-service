// apps/backend/src/services/test.service.ts
import { supabase } from '../config/supabase';

interface QuestionData {
    question_text: string;
    order: number;
}

interface CreateTestData {
    job_id: string;
    title: string;
    time_limit_minutes: number;
    pass_score: number;
    status?: 'open' | 'closed' | 'scheduled';
    questions: QuestionData[]; // Bắt buộc có questions
}

interface UpdateTestData {
    title?: string;
    time_limit_minutes?: number;
    pass_score?: number;
    status?: 'open' | 'closed' | 'scheduled';
    job_id?: string;
    questions?: QuestionData[]; // Optional cho update
}

export class TestService {

    /**
     * Lấy tất cả các bài Test có trong 1 Job
     */
    static async getTestsByJob(jobId: string, hr_id: string) {
        try {
            // Kiểm tra job có thuộc về HR này không
            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .select('id, hr_id')
                .eq('id', jobId)
                .eq('hr_id', hr_id)
                .single();

            if (jobError || !job) {
                return {
                    success: false,
                    status: jobError?.code === 'PGRST116' ? 404 : 400,
                    message: 'Job not found or you do not have permission',
                };
            }

            // Lấy tất cả tests của job này
            const { data: tests, error } = await supabase
                .from('tests')
                .select(`
                    id,
                    title,
                    time_limit_minutes,
                    pass_score,
                    status,
                    created_at,
                    updated_at,
                    job_id,
                    jobs!inner (
                        title
                    ),
                    test_questions!left (
                        id
                    )
                `)
                .eq('job_id', jobId)
                .order('created_at', { ascending: false });

            if (error) {
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            const formattedTests = tests.map(test => ({
                id: test.id,
                testName: test.title,
                jobName: test.jobs?.[0]?.title || 'Unknown Job',
                questionsCount: Array.isArray(test.test_questions) ? test.test_questions.length : 0,
                timeLimit: test.time_limit_minutes,
                status: test.status,
                createdAt: test.created_at,
                updatedAt: test.updated_at,
            }));

            return {
                success: true,
                message: 'Tests fetched successfully',
                data: { tests: formattedTests },
            };
        } catch (error) {
            console.error('Get tests by job service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Lấy chi tiết 1 Test bao gồm questions
     */
    static async getTestById(testId: string, hr_id: string) {
        try {
            const { data: test, error } = await supabase
                .from('tests')
                .select(`
                    id,
                    title,
                    time_limit_minutes,
                    pass_score,
                    status,
                    created_at,
                    updated_at,
                    job_id,
                    jobs!inner (
                        title,
                        hr_id
                    ),
                    test_questions (
                        id,
                        question_text,
                        order
                    )
                `)
                .eq('id', testId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        success: false,
                        status: 404,
                        message: 'Test not found',
                    };
                }
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            // Kiểm tra quyền sở hữu
            const testData = test as any;
            if (testData.jobs.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You do not have permission to view this test',
                };
            }

            // Format questions
            const questions = (testData.test_questions || [])
                .sort((a: any, b: any) => a.order - b.order)
                .map((q: any) => ({
                    id: q.id,
                    questionText: q.question_text,
                    order: q.order,
                }));

            return {
                success: true,
                message: 'Test fetched successfully',
                data: {
                    test: {
                        id: testData.id,
                        title: testData.title,
                        timeLimitMinutes: testData.time_limit_minutes,
                        passScore: testData.pass_score,
                        status: testData.status,
                        jobId: testData.job_id,
                        jobTitle: testData.jobs.title,
                        createdAt: testData.created_at,
                        updatedAt: testData.updated_at,
                        questions,
                    },
                },
            };
        } catch (error) {
            console.error('Get test by id service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Lấy tất cả các bài Test của HR
     */
    /**
    * Lấy tất cả các bài Test của HR
    */
    static async getMyTests(hr_id: string) {
        try {
            const { data: tests, error } = await supabase
                .from('tests')
                .select(`
                id,
                title,
                time_limit_minutes,
                pass_score,
                status,
                created_at,
                updated_at,
                job_id,
                jobs:jobs!inner(title),
                test_questions!left(id)
            `)
                .eq('jobs.hr_id', hr_id)
                .order('created_at', { ascending: false });

            if (error) {
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            if (!tests || tests.length === 0) {
                return {
                    success: true,
                    message: 'No tests found',
                    data: { tests: [] },
                };
            }

            const formattedTests = tests.map((test: any) => ({
                id: test.id,
                testName: test.title,
                // Fix lỗi TS: ép kiểu đúng vì Supabase trả về object, không phải array
                jobName: (test.jobs as { title: string | null } | null)?.title || 'Unknown Job',
                jobId: test.job_id,
                questionsCount: Array.isArray(test.test_questions)
                    ? test.test_questions.length
                    : 0,
                timeLimit: test.time_limit_minutes,
                status: test.status,
                createdAt: test.created_at,
                updatedAt: test.updated_at,
            }));

            return {
                success: true,
                message: 'Tests fetched successfully',
                data: { tests: formattedTests },
            };
        } catch (error) {
            console.error('Get my tests service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }
    /**
     * Tạo bài Test khi đã có job_id (không cần chọn Job)
     * BẮT BUỘC phải có ít nhất 1 câu hỏi
     */
    static async createTestForJob(testData: CreateTestData, hr_id: string) {
        try {
            // Validation: Bắt buộc có questions
            if (!testData.questions || testData.questions.length === 0) {
                return {
                    success: false,
                    status: 400,
                    message: 'At least one question is required',
                };
            }

            // Kiểm tra job có thuộc về HR này không
            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .select('id, hr_id')
                .eq('id', testData.job_id)
                .eq('hr_id', hr_id)
                .single();


            console.log('Checking job:', {
                job_id: testData.job_id,
                hr_id: hr_id,
            });

            if (jobError || !job) {
                return {
                    success: false,
                    status: jobError?.code === 'PGRST116' ? 404 : 403,
                    message: 'Job not found or you do not have permission',
                };
            }

            // Tạo test
            const { data: newTest, error } = await supabase
                .from('tests')
                .insert({
                    job_id: testData.job_id,
                    title: testData.title,
                    time_limit_minutes: testData.time_limit_minutes,
                    pass_score: testData.pass_score,
                    status: testData.status || 'closed',
                })
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            // Tạo questions cho test
            const questionsToInsert = testData.questions.map((q, index) => ({
                test_id: newTest.id,
                question_text: q.question_text,
                order: q.order !== undefined ? q.order : index,
            }));

            const { data: createdQuestions, error: questionsError } = await supabase
                .from('test_questions')
                .insert(questionsToInsert)
                .select();

            if (questionsError) {
                // Rollback: xóa test vừa tạo nếu tạo questions thất bại
                await supabase.from('tests').delete().eq('id', newTest.id);
                return {
                    success: false,
                    status: 400,
                    message: `Failed to create questions: ${questionsError.message}`,
                };
            }

            return {
                success: true,
                message: 'Test created successfully',
                data: {
                    test: {
                        ...newTest,
                        questions: createdQuestions,
                    },
                },
            };
        } catch (error) {
            console.error('Create test for job service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Tạo bài Test khi cần chọn Job
     * BẮT BUỘC phải có ít nhất 1 câu hỏi
     */
    static async createTest(testData: CreateTestData, hr_id: string) {
        try {
            // Validation: Bắt buộc có questions
            if (!testData.questions || testData.questions.length === 0) {
                return {
                    success: false,
                    status: 400,
                    message: 'At least one question is required',
                };
            }

            // Kiểm tra job có thuộc về HR này không
            const { data: job, error: jobError } = await supabase
                .from('jobs')
                .select('id, hr_id')
                .eq('id', testData.job_id)
                .eq('hr_id', hr_id)
                .single();

            if (jobError || !job) {
                return {
                    success: false,
                    status: jobError?.code === 'PGRST116' ? 404 : 403,
                    message: 'Job not found or you do not have permission',
                };
            }

            // Tạo test
            const { data: newTest, error } = await supabase
                .from('tests')
                .insert({
                    job_id: testData.job_id,
                    title: testData.title,
                    time_limit_minutes: testData.time_limit_minutes,
                    pass_score: testData.pass_score,
                    status: testData.status || 'closed',
                })
                .select(`
                    *,
                    jobs!inner (
                        title
                    )
                `)
                .single();

            if (error) {
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            // Tạo questions cho test
            const questionsToInsert = testData.questions.map((q, index) => ({
                test_id: newTest.id,
                question_text: q.question_text,
                order: q.order !== undefined ? q.order : index,
            }));

            const { data: createdQuestions, error: questionsError } = await supabase
                .from('test_questions')
                .insert(questionsToInsert)
                .select();

            if (questionsError) {
                // Rollback: xóa test vừa tạo nếu tạo questions thất bại
                await supabase.from('tests').delete().eq('id', newTest.id);
                return {
                    success: false,
                    status: 400,
                    message: `Failed to create questions: ${questionsError.message}`,
                };
            }

            return {
                success: true,
                message: 'Test created successfully',
                data: {
                    test: {
                        ...newTest,
                        questions: createdQuestions,
                    },
                },
            };
        } catch (error) {
            console.error('Create test service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Chỉnh sửa bài Test (không cần thông tin Job)
     * Có thể chỉnh sửa questions
     */
    static async updateTest(testId: string, testData: UpdateTestData, hr_id: string) {
        try {
            // Bước 1: Lấy test + thông tin hr_id của job chủ
            const { data: rawTest, error: fetchError } = await supabase
                .from('tests')
                .select(`
                    id,
                    jobs!inner(hr_id)
                `)
                .eq('id', testId)
                .single();

            // Bước 2: Xử lý lỗi chi tiết
            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    return {
                        success: false,
                        status: 404,
                        message: 'Test not found',
                    };
                }
                console.error('Supabase fetch error:', fetchError);
                return {
                    success: false,
                    status: 500,
                    message: 'Database error',
                };
            }

            if (!rawTest) {
                return {
                    success: false,
                    status: 404,
                    message: 'Test not found',
                };
            }

            const test = rawTest as unknown as { id: string; jobs: { hr_id: string } };

            // Bước 3: Kiểm tra quyền sở hữu
            if (test.jobs.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You do not have permission to edit this test',
                };
            }

            // Bước 4: Chuẩn bị dữ liệu update test
            const updateData: any = {
                updated_at: new Date().toISOString(),
            };

            if (testData.title !== undefined) updateData.title = testData.title.trim();
            if (testData.time_limit_minutes !== undefined) updateData.time_limit_minutes = testData.time_limit_minutes;
            if (testData.pass_score !== undefined) updateData.pass_score = testData.pass_score;
            if (testData.status !== undefined) updateData.status = testData.status;

            // Bước 5: Thực hiện update test
            const { data: updatedTest, error } = await supabase
                .from('tests')
                .update(updateData)
                .eq('id', testId)
                .select()
                .single();

            if (error) {
                console.error('Update error:', error);
                return {
                    success: false,
                    status: 400,
                    message: error.message,
                };
            }

            // Bước 6: Xử lý questions nếu có
            if (testData.questions !== undefined) {
                // Xóa tất cả questions cũ
                const { error: deleteError } = await supabase
                    .from('test_questions')
                    .delete()
                    .eq('test_id', testId);

                if (deleteError) {
                    console.error('Delete questions error:', deleteError);
                    return {
                        success: false,
                        status: 400,
                        message: `Failed to update questions: ${deleteError.message}`,
                    };
                }

                // Tạo questions mới nếu có
                if (testData.questions.length > 0) {
                    const questionsToInsert = testData.questions.map((q, index) => ({
                        test_id: testId,
                        question_text: q.question_text,
                        order: q.order !== undefined ? q.order : index,
                    }));

                    const { error: insertError } = await supabase
                        .from('test_questions')
                        .insert(questionsToInsert);

                    if (insertError) {
                        console.error('Insert questions error:', insertError);
                        return {
                            success: false,
                            status: 400,
                            message: `Failed to update questions: ${insertError.message}`,
                        };
                    }
                }
            }

            // Lấy test với questions mới
            const { data: finalTest } = await supabase
                .from('tests')
                .select(`
                    *,
                    test_questions (
                        id,
                        question_text,
                        order
                    )
                `)
                .eq('id', testId)
                .single();

            return {
                success: true,
                message: 'Test updated successfully',
                data: { test: finalTest },
            };
        } catch (error: any) {
            console.error('Unexpected error in updateTest:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Chỉnh sửa bài Test (có thông tin Job - cho phép đổi job)
     * Có thể chỉnh sửa questions
     */
    static async updateTestWithJob(testId: string, testData: UpdateTestData & { job_id?: string }, hr_id: string) {
        try {
            // 1. Kiểm tra test hiện tại có tồn tại + thuộc HR này không
            const { data: rawTest, error: fetchError } = await supabase
                .from('tests')
                .select('id, jobs!inner(hr_id)')
                .eq('id', testId)
                .single();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    return { success: false, status: 404, message: 'Test not found' };
                }
                console.error('Fetch test error:', fetchError);
                return { success: false, status: 500, message: 'Database error' };
            }

            if (!rawTest) {
                return { success: false, status: 404, message: 'Test not found' };
            }

            const test = rawTest as unknown as { id: string; jobs: { hr_id: string } };

            if (test.jobs.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You do not have permission to edit this test',
                };
            }

            // 2. Nếu có thay đổi job_id → kiểm tra job mới có thuộc HR này không
            if (testData.job_id) {
                const { data: newJob, error: jobError } = await supabase
                    .from('jobs')
                    .select('id')
                    .eq('id', testData.job_id)
                    .eq('hr_id', hr_id)
                    .single();

                if (jobError || !newJob) {
                    if (jobError?.code === 'PGRST116') {
                        return { success: false, status: 404, message: 'Target job not found' };
                    }
                    return {
                        success: false,
                        status: 403,
                        message: 'You cannot move this test to a job you do not own',
                    };
                }
            }

            // 3. Chuẩn bị dữ liệu update
            const updateData: any = {
                updated_at: new Date().toISOString(),
            };

            if (testData.title !== undefined) updateData.title = testData.title.trim();
            if (testData.time_limit_minutes !== undefined) updateData.time_limit_minutes = testData.time_limit_minutes;
            if (testData.pass_score !== undefined) updateData.pass_score = testData.pass_score;
            if (testData.status !== undefined) updateData.status = testData.status;
            if (testData.job_id !== undefined) updateData.job_id = testData.job_id;

            // 4. Thực hiện update test
            const { data: updatedRaw, error: updateError } = await supabase
                .from('tests')
                .update(updateData)
                .eq('id', testId)
                .select(`
                    *,
                    jobs!inner(title, hr_id)
                `)
                .single();

            if (updateError) {
                console.error('Update error:', updateError);
                return { success: false, status: 400, message: updateError.message };
            }

            // 5. Xử lý questions nếu có
            if (testData.questions !== undefined) {
                // Xóa tất cả questions cũ
                const { error: deleteError } = await supabase
                    .from('test_questions')
                    .delete()
                    .eq('test_id', testId);

                if (deleteError) {
                    console.error('Delete questions error:', deleteError);
                    return {
                        success: false,
                        status: 400,
                        message: `Failed to update questions: ${deleteError.message}`,
                    };
                }

                // Tạo questions mới nếu có
                if (testData.questions.length > 0) {
                    const questionsToInsert = testData.questions.map((q, index) => ({
                        test_id: testId,
                        question_text: q.question_text,
                        order: q.order !== undefined ? q.order : index,
                    }));

                    const { error: insertError } = await supabase
                        .from('test_questions')
                        .insert(questionsToInsert);

                    if (insertError) {
                        console.error('Insert questions error:', insertError);
                        return {
                            success: false,
                            status: 400,
                            message: `Failed to update questions: ${insertError.message}`,
                        };
                    }
                }
            }

            // 6. Lấy test với questions mới
            const { data: finalTest } = await supabase
                .from('tests')
                .select(`
                    *,
                    jobs!inner(title, hr_id),
                    test_questions (
                        id,
                        question_text,
                        order
                    )
                `)
                .eq('id', testId)
                .single();

            const updatedTest = finalTest as any;

            return {
                success: true,
                message: 'Test updated successfully',
                data: {
                    test: {
                        id: updatedTest.id,
                        title: updatedTest.title,
                        timeLimitMinutes: updatedTest.time_limit_minutes,
                        passScore: updatedTest.pass_score,
                        status: updatedTest.status,
                        jobId: updatedTest.job_id,
                        jobTitle: updatedTest.jobs.title,
                        questions: updatedTest.test_questions || [],
                    },
                },
            };
        } catch (error: any) {
            console.error('Unexpected error in updateTestWithJob:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }

    /**
     * Xóa bài Test
     */
    static async deleteTest(testId: string, hr_id: string) {
        try {
            // 1. Lấy test + thông tin hr_id của job chủ
            const { data: rawTest, error: fetchError } = await supabase
                .from('tests')
                .select('id, jobs!inner(hr_id)')
                .eq('id', testId)
                .single();

            // 2. Xử lý lỗi fetch chi tiết
            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    return { success: false, status: 404, message: 'Test not found' };
                }
                console.error('Supabase fetch error:', fetchError);
                return { success: false, status: 500, message: 'Database error' };
            }

            if (!rawTest) {
                return { success: false, status: 404, message: 'Test not found' };
            }

            const test = rawTest as unknown as { id: string; jobs: { hr_id: string } };

            // 4. Kiểm tra quyền sở hữu
            if (test.jobs.hr_id !== hr_id) {
                return {
                    success: false,
                    status: 403,
                    message: 'You do not have permission to delete this test',
                };
            }

            // 5. Xóa test (cascade sẽ tự xóa hết test_questions)
            const { error: deleteError } = await supabase
                .from('tests')
                .delete()
                .eq('id', testId);

            if (deleteError) {
                console.error('Delete error:', deleteError);
                return { success: false, status: 400, message: deleteError.message };
            }

            return {
                success: true,
                message: 'Test deleted successfully',
                data: null,
            };
        } catch (error: any) {
            console.error('Unexpected error in deleteTest:', error);
            return {
                success: false,
                status: 500,
                message: 'Internal server error',
            };
        }
    }
}