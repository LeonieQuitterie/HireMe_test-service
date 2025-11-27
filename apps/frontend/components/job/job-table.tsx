// apps/frontend/components/job/job-table.tsx

import { Edit2, Trash2, Eye } from 'lucide-react'
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
import { Job } from '@/app/types/job'

interface JobTableProps {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (id: string) => void   // ← ĐÃ SỬA TỪ number → string
  // onView?: (job: Job) => void   // nếu cần
}

export function JobTable({ jobs, onEdit, onDelete }: JobTableProps) {
  const router = useRouter()

  const onView = (job: Job) => {
    router.push(`/hr/jobs/${job.id}`)  // id giờ là string → URL vẫn hợp lệ
  }

  const getQuestionsColor = (count: number) => {
    if (count === 0) return 'text-red-600 bg-red-50'
    if (count <= 5) return 'text-yellow-600 bg-yellow-50'
    if (count <= 10) return 'text-blue-600 bg-blue-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <Card className="overflow-hidden border-indigo-200 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
            <TableRow>
              <TableHead className="text-indigo-800 font-bold">Job Title</TableHead>
              <TableHead className="text-indigo-800 font-bold text-center">Question Sets</TableHead>
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
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg ${getQuestionsColor(job.questionsCount)}`}>
                    <span className="font-bold text-sm">{job.questionsCount}</span>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(job)}
                      className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-100"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(job)}
                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                      title="Edit job"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(job.id)}  // ← giờ job.id là string → hợp lệ!
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
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