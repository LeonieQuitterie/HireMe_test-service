"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { candidates } from "@/data/candidates"
import { CandidateHeader } from "@/components/candidates/candidate-header"
import { CandidateDetailCharts } from "@/components/candidates/candidate-detail-charts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Video, FileText } from "lucide-react"
import Link from "next/link"
import { CandidateQuestionDetails } from "@/components/candidates/candidate-question-details"

export default function CandidateDetailPage({
  params
}: {
  params: Promise<{ id: string; candidateId: string }>
}) {
  const { id: testId, candidateId } = use(params)
  const candidate = candidates.find((c) => c.id === candidateId)

  if (!candidate) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Candidate Evaluation
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Test #{testId} - Detailed performance analysis
              </p>
            </div>
            <Link href={`/hr/test/${testId}`}>
              <Button 
                variant="outline"
                className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Test Results
              </Button>
            </Link>
          </div>

          {/* Quick Navigation Pills */}
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-xs font-medium text-blue-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Overview
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-xs font-medium text-purple-700 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              Video Interview
            </div>
          </div>
        </div>

        {/* Candidate Header Card */}
        <div className="mb-8">
          <CandidateHeader candidate={candidate} />
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>
          </div>
          <CandidateDetailCharts candidate={candidate} />
        </div>

        {/* Question Details Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Question-by-Question Analysis</h2>
          </div>
          <CandidateQuestionDetails candidate={candidate} />
        </div>
      </div>
    </div>
  )
}