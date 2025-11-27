// D:\HireMeAI\apps\frontend\app\hr\test\page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  BarChart3,
  Clock,
  Target,
  FileText,
  Loader2,
} from "lucide-react";
import { Test } from "@/app/types/test";
import { showToast } from "@/components/ui/toast-container";
import { TestTable } from "@/components/test-management/test-table";
import { DeleteConfirmModal } from "@/components/test-management/delete-confirm-modal";
import { CreateTestSelectJobModel } from "@/components/test-management/create-test-select-job-modal";
import { Card } from "@/components/ui/card";
import { ScheduleTestModal } from "@/components/test-management/schedule-test-modal";
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TestManagementPage() {
  const router = useRouter();

  // States
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [schedulingTest, setSchedulingTest] = useState<Test | null>(null);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);

  // Fetch all tests
  useEffect(() => {
    fetchAllTests();
  }, []);

  const fetchAllTests = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      console.log('📡 Fetching all tests');

      const response = await fetch(`${API_BASE_URL}/api/tests/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch tests');
      }

      const result = await response.json();
      console.log('✅ Tests fetched:', result);

      if (result.success && result.data.tests) {
        // Map API response to Test type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedTests = result.data.tests.map((apiTest: any) => ({
          id: apiTest.id,
          job_id: apiTest.jobId || '',
          title: apiTest.testName,
          time_limit_minutes: apiTest.timeLimit,
          pass_score: apiTest.passScore || 0,
          status: apiTest.status,
          questions_count: apiTest.questionsCount || 0,
          created_at: apiTest.createdAt,
          updated_at: apiTest.updatedAt,
          job_name: apiTest.jobName,
          questions: [],
        }));

        setTests(mappedTests);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error('❌ Error fetching tests:', error);
      showToast('Failed to load tests', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter tests
  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handlers
  const handleView = (test: Test) => {
    router.push(`/hr/test/${test.id}`);
  };

  const handleCreateTest = (newTest: Test) => {
    if (editingTest) {
      setTests(tests.map((t) => (t.id === editingTest.id ? newTest : t)));
      setEditingTest(null);
      showToast(`Test "${newTest.title}" updated successfully`, "success");
    } else {
      setTests([newTest, ...tests]);
      showToast(`Test "${newTest.title}" created successfully`, "success");
    }
    setCreateModalOpen(false);
  };

  const handleDelete = async (testId: string) => {
    setDeletingTestId(testId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTestId) return;

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/tests/${deletingTestId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete test');
      }

      const testName = tests.find((t) => t.id === deletingTestId)?.title;
      setTests(tests.filter((t) => t.id !== deletingTestId));
      setDeleteModalOpen(false);
      setDeletingTestId(null);
      showToast(`Test "${testName}" deleted successfully`, "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Error deleting test:', error);
      showToast(error.message || 'Failed to delete test', 'error');
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setCreateModalOpen(true);
  };

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
  // Calculate stats
  const stats = {
    total: filteredTests.length,
    totalQuestions: filteredTests.reduce(
      (sum, t) => sum + (t.questions_count || 0),
      0
    ),
    avgDuration:
      filteredTests.length > 0
        ? Math.round(
          filteredTests.reduce((sum, t) => sum + t.time_limit_minutes, 0) /
          filteredTests.length
        )
        : 0,
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading tests...</p>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Showing {filteredTests.length}{" "}
              {filteredTests.length === 1 ? "test" : "tests"}
              {searchQuery && (
                <span className="text-indigo-600 font-medium">
                  (filtered from {tests.length} total)
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg overflow-hidden">
          {tests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No tests yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Create your first assessment test to get started
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
              tests={filteredTests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onScheduleClick={handleScheduleClick}
              onView={handleView}
              onCreateNew={() => {
                setEditingTest(null);
                setCreateModalOpen(true);
              }}
            />
          )}
        </Card>
      </div>

      {/* Modals */}
      <CreateTestSelectJobModel
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingTest(null);
        }}
        onSubmit={handleCreateTest}
        editingTest={editingTest || undefined}
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