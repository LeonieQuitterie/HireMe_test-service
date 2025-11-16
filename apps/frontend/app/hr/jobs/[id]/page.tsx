"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Copy,
    Clock,
    MapPin,
    Briefcase,
    FileText,
    MessageSquare,
    Target,
    BarChart3,
    Calendar,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleJobs, sampleTests, Test } from "@/lib/mock";
import { showToast } from "@/components/ui/toast-container";
import { TestTable } from "@/components/test-management/test-table";
import { CreateTestModal } from "@/components/test-management/create-test-modal";
import { DeleteConfirmModal } from "@/components/test-management/delete-confirm-modal";
import { ScheduleTestModal } from "@/components/test-management/schedule-test-modal";

export default function JobDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = parseInt(searchParams.get("id") || "1");

    const [job, setJob] = useState(sampleJobs.find(j => j.id === jobId));
    const [tests, setTests] = useState<Test[]>(sampleTests.filter(t => t.jobId === jobId));
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [copyModalOpen, setCopyModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | null>(null);
    const [schedulingTest, setSchedulingTest] = useState<Test | null>(null); // New state
    const [deletingTestId, setDeletingTestId] = useState<number | null>(null);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false); // New state
    const [copyingTest, setCopyingTest] = useState<Test | null>(null);

    useEffect(() => {
        const foundJob = sampleJobs.find(j => j.id === jobId);
        if (!foundJob) {
            router.push("/hr/jobs");
            return;
        }
        setJob(foundJob);
        setTests(sampleTests.filter(t => t.jobId === jobId));
    }, [jobId, router]);

    if (!job) return null;


    // New handler for schedule click
    const handleScheduleClick = (test: Test) => {
        setSchedulingTest(test);
        setScheduleModalOpen(true);
    };

    // New handler for schedule submit
    const handleScheduleSubmit = (updatedTest: Test) => {
        setTests(tests.map((t) => (t.id === updatedTest.id ? updatedTest : t)));
        setScheduleModalOpen(false);
        setSchedulingTest(null);
        showToast(`Test "${updatedTest.name}" scheduled successfully`, "success");
    };

    const handleCreateTest = (newTest: Test) => {
        if (editingTest) {
            setTests(tests.map((t) => (t.id === editingTest.id ? newTest : t)));
            setEditingTest(null);
            showToast(`Test "${newTest.name}" updated successfully`, "success");
        } else {
            setTests([...tests, { ...newTest, jobId }]);
            showToast(`Test "${newTest.name}" created successfully`, "success");
        }
        setCreateModalOpen(false);
    };

    const handleDelete = (testId: number) => {
        setDeletingTestId(testId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deletingTestId) {
            const testName = tests.find((t) => t.id === deletingTestId)?.name;
            setTests(tests.filter((t) => t.id !== deletingTestId));
            setDeleteModalOpen(false);
            setDeletingTestId(null);
            showToast(`Test "${testName}" deleted successfully`, "success");
        }
    };

    const handleEdit = (test: Test) => {
        setEditingTest(test);
        setCreateModalOpen(true);
    };

    const handleCopy = (test: Test) => {
        setCopyingTest(test);
        setCopyModalOpen(true);
    };

    const confirmCopy = (targetJobId: number, newName: string) => {
        if (copyingTest) {
            const copiedTest: Test = {
                ...copyingTest,
                id: Date.now(),
                jobId: targetJobId,
                name: newName,
            };
            if (targetJobId === jobId) {
                setTests([...tests, copiedTest]);
            }
            setCopyModalOpen(false);
            setCopyingTest(null);
            showToast(`Test copied successfully`, "success");
        }
    };

    // Calculate stats
    const stats = {
        totalTests: tests.length,
        totalQuestions: tests.reduce((sum, t) => sum + t.questions.length, 0),
        avgDuration: tests.length > 0
            ? Math.round(tests.reduce((sum, t) => sum + t.duration, 0) / tests.length)
            : 0,
        avgDifficulty: () => {
            if (tests.length === 0) return "N/A";
            const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };

        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Closed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // ✅ Thêm handler này
    const handleViewTest = (test: Test) => {
        router.push(`/hr/test/${test.id}`)
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
                            <Badge className={`${getStatusColor(job.status)} border font-semibold text-sm px-3 py-1`}>
                                {job.status}
                            </Badge>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 mt-4">

                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <Briefcase className="w-4 h-4" />
                                <span className="text-sm font-medium">{job.department}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Created {job.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm font-medium">{job.questionsCount || 0} Questions</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Details Content */}
                    <div className="p-6 grid  gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{job.description}</p>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            onView={handleViewTest} // ✅ Thêm prop này
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
            />

            {/* New Schedule Modal */}
            <ScheduleTestModal
                isOpen={scheduleModalOpen}
                onClose={() => {
                    setScheduleModalOpen(false);
                    setSchedulingTest(null);
                }}
                onSubmit={handleScheduleSubmit}
                test={schedulingTest || undefined}
            />

            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                testName={tests.find((t) => t.id === deletingTestId)?.name || "Test"}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />

        </div>
    );
}