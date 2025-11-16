"use client"

import { use } from "react" // ✅ Import use
import { useRouter } from 'next/navigation'
import { KPICards } from "@/components/dashboard/kpi-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { CandidateTable } from "@/components/dashboard/candidate-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

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