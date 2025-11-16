// D:\HireMeAI\apps\frontend\app\hr\test\page.tsx

"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  Clock,
  Target,
  FileText,
  TrendingUp,
} from "lucide-react";
import { sampleJobs, sampleTests, Test } from "@/lib/mock";
import { showToast } from "@/components/ui/toast-container";
import { TestTable } from "@/components/test-management/test-table";
import { DeleteConfirmModal } from "@/components/test-management/delete-confirm-modal";
import { CreateTestModal } from "@/components/test-management/create-test-modal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScheduleTestModal } from "@/components/test-management/schedule-test-modal";
import { useRouter } from 'next/navigation'

export default function TestManagementPage() {
  const [tests, setTests] = useState<Test[]>(sampleTests);
  const [selectedJob, setSelectedJob] = useState(0); // 0 = All jobs
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false); // New state
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [schedulingTest, setSchedulingTest] = useState<Test | null>(null); // New state
  const [deletingTestId, setDeletingTestId] = useState<number | null>(null);
  const [copyingTest, setCopyingTest] = useState<Test | null>(null);

  const filteredTests = tests.filter((t) => {
    const matchesJob = selectedJob === 0 || t.jobId === selectedJob;
    const matchesSearch = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesJob && matchesSearch;
  });

  const router = useRouter()

  const handleView = (test: Test) => {
    router.push(`/hr/test/${test.id}`)
  }

  const handleCreateTest = (newTest: Test) => {
    if (editingTest) {
      setTests(tests.map((t) => (t.id === editingTest.id ? newTest : t)));
      setEditingTest(null);
      showToast(`Test "${newTest.name}" updated successfully`, "success");
    } else {
      setTests([...tests, newTest]);
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
      setTests([...tests, copiedTest]);
      setCopyModalOpen(false);
      setCopyingTest(null);
      showToast(
        `Test copied to "${sampleJobs.find((j) => j.id === targetJobId)?.title
        }"`,
        "success"
      );
    }
  };

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

  // Calculate stats
  const stats = {
    total: filteredTests.length,
    totalQuestions: filteredTests.reduce(
      (sum, t) => sum + t.questions.length,
      0
    ),
    avgDuration:
      filteredTests.length > 0
        ? Math.round(
          filteredTests.reduce((sum, t) => sum + t.duration, 0) /
          filteredTests.length
        )
        : 0,
    avgDifficulty: () => {
      if (filteredTests.length === 0) return "N/A";
      const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Test Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create, edit, and manage assessment tests for job positions
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.total}
                  </p>
                  <p className="text-xs text-gray-600">Total Tests</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.totalQuestions}
                  </p>
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
                  <p className="text-2xl font-bold text-pink-600">
                    {stats.avgDuration}
                  </p>
                  <p className="text-xs text-gray-600">Avg. Duration (min)</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.avgDifficulty()}
                  </p>
                  <p className="text-xs text-gray-600">Avg. Difficulty</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter Section */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              <button
                onClick={() => {
                  setEditingTest(null);
                  setCreateModalOpen(true);
                }}
                className="lg:w-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create New Test
              </button>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tests by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
                />
              </div>

              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(Number(e.target.value))}
                className="lg:w-48 w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              >
                <option value={0}>All Jobs</option>
                {sampleJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="lg:w-36 w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Showing {filteredTests.length}{" "}
              {filteredTests.length === 1 ? "test" : "tests"}
              {(searchQuery ||
                selectedJob !== 0 ||
                difficultyFilter !== "All") && (
                  <span className="text-indigo-600 font-medium">
                    (filtered from {tests.length} total)
                  </span>
                )}
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg overflow-hidden">
          <TestTable
            tests={filteredTests}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onScheduleClick={handleScheduleClick}
            onView={handleView} // ✅ Truyền callback
            onCreateNew={() => {
              setEditingTest(null);
              setCreateModalOpen(true);
            }}
          />
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
