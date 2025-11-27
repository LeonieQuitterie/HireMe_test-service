// apps/frontend/components/job/job-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogFooter } from '@/components/ui/dialog'
import { Job } from '@/app/types/job'



interface JobFormProps {
  job?: Job | null
  onSave: (job: Job) => void  // sẽ nhận lại job mới từ API
  onCancel: () => void
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a job title')
      return
    }

    setLoading(true)
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('You are not logged in. Please log in again.')
      setLoading(false)
      return
    }

    try {
      // ĐÚNG URL + METHOD CHO CẢ CREATE VÀ UPDATE
      const url = job
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`

      const res = await fetch(url, {
        method: job ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to save job')
      }

      // Gọi onSave với job mới từ backend
      onSave(result.data.job)
      alert(job ? 'Job updated successfully!' : 'Job published successfully!')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Save job error:', err)
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-700 font-semibold flex items-center gap-1">
          Job Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Senior Software Engineer"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700 font-semibold">
          Job Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the role, responsibilities, and what makes this position unique..."
          rows={6}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Provide a clear description to attract the right candidates
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-800 mb-1">Interview Questions</h4>
        <p className="text-sm text-gray-600">
          After creating this job, you can add interview questions on the job details page.
        </p>
      </div>

      <DialogFooter className="gap-3 flex-col sm:flex-row">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          {loading ? 'Saving...' : job ? 'Update Job' : 'Publish Job'}
        </Button>
      </DialogFooter>
    </div>
  )
}