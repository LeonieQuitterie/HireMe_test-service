'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DialogFooter,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

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

interface JobFormProps {
  job?: Job | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (formData: any) => void
  onCancel: () => void
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || 'IT',
    location: job?.location || '',
    description: job?.description || '',
    published: job?.published || false,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (action: 'draft' | 'publish') => {
    if (!formData.title.trim()) {
      alert('Please enter a job title')
      return
    }
    if (!formData.location.trim()) {
      alert('Please enter a location')
      return
    }
    onSave({
      ...formData,
      published: action === 'publish',
    })
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
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* <div className="space-y-2">
          <Label htmlFor="department" className="text-gray-700 font-semibold">
            Department
          </Label>
          <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
            <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
{/* 
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 font-semibold flex items-center gap-1">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            placeholder="e.g., Ho Chi Minh City"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div> */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-700 font-semibold">
          Job Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the role, responsibilities, and what makes this position unique..."
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
        />
        <p className="text-xs text-gray-500">Provide a clear description to attract the right candidates</p>
      </div>



      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-indigo-800 mb-1">Interview Questions</h4>
            <p className="text-sm text-gray-600">
              After creating this job, you can add interview questions in the job details page
            </p>
          </div>
          {/* <div className="bg-white px-3 py-1 rounded-full border border-indigo-200">
            <span className="text-xs font-semibold text-indigo-600">
              {job?.questionsCount || 0} questions
            </span>
          </div> */}
        </div>
      </div>

      {/* <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg border border-green-200">
        <Switch
          id="publish"
          checked={formData.published}
          onCheckedChange={(value) => handleChange('published', value)}
          className="data-[state=checked]:bg-green-600"
        />
        <div className="flex-1">
          <Label htmlFor="publish" className="text-gray-700 font-semibold cursor-pointer block">
            Publish Immediately
          </Label>
          <p className="text-xs text-gray-600 mt-0.5">
            Make this job visible to candidates right away
          </p>
        </div>
      </div> */}

      <DialogFooter className="gap-3 flex-col sm:flex-row">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        {/* <Button
          variant="outline"
          onClick={() => handleSubmit('draft')}
          className="w-full sm:w-auto border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
        >
          Save as Draft
        </Button> */}
        <Button
          onClick={() => handleSubmit('publish')}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
        >
          {formData.published ? 'Update & Publish' : 'Publish Job'}
        </Button>
      </DialogFooter>
    </div>
  )
}