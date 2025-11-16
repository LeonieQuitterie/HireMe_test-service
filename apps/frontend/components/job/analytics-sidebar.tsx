'use client'

import { BarChart3, TrendingUp, Clock, MessageSquare, CheckCircle, PieChart, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

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
  requirements: string
  published: boolean
}

interface AnalyticsSidebarProps {
  jobs: Job[]
}

export function AnalyticsSidebar({ jobs }: AnalyticsSidebarProps) {
  // Calculate statistics
  const totalQuestions = jobs.reduce((sum, job) => sum + job.questionsCount, 0)
  const readyJobs = jobs.filter(j => j.questionsCount > 0 && j.published).length
  const readyPercentage = jobs.length > 0 ? Math.round((readyJobs / jobs.length) * 100) : 0
  
  const questionsDistribution = {
    none: jobs.filter(j => j.questionsCount === 0).length,
    few: jobs.filter(j => j.questionsCount >= 1 && j.questionsCount <= 5).length,
    medium: jobs.filter(j => j.questionsCount >= 6 && j.questionsCount <= 10).length,
    many: jobs.filter(j => j.questionsCount > 10).length,
  }

  const recentJobs = [...jobs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const recentUpdates = [...jobs].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5)

  const departments = Array.from(new Set(jobs.map(job => job.department)))
  const departmentStats = departments.map(dept => ({
    name: dept,
    count: jobs.filter(j => j.department === dept).length
  })).sort((a, b) => b.count - a.count)

  const maxDeptCount = Math.max(...departmentStats.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Test Readiness */}
      <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
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

      {/* Total Questions Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Questions</p>
              <p className="text-4xl font-bold text-purple-600">{totalQuestions}</p>
              <p className="text-gray-500 text-xs mt-1">across all jobs</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-purple-700" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Growing collection</span>
          </div>
        </CardContent>
      </Card>

      {/* Questions Distribution */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
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

      {/* Department Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departmentStats.map((dept) => (
            <div key={dept.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{dept.name}</span>
                <span className="font-semibold text-blue-600">{dept.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {departmentStats.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No departments yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recently Created</h4>
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-start gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.createdAt}</p>
                  </div>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">No jobs yet</p>
              )}
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recently Updated</h4>
            <div className="space-y-2">
              {recentUpdates.map((job) => (
                <div key={job.id} className="flex items-start gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.updatedAt}</p>
                  </div>
                </div>
              ))}
              {recentUpdates.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-2">No updates yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}