// D:\HireMeAI\apps\frontend\components\test-management\test-table.tsx

"use client";

import { Edit2, Trash2, Plus, Clock, BarChart3, Target, Eye, Calendar } from 'lucide-react';
import { sampleJobs, Test } from '@/lib/mock';
import { Badge } from '@/components/ui/badge';

interface TestTableProps {
    tests: Test[];
    onEdit: (test: Test) => void;
    onDelete: (testId: number) => void;
    onScheduleClick: (test: Test) => void;
    onView: (test: Test) => void; // ✅ Thêm prop này
    onCreateNew: () => void;
}

export function TestTable({
    tests,
    onEdit,
    onDelete,
    onScheduleClick,
    onView, // ✅ Nhận callback từ parent
    onCreateNew,
}: TestTableProps) {
    if (tests.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No tests found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Get started by creating your first assessment test for job candidates
                </p>
                <button
                    onClick={onCreateNew}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    <Plus size={18} />
                    Create Your First Test
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Test Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Job</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Questions</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-indigo-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map((test, index) => (
                        <tr
                            key={test.id}
                            className={`border-b border-indigo-100 hover:bg-indigo-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                }`}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{test.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    {sampleJobs.find((j) => j.id === test.jobId)?.title || "N/A"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-blue-600">{test.questions.length}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-pink-600" />
                                    <span className="font-medium">{test.duration} min</span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <Badge
                                    variant={test.status === 'open' ? 'default' : 'secondary'}
                                    className={test.status === 'open' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                                >
                                    {test.status === 'open' ? 'Open' : 'Closed'}
                                </Badge>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    {/* Schedule button */}
                                    <button
                                        onClick={() => onScheduleClick(test)}
                                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors group"
                                        title="Schedule test opening"
                                    >
                                        <Calendar size={18} className="text-yellow-600 group-hover:scale-110 transition-transform" />
                                    </button>

                                    {/* ✅ View button - gọi callback */}
                                    <button
                                        onClick={() => onView(test)}
                                        className="p-2 hover:bg-indigo-100 rounded-lg transition-colors group"
                                        title="View test details"
                                    >
                                        <Eye size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => onEdit(test)}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                        title="Edit test"
                                    >
                                        <Edit2 size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => onDelete(test.id)}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                        title="Delete test"
                                    >
                                        <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}