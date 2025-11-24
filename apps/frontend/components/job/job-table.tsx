'use client'

import { Edit2, Trash2, Eye, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface Job {
    id: number
    title: string
    status: string
    questionsCount: number
    createdAt: string
    updatedAt: string
    department: string
    location: string
    description: string
    published: boolean
}

interface JobTableProps {
    jobs: Job[]
    onEdit: (job: Job) => void
    onDelete: (id: number) => void
    getStatusColor: (status: string) => string
}

export function JobTable({ jobs, onEdit, onDelete, getStatusColor }: JobTableProps) {
    const getQuestionsColor = (count: number) => {
        if (count === 0) return 'text-red-600 bg-red-50'
        if (count <= 5) return 'text-yellow-600 bg-yellow-50'
        if (count <= 10) return 'text-blue-600 bg-blue-50'
        return 'text-green-600 bg-green-50'
    }
    
    const router = useRouter();
    const onView = (job: Job): void => {
        router.push(`/hr/jobs/${job.id}`);
    };

    return (
        <Card className="overflow-hidden border-indigo-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                        <TableRow>
                            <TableHead className="text-indigo-800 font-bold">Job Title</TableHead>
                            {/* <TableHead className="text-indigo-800 font-bold">Department</TableHead> */}
                            {/* <TableHead className="text-indigo-800 font-bold">Status</TableHead> */}
                            <TableHead className="text-indigo-800 font-bold text-center">
                                Question Sets
                            </TableHead>

                            <TableHead className="text-indigo-800 font-bold">Created</TableHead>
                            <TableHead className="text-indigo-800 font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-indigo-50/50 border-indigo-100 transition-colors">
                                <TableCell className="font-medium text-gray-800">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{job.title}</span>
                                        <span className="text-xs text-gray-500">{job.location}</span>
                                    </div>
                                </TableCell>

                                {/* <TableCell>
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        {job.department}
                                    </Badge>
                                </TableCell> */}

                                {/* <TableCell>
                                    <Badge className={`${getStatusColor(job.status)} border-0 font-semibold`}>
                                        {job.status}
                                    </Badge>
                                </TableCell> */}

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${getQuestionsColor(job.questionsCount)}`}>
                                            <span className="font-bold text-sm">{job.questionsCount}</span>
                                        </div>
                                    </div>
                                </TableCell>


                                <TableCell className="text-gray-600 text-sm">
                                    <div className="flex flex-col">
                                        <span>{job.createdAt}</span>
                                        {job.updatedAt !== job.createdAt && (
                                            <span className="text-xs text-gray-400">Updated: {job.updatedAt}</span>
                                        )}
                                    </div>
                                </TableCell>


                                <TableCell>
                                    <div className="flex gap-2">
                                        {/* View button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(job)}
                                            className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                                            title="View details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>

                                        {/* Edit button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(job)}
                                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                            title="Edit job"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>

                                        {/* Delete button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(job.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                            title="Delete job"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}