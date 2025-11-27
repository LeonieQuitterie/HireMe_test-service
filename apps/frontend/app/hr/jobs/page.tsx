'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, BarChart3, Briefcase, FileText, MessageSquare, CheckCircle, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { JobTable } from '@/components/job/job-table'
import { JobForm } from '@/components/job/job-form'
import { Job } from '@/app/types/job'




interface FormData {
    title: string
    description: string
}

export default function JobPage() {
    const [jobs, setJobs] = useState<Job[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Fetch the list of jobs belonging to the current HR user
    const fetchJobs = async () => {
        try {
            setLoading(true);

            // Retrieve access token from localStorage
            const token = localStorage.getItem('access_token');

            if (!token) {
                setError('Please log in again');
                setLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/my`, {
                method: 'GET',
                credentials: 'include', // Keep if backend also uses cookies
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Critical: Send JWT token
                },
            });

            // Handle token expiration or invalid token (401)
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                    return;
                }
                throw new Error('Failed to fetch jobs');
            }

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch jobs');
            }

            // Format data to match frontend Job interface
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedJobs: Job[] = result.data.jobs.map((job: any) => ({
                id: job.id,
                title: job.title,
                description: job.description ?? null,
                questionsCount: job.questionsCount,
                createdAt: new Date(job.createdAt).toISOString().split('T')[0],
                updatedAt: new Date(job.updatedAt).toISOString().split('T')[0],
            }));

            setJobs(formattedJobs);
            setError(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Connection error');
            console.error('Fetch jobs error:', err);
        } finally {
            setLoading(false);
        }
    };
    // Load lần đầu
    useEffect(() => {
        fetchJobs()
    }, [])

    // Refresh sau khi tạo/sửa/xóa
    const refreshJobs = () => {
        fetchJobs()
    }




    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)

    const handleOpenModal = (job?: Job) => {
        if (job) {
            setEditingJob(job)
        } else {
            setEditingJob(null)
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingJob(null)
    }

    const handleSaveJob = async (newJobFromAPI: Job) => {
        // Nếu là tạo mới → thêm vào đầu danh sách
        if (!editingJob) {
            setJobs(prev => [newJobFromAPI, ...prev])
        } else {
            // Nếu là edit → cập nhật job cũ
            setJobs(prev => prev.map(j => j.id === newJobFromAPI.id ? newJobFromAPI : j))
        }
        handleCloseModal()
        fetchJobs()
    }

    const handleDeleteJob = (id: string) => {
        setJobs(jobs.filter((job) => job.id !== id))
        setDeleteId(null)
    }

    // ĐẶT HÀM NÀY Ở ĐÂY — trong file page.tsx
    const handleDeleteConfirm = async () => {
        if (!deleteId) return

        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('You are not logged in!')
            setDeleteId(null)
            return
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to delete job')
            }

            // Xóa khỏi UI
            setJobs(prev => prev.filter(job => job.id !== deleteId))
            setDeleteId(null)

            alert('Job deleted successfully!')

            // Optional: refresh lại từ server
            // fetchJobs()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Delete job error:', err)
            alert(err.message || 'Failed to delete job')
        }
    }
    // Calculate statistics
    const stats = {
        total: jobs.length,
        totalQuestions: jobs.reduce((sum, j) => sum + (j.questions_count ?? 0), 0),
        avgQuestions: jobs.length > 0 ? Math.round(jobs.reduce((sum, j) => sum + (j.questions_count ?? 0), 0) / jobs.length) : 0
    }

    // Analytics data
    const questionsDistribution = {
        none: jobs.filter(j => (j.questions_count ?? 0) === 0).length,
        few: jobs.filter(j => (j.questions_count ?? 0) >= 1 && (j.questions_count ?? 0) <= 5).length,
        medium: jobs.filter(j => (j.questions_count ?? 0) >= 6 && (j.questions_count ?? 0) <= 10).length,
        many: jobs.filter(j => (j.questions_count ?? 0) > 10).length,
    }

    const readyJobs = jobs.filter(j => (j.questions_count ?? 0) > 0).length
    const readyPercentage = jobs.length > 0 ? Math.round((readyJobs / jobs.length) * 100) : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading recruitment list....</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section with Stats */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Job Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">Manage job positions and interview questions</p>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
                                    <p className="text-xs text-gray-600">Total Jobs</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                                    <p className="text-xs text-gray-600">Active Tests</p>
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
                                    <BarChart3 className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-pink-600">{stats.avgQuestions}</p>
                                    <p className="text-xs text-gray-600">Avg. per Job</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search and Filter Section */}
                    <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md">
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                            <Button
                                onClick={() => handleOpenModal()}
                                className="lg:w-auto w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                size="lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Job
                            </Button>

                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search ..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="pl-10 h-11 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                />
                            </div>


                        </div>

                        {/* Results count */}
                        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                            {(searchQuery) && (
                                <span className="text-indigo-600 font-medium">
                                    (filtered from {jobs.length} total)
                                </span>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Job List */}
                    <div className="lg:col-span-3">
                        {filteredJobs.length === 0 ? (
                            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-indigo-200">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchQuery
                                        ? "Try adjusting your search or filter criteria"
                                        : "Get started by creating your first job posting"}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() => handleOpenModal()}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Job
                                    </Button>
                                )}
                            </Card>
                        ) : (
                            <>
                                <JobTable
                                    jobs={paginatedJobs}
                                    onEdit={handleOpenModal}
                                    onDelete={(id) => setDeleteId(id)}
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Card className="mt-4 p-4 bg-white/80 backdrop-blur-sm border-indigo-200">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600">
                                                Page {currentPage} of {totalPages}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="border-indigo-200 hover:bg-indigo-50"
                                                >
                                                    Previous
                                                </Button>
                                                <div className="flex items-center px-3 text-sm font-medium text-indigo-600">
                                                    {currentPage}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="border-indigo-200 hover:bg-indigo-50"
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Test Readiness */}
                        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Test Readiness
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Jobs Ready</span>
                                        <span className="font-bold text-green-600">{readyJobs}/{jobs.length}</span>
                                    </div>
                                    <Progress value={readyPercentage} className="h-3" />
                                    <p className="text-xs text-gray-500 text-center">
                                        {readyPercentage}% of jobs have questions and are published
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Questions Distribution */}
                        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-purple-600" />
                                    Questions Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">No questions</span>
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                            {questionsDistribution.none}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">1-5 questions</span>
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                            {questionsDistribution.few}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">6-10 questions</span>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {questionsDistribution.medium}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">10+ questions</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {questionsDistribution.many}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {editingJob ? 'Edit Job Position' : 'Create New Job Position'}
                        </DialogTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            {editingJob
                                ? 'Update the job details below'
                                : 'Fill in the details to create a new job posting'}
                        </p>
                    </DialogHeader>
                    <JobForm
                        job={editingJob || undefined}
                        onSave={handleSaveJob}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="border-red-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <AlertDialogTitle className="text-xl font-bold text-gray-900 mb-2">
                                Delete Job Position
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                                Are you sure you want to delete this job position? This action cannot be undone, and all associated questions will be permanently removed.
                            </AlertDialogDescription>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Job
                        </AlertDialogAction>
                    </div>

                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}