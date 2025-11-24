"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, FileText, Clock, Target, HelpCircle, CheckCircle } from 'lucide-react';
import { Question, sampleJobs, Test } from "@/lib/mock";

interface CreateTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (test: Test) => void;
    editingTest?: Test;
}

export function CreateTestModal({
    isOpen,
    onClose,
    onSubmit,
    editingTest,
}: CreateTestModalProps) {
    const [selectedJob, setSelectedJob] = useState(editingTest?.jobId || 1);
    const [testName, setTestName] = useState(editingTest?.name || "");
    const [duration, setDuration] = useState(editingTest?.duration || 30);
    const [passing, setPassing] = useState(editingTest?.passing || 5);
    const [questions, setQuestions] = useState<Question[]>(editingTest?.questions || []);

    useEffect(() => {
        if (editingTest) {
            setSelectedJob(editingTest.jobId);
            setTestName(editingTest.name);
            setDuration(editingTest.duration);
            setPassing(editingTest.passing);
            setQuestions(editingTest.questions);
        }
    }, [editingTest]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            text: "",
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (
        questionId: number,
        field: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
    ) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
            )
        );
    };

    const removeQuestion = (questionId: number) => {
        setQuestions(questions.filter((q) => q.id !== questionId));
    };

    const handleSubmit = () => {
        if (!testName.trim()) {
            alert("Please enter a test name");
            return;
        }
        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }


        const newTest: Test = {
            id: editingTest?.id || Date.now(),
            jobId: selectedJob,
            name: testName,
            questions,
            duration,
            passing,
            status: "closed"
        };

        onSubmit(newTest);

        // Reset form
        setTestName("");
        setDuration(30);
        setQuestions([]);
        setSelectedJob(1);
        onClose();
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
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <X size={22} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                            <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Position
                                    </label>
                                    <select
                                        value={selectedJob}
                                        onChange={(e) => setSelectedJob(Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                                    >
                                        {sampleJobs.map((job) => (
                                            <option key={job.id} value={job.id}>
                                                {job.status}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Test Name
                                    </label>
                                    <input
                                        type="text"
                                        value={testName}
                                        onChange={(e) => setTestName(e.target.value)}
                                        placeholder="e.g., React Fundamentals Assessment"
                                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-pink-600" />
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        min="5"
                                        max="120"
                                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4 text-yellow-600" />
                                        Passing score
                                    </label>
                                    <input
                                        type="number"
                                        value={passing}
                                        onChange={(e) => setPassing(Number(e.target.value))}
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
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
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        <Plus size={18} />
                                        Add Your First Question
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {questions.map((question, idx) => (
                                        <div
                                            key={question.id}
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
                                                    onClick={() => removeQuestion(question.id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                                    title="Remove question"
                                                >
                                                    <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>

                                            <textarea
                                                value={question.text}
                                                onChange={(e) =>
                                                    updateQuestion(question.id, "text", e.target.value)
                                                }
                                                placeholder="Enter your question here..."
                                                rows={3}
                                                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition-all"
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

                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            <Save size={18} />
                            {editingTest ? "Update Test" : "Create Test"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}