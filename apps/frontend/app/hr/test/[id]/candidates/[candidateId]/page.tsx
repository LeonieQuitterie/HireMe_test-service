// app/hr/test/[id]/candidate/[candidateId]/page.tsx

"use client"

import { use } from "react"
import useSWR from "swr"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BarChart3, Video, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import CandidateDetailCharts from "@/components/candidates/candidate-detail-charts"


// Custom fetcher có gửi Bearer token
const fetcher = async (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  if (!token) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized")
    throw new Error("Failed to fetch")
  }

  return res.json()
}

export default function CandidateDetailPage({
  params
}: {
  params: Promise<{ id: string; candidateId: string }>
}) {
  const { id: testId, candidateId } = use(params)

// Frontend – phải đảo lại thứ tự để khớp backend hiện tại
const {
  data: scoresRes,
  error: scoresError,
  isLoading: loadingScores,
} = useSWR(
  `http://localhost:5000/api/candidate-big-five/scores/${candidateId}/${testId}`, // ĐẢO LẠI
  fetcher
)

const {
  data: personalityRes,
  error: personalityError,
  isLoading: loadingPersonality,
} = useSWR(
  `http://localhost:5000/api/candidate-big-five/${candidateId}/${testId}`, // ĐẢO LẠI
  fetcher
)

  const isLoading = loadingScores || loadingPersonality
  const hasError = scoresError || personalityError
  const isUnauthorized = scoresError?.message === "Unauthorized" || personalityError?.message === "Unauthorized"

  // Xử lý lỗi 401 → có thể redirect login
  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Phiên đăng nhập hết hạn</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục.</p>
          <Button onClick={() => (window.location.href = "/login")} className="bg-indigo-600 hover:bg-indigo-700">
            Đăng nhập lại
          </Button>
        </div>
      </div>
    )
  }

  if (hasError) notFound()

  const candidate = scoresRes?.data?.candidate || personalityRes?.data?.candidate
  const scores = scoresRes?.data?.scores
  const personality = personalityRes?.data?.personality

  if (!isLoading && !candidate) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Candidate Evaluation
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Test #{testId.slice(0, 8)}... - Detailed Analysis
              </p>
            </div>
            <Link href={`/hr/test/${testId}`}>
              <Button variant="outline" className="border-indigo-200 hover:bg-indigo-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Test
              </Button>
            </Link>
          </div>

          {/* Navigation Pills */}
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full text-xs font-medium text-blue-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Overview
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </div>
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-xs font-medium text-purple-700 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Video
            </div>
          </div>
        </div>

        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
                <CardContent><Skeleton className="h-96 w-full rounded-xl" /></CardContent>
              </Card>
              <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
            <div>
              <Card><CardContent className="pt-6"><Skeleton className="h-80 w-full rounded-xl" /></CardContent></Card>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Charts & Scores */}
              <div className="lg:col-span-2 space-y-8">

                {/* Big Five Radar Chart */}
                {personality && (
                  <Card className="bg-white/90 backdrop-blur-lg border-indigo-100 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        Big Five Personality Traits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CandidateDetailCharts personality={personality} />
                    </CardContent>
                  </Card>
                )}

                {/* Assessment Performance */}
                {scores && (
                  <Card className="bg-white/90 backdrop-blur-lg border-purple-100 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        Assessment Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-indigo-600">
                            {scores.avg_overall_score?.toFixed(1) ?? "-"}
                          </div>
                          <p className="text-sm text-gray-600">Overall Score</p>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">
                            {scores.avg_bert_score?.toFixed(1) ?? "-"}
                          </div>
                          <p className="text-sm text-gray-600">BERT Score</p>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-purple-600">
                            {scores.avg_gemini_score?.toFixed(1) ?? "-"}
                          </div>
                          <p className="text-sm text-gray-600">Gemini Score</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${scores.pass_fail_status === 'pass' ? 'text-green-600' : scores.pass_fail_status === 'fail' ? 'text-red-600' : 'text-amber-600'}`}>
                            {scores.pass_fail_status.toUpperCase()}
                          </div>
                          <p className="text-sm text-gray-600">Status</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                          <div className="font-medium text-gray-700">Total Answers</div>
                          <div className="text-2xl font-bold text-indigo-700">{scores.total_answers}</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="font-medium text-gray-700">Videos Analyzed</div>
                          <div className="text-2xl font-bold text-purple-700">{personality?.total_videos_analyzed ?? 0}</div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                          <div className="font-medium text-gray-700">Recommendation</div>
                          <div className="text-lg font-bold text-amber-800">{scores.final_recommendation}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right: Candidate Info */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-lg border-indigo-100 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {candidate?.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{candidate?.name}</h3>
                        <p className="text-gray-600">{candidate?.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          scores?.pass_fail_status === 'pass' ? 'bg-green-100 text-green-800' :
                          scores?.pass_fail_status === 'fail' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {scores?.pass_fail_status === 'pending' ? 'Pending Review' : scores?.pass_fail_status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted</span>
                        <span className="font-medium">
                          {scores?.created_at ? new Date(scores.created_at).toLocaleDateString('vi-VN') : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Personality Analysis</span>
                        <span className={personality ? "text-green-600 font-medium" : "text-gray-500"}>
                          {personality ? "Completed" : "Not ready"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        <Video className="w-4 h-4 mr-2" />
                        Watch Videos
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Download Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Final Recommendation */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-amber-600 mb-3" />
                  <h4 className="text-lg font-bold text-amber-800">Final Recommendation</h4>
                  <p className="text-2xl font-bold text-amber-900 mt-2">
                    {scores?.final_recommendation || "Pending"}
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    {personality ? "AI analysis completed" : "Waiting for video analysis"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}