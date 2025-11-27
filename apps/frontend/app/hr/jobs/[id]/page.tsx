"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    MessageSquare,
    FileText,
    Plus,
    Loader2,
    Target,
    Clock,
    AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast-container";
import { TestTable } from "@/components/test-management/test-table";
import { CreateTestModal } from "@/components/test-management/create-test-modal";
import { ScheduleTestModal } from "@/components/test-management/schedule-test-modal";
import { DeleteConfirmModal } from "@/components/test-management/delete-confirm-modal";
import { ApiJobResponse, Job } from "@/app/types/job";
import { ApiTestResponse, Test } from "@/app/types/test";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [jobId, setJobId] = useState<string>("");

    // States
    const [job, setJob] = useState<Job | null>(null);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [schedulingTest, setSchedulingTest] = useState<Test | null>(null);
    const [deletingTestId, setDeletingTestId] = useState<string | null>(null);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

    // Fetch job ID from params
    useEffect(() => {
        params.then((resolvedParams) => {
            setJobId(resolvedParams.id);
        });
    }, [params]);

    // Map API response to Test interface
    const mapApiResponseToTest = (apiTest: ApiTestResponse): Test => {
        return {
            id: apiTest.id,
            job_id: jobId,
            title: apiTest.testName,
            time_limit_minutes: apiTest.timeLimit,
            pass_score: 0, // Default, not returned by API
            status: apiTest.status,
            questions_count: apiTest.questionsCount,
            created_at: apiTest.createdAt,
            updated_at: apiTest.updatedAt,
            job_name: apiTest.jobName,
            questions: [],
        };
    };

    // Map API response to Job interface
    const mapApiResponseToJob = (apiJob: ApiJobResponse): Job => {
        return {
            id: apiJob.id,
            hr_id: '', // Not returned by API
            title: apiJob.title,
            description: apiJob.description,
            created_at: apiJob.createdAt,
            updated_at: apiJob.updatedAt,
            questions_count: apiJob.questionsCount,
        };
    };

    // Fetch job details and tests
    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('access_token');

                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                // Fetch job details
                const jobResponse = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!jobResponse.ok) {
                    if (jobResponse.status === 401) {
                        router.push('/auth/login');
                        return;
                    }
                    throw new Error('Failed to fetch job details');
                }

                const jobResult = await jobResponse.json();

                if (jobResult.success && jobResult.data.job) {
                    const mappedJob = mapApiResponseToJob(jobResult.data.job);
                    setJob(mappedJob);
                } else {
                    throw new Error(jobResult.message || 'Failed to fetch job');
                }

                // Fetch tests for this job
                const testsResponse = await fetch(`${API_BASE_URL}/api/tests/job/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (testsResponse.ok) {
                    const testsResult = await testsResponse.json();
                    
                    if (testsResult.success && testsResult.data.tests) {
                        const mappedTests = testsResult.data.tests.map((apiTest: ApiTestResponse) =>
                            mapApiResponseToTest(apiTest)
                        );
                        setTests(mappedTests);
                    } else {
                        setTests([]);
                    }
                } else {
                    // If 404 or other error, just set empty tests
                    console.log('No tests found for this job');
                    setTests([]);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
                showToast('Failed to load job details', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, router]);

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handlers
    const handleScheduleClick = (test: Test) => {
        setSchedulingTest(test);
        setScheduleModalOpen(true);
    };

    const handleScheduleSubmit = async (schedule: {
        testId: string;
        startTime: string;
        emails: string[];
    }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            // Call API to schedule test
            const response = await fetch(`${API_BASE_URL}/api/test-schedules/${schedule.testId}/schedule`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_time: schedule.startTime,
                    emails: schedule.emails,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to schedule test');
            }

            if (result.success) {
                // Update test status to 'scheduled' in local state
                setTests(tests.map((t) => 
                    t.id === schedule.testId 
                        ? { ...t, status: 'scheduled' } 
                        : t
                ));

                setScheduleModalOpen(false);
                setSchedulingTest(null);

                showToast(
                    `Test scheduled successfully! Invitations sent to ${result.data.invited_count} candidates.`,
                    "success"
                );
            } else {
                throw new Error(result.message || 'Failed to schedule test');
            }
        } catch (err) {
            console.error('Error scheduling test:', err);
            showToast(
                err instanceof Error ? err.message : 'Failed to schedule test',
                'error'
            );
        }
    };

    const handleCreateTest = (newTest: Test) => {
        if (editingTest) {
            setTests(tests.map((t) => (t.id === editingTest.id ? newTest : t)));
            setEditingTest(null);
            showToast(`Test "${newTest.title}" updated successfully`, "success");
        } else {
            setTests([...tests, newTest]);
            showToast(`Test "${newTest.title}" created successfully`, "success");
        }
        setCreateModalOpen(false);
    };

    const handleDelete = (testId: string) => {
        setDeletingTestId(testId);
        setDeleteModalOpen(true);
    };

// D:\HireMeAI\apps\frontend\app\hr\jobs\[id]\page.tsx

const confirmDelete = async () => {
    if (!deletingTestId) return;

    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/tests/${deletingTestId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete test');
        }

        // Success: remove from local state
        const testName = tests.find((t) => t.id === deletingTestId)?.title;
        setTests(tests.filter((t) => t.id !== deletingTestId));
        setDeleteModalOpen(false);
        setDeletingTestId(null);
        showToast(`Test "${testName}" deleted successfully`, "success");

    } catch (error) {
        console.error('Error deleting test:', error);
        showToast(
            error instanceof Error ? error.message : 'Failed to delete test',
            'error'
        );
        setDeleteModalOpen(false);
        setDeletingTestId(null);
    }
};

    const handleEdit = (test: Test) => {
        setEditingTest(test);
        setCreateModalOpen(true);
    };

    const handleViewTest = (test: Test) => {
        router.push(`/hr/test/${test.id}`);
    };

    // Calculate stats
    const stats = {
        totalTests: tests.length,
        totalQuestions: tests.reduce((sum, t) => sum + (t.questions_count || 0), 0),
        avgDuration: tests.length > 0
            ? Math.round(tests.reduce((sum, t) => sum + t.time_limit_minutes, 0) / tests.length)
            : 0,
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.push("/hr/jobs")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/hr/jobs")}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                </button>

                {/* Job Info Section */}
                <Card className="mb-8 bg-white/80 backdrop-blur-sm border-indigo-200 shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">{job.title}</h1>
                                        <p className="text-indigo-100 text-sm mt-1">Job Position Details & Test Management</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Created {formatDate(job.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">{job.questions_count || 0} Questions</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Details Content */}
                    <div className="p-6 grid gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{job.description || 'No description provided'}</p>
                        </div>
                    </div>
                </Card>

                {/* Tests Section Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                                <Target className="w-6 h-6" />
                                Assessment Tests
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">Manage tests and questions for this position</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingTest(null);
                                setCreateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Test
                        </button>
                    </div>

                    {/* Test Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-indigo-600">{stats.totalTests}</p>
                                    <p className="text-xs text-gray-600">Total Tests</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</p>
                                    <p className="text-xs text-gray-600">Total Questions</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-white/80 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-pink-600">{stats.avgDuration}</p>
                                    <p className="text-xs text-gray-600">Avg. Duration (min)</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Tests Table */}
                <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg overflow-hidden">
                    {tests.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No tests yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                Create your first assessment test for <strong>{job.title}</strong> position
                            </p>
                            <button
                                onClick={() => {
                                    setEditingTest(null);
                                    setCreateModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium"
                            >
                                <Plus size={18} />
                                Create First Test
                            </button>
                        </div>
                    ) : (
                        <TestTable
                            tests={tests}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onScheduleClick={handleScheduleClick}
                            onView={handleViewTest}
                            onCreateNew={() => {
                                setEditingTest(null);
                                setCreateModalOpen(true);
                            }}
                        />
                    )}
                </Card>
            </div>

            {/* Modals */}
            <CreateTestModal
                isOpen={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setEditingTest(null);
                }}
                onSubmit={handleCreateTest}
                editingTest={editingTest || undefined}
                jobId={jobId}
            />

            {schedulingTest && (
                <ScheduleTestModal
                    isOpen={scheduleModalOpen}
                    onClose={() => {
                        setScheduleModalOpen(false);
                        setSchedulingTest(null);
                    }}
                    onSubmit={handleScheduleSubmit}
                    test={schedulingTest}
                />
            )}

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                testName={tests.find((t) => t.id === deletingTestId)?.title || "Test"}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </div>
    );
}