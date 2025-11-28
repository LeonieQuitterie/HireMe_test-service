"use client"

import { use } from "react" // ✅ Import use
import { useRouter } from 'next/navigation'
import { KPICards } from "@/components/dashboard/kpi-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { CandidateTable } from "@/components/dashboard/candidate-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TestDetailPage({
  params
}: {
  params: Promise<{ id: string }> // ✅ params là Promise
}) {
  const router = useRouter()

  // ✅ Unwrap params
  const { id: testId } = use(params)

  console.log('Test ID:', testId)

  // ✅ Handler để navigate đến candidate detail
  const handleViewCandidate = (candidateId: string | number) => {
    console.log('Navigating to:', `/hr/test/${testId}/candidates/${candidateId}`)
    router.push(`/hr/test/${testId}/candidates/${candidateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Test Results Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Test #{testId} - Comprehensive candidate analytics and performance evaluation
              </p>
            </div>
            <Link href="/hr/test">
              <Button
                variant="outline"
                className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tests
              </Button>
            </Link>
          </div>

          {/* AI Analysis Disclaimer Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200/60 shadow-lg mb-4"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl"></div>

            <div className="relative p-5 flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-amber-900">
                    AI-Powered Analysis Advisory
                  </h3>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-700 text-xs font-semibold rounded-full border border-amber-300">
                    Beta
                  </span>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  The AI-generated assessments and personality insights provided below are <span className="font-semibold">reference tools only</span> and should not be considered definitive evaluations.
                  We strongly recommend using these analyses as <span className="font-semibold">one component</span> of your comprehensive hiring process,
                  combined with interviews, reference checks, and your professional judgment for optimal candidate assessment.
                </p>

                {/* Additional info pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 rounded-full text-xs text-amber-700 font-medium border border-amber-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    AI-Assisted
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 rounded-full text-xs text-amber-700 font-medium border border-amber-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Reference Only
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 rounded-full text-xs text-amber-700 font-medium border border-amber-200">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Human Review Required
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Navigation Pills */}
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-xs font-medium text-blue-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Candidate Overview
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Performance Analytics
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-xs font-medium text-purple-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Real-time Insights
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Charts Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
          </div>
          <DashboardCharts />
        </div>

        {/* Candidate Table */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Candidate Details</h2>
          </div>
          <CandidateTable onViewDetails={handleViewCandidate} />
        </div>
      </div>
    </div>
  )
}