/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, FileText, Clock, Target, HelpCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Test, Question, CreateTestData } from "@/app/types/test";
import { Job } from "@/app/types/job";

interface CreateTestSelectJobModelProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (test: Test) => void;
    editingTest?: Test;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function CreateTestSelectJobModel({
    isOpen,
    onClose,
    onSubmit,
    editingTest,
}: CreateTestSelectJobModelProps) {
    // States
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [testName, setTestName] = useState("");
    const [duration, setDuration] = useState(30);
    const [passingScore, setPassingScore] = useState(70);
    const [questions, setQuestions] = useState<Omit<Question, 'id' | 'test_id' | 'created_at'>[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingTest, setFetchingTest] = useState(false);

    // Fetch jobs when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchJobs();
        }
    }, [isOpen]);

    // Fetch test details when editing
    useEffect(() => {
        if (!isOpen) return;

        if (editingTest?.id) {
            console.log('🔍 Editing test, fetching details for:', editingTest.id);
            fetchTestDetails(editingTest.id);
        } else {
            console.log('✨ Creating new test, resetting form');
            resetForm();
        }
    }, [isOpen, editingTest?.id]);

    const fetchJobs = async () => {
        setLoadingJobs(true);
        
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You are not logged in. Please log in again.');
                return;
            }

            console.log('📡 Fetching jobs');

            const response = await fetch(`${API_BASE_URL}/api/jobs/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const result = await response.json();
            console.log('✅ Jobs fetched:', result);

            if (result.success && result.data.jobs) {
                const mappedJobs = result.data.jobs.map((apiJob: any) => ({
                    id: apiJob.id,
                    hr_id: '',
                    title: apiJob.title,
                    description: apiJob.description,
                    created_at: apiJob.createdAt,
                    updated_at: apiJob.updatedAt,
                    questions_count: apiJob.questionsCount,
                }));
                
                setJobs(mappedJobs);
                
                // Set first job as default if creating new test
                if (!editingTest && mappedJobs.length > 0) {
                    setSelectedJobId(mappedJobs[0].id);
                }
            }
        } catch (error: any) {
            console.error('❌ Error fetching jobs:', error);
            alert('Failed to load jobs: ' + error.message);
        } finally {
            setLoadingJobs(false);
        }
    };

    const fetchTestDetails = async (testId: string) => {
        setFetchingTest(true);
        
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You are not logged in. Please log in again.');
                return;
            }

            console.log('📡 Fetching test details from:', `${API_BASE_URL}/api/tests/${testId}`);

            const response = await fetch(`${API_BASE_URL}/api/tests/${testId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch test details');
            }

            const result = await response.json();
            console.log('📥 Test details response:', result);

            if (result.success && result.data.test) {
                const test = result.data.test;
                
                setSelectedJobId(test.job_id || "");
                setTestName(test.title || "");
                setDuration(test.time_limit_minutes || 30);
                setPassingScore(test.pass_score || 70);
                
                const loadedQuestions = (test.questions || []).map((q: Question) => ({
                    question_text: q.question_text,
                    order: q.order
                }));
                
                console.log('✅ Setting questions:', loadedQuestions);
                setQuestions(loadedQuestions);
            }
        } catch (error: any) {
            console.error('❌ Error fetching test details:', error);
            alert('Failed to load test details: ' + error.message);
        } finally {
            setFetchingTest(false);
        }
    };

    const resetForm = () => {
        setTestName("");
        setDuration(30);
        setPassingScore(70);
        setQuestions([]);
        // Keep selectedJobId if jobs are loaded
        if (jobs.length > 0 && !selectedJobId) {
            setSelectedJobId(jobs[0].id);
        }
    };

    const addQuestion = () => {
        const newQuestion = {
            question_text: "",
            order: questions.length,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index: number, value: string) => {
        setQuestions(
            questions.map((q, idx) =>
                idx === index ? { ...q, question_text: value } : q
            )
        );
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!selectedJobId) {
            alert("Please select a job");
            return;
        }
        if (!testName.trim()) {
            alert("Please enter a test name");
            return;
        }
        if (duration <= 0) {
            alert("Duration must be greater than 0");
            return;
        }
        if (passingScore < 0 || passingScore > 100) {
            alert("Passing score must be between 0 and 100");
            return;
        }
        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        const emptyQuestions = questions.filter(q => !q.question_text.trim());
        if (emptyQuestions.length > 0) {
            alert("Please fill in all question texts");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You are not logged in. Please log in again.');
                return;
            }

            const testData: CreateTestData = {
                job_id: selectedJobId,
                title: testName.trim(),
                time_limit_minutes: duration,
                pass_score: passingScore,
                status: 'closed',
                questions: questions.map((q, index) => ({
                    question_text: q.question_text.trim(),
                    order: index,
                })),
            };

            const url = editingTest
                ? `${API_BASE_URL}/api/tests/${editingTest.id}`
                : `${API_BASE_URL}/api/tests`;

            const method = editingTest ? 'PUT' : 'POST';

            console.log('📤 Submitting test:', { url, method, testData });

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            const result = await response.json();
            console.log('📥 API Response:', result);

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to save test');
            }

            const savedTest: Test = {
                id: result.data.test.id,
                job_id: selectedJobId,
                title: result.data.test.title,
                time_limit_minutes: result.data.test.time_limit_minutes,
                pass_score: result.data.test.pass_score,
                status: result.data.test.status,
                questions_count: result.data.test.questions?.length || 0,
                created_at: result.data.test.created_at,
                updated_at: result.data.test.updated_at,
                questions: result.data.test.questions || [],
                job_name: jobs.find(j => j.id === selectedJobId)?.title,
            };

            onSubmit(savedTest);
            resetForm();
            
            alert(editingTest ? 'Test updated successfully!' : 'Test created successfully!');
            onClose();

        } catch (error: any) {
            console.error('❌ Error saving test:', error);
            alert(error.message || 'Failed to save test');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-indigo-200">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-900">
                                {editingTest ? "Edit Test" : "Create New Test"}
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {editingTest ? "Update test details and questions" : "Design your assessment test"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading || fetchingTest || loadingJobs}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X size={22} className="text-gray-600" />
                    </button>
                </div>

                {/* Loading state */}
                {(fetchingTest || loadingJobs) ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">
                                {fetchingTest ? 'Loading test details...' : 'Loading jobs...'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="p-6 space-y-6">
                                {/* Basic Info Card */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                                    <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Job Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Job Position <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={selectedJobId}
                                                onChange={(e) => setSelectedJobId(e.target.value)}
                                                disabled={loading}
                                                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all disabled:opacity-50"
                                            >
                                                <option value="">Select a job</option>
                                                {jobs.map((job) => (
                                                    <option key={job.id} value={job.id}>
                                                        {job.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Test Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Test Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={testName}
                                                onChange={(e) => setTestName(e.target.value)}
                                                placeholder="e.g., React Fundamentals Assessment"
                                                disabled={loading}
                                                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all disabled:opacity-50"
                                            />
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-pink-600" />
                                                Duration (minutes) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(Number(e.target.value))}
                                                min="5"
                                                max="180"
                                                disabled={loading}
                                                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all disabled:opacity-50"
                                            />
                                        </div>

                                        {/* Passing Score */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Passing Score (%) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={passingScore}
                                                onChange={(e) => setPassingScore(Number(e.target.value))}
                                                min="0"
                                                max="100"
                                                disabled={loading}
                                                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Questions Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <HelpCircle className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-semibold text-gray-900 text-lg">Questions</h3>
                                            {questions.length > 0 && (
                                                <span className="text-sm text-gray-500">
                                                    ({questions.length} {questions.length === 1 ? 'question' : 'questions'})
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={addQuestion}
                                            disabled={loading}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            <Plus size={16} />
                                            Add Question
                                        </button>
                                    </div>

                                    {questions.length === 0 ? (
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                                            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-4">No questions yet</p>
                                            <button
                                                onClick={addQuestion}
                                                disabled={loading}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                                            >
                                                <Plus size={18} />
                                                Add Your First Question
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                            {questions.map((question, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border-2 border-indigo-200 rounded-xl p-5 space-y-4 bg-white hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-sm font-bold text-indigo-600">{idx + 1}</span>
                                                            </div>
                                                            <label className="text-sm font-semibold text-gray-700">
                                                                Question {idx + 1}
                                                            </label>
                                                        </div>
                                                        <button
                                                            onClick={() => removeQuestion(idx)}
                                                            disabled={loading}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group disabled:opacity-50"
                                                            title="Remove question"
                                                        >
                                                            <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                                                        </button>
                                                    </div>

                                                    <textarea
                                                        value={question.question_text}
                                                        onChange={(e) => updateQuestion(idx, e.target.value)}
                                                        placeholder="Enter your question here..."
                                                        rows={3}
                                                        disabled={loading}
                                                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition-all disabled:opacity-50"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 flex gap-3 justify-between items-center p-6 border-t border-indigo-200 bg-gray-50">
                            <div className="text-sm text-gray-600">
                                {questions.length > 0 && (
                                    <>
                                        <strong>{questions.length}</strong> question{questions.length !== 1 ? 's' : ''} •
                                        <strong className="ml-1">{duration}</strong> minutes
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !selectedJobId}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingTest ? "Update Test" : "Create Test"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}