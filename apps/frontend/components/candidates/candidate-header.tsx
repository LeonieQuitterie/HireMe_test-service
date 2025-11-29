"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Calendar, Award, TrendingUp, BrainCircuit } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { CandidateAssessment } from "@/data/candidates" // Đúng kiểu mới
import { motion } from "framer-motion"

interface CandidateHeaderProps {
  candidate: CandidateAssessment
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  // Xác định màu sắc dựa trên overall_score
  const scoreColor =
    candidate.overall_score >= 8.5
      ? "text-green-600"
      : candidate.overall_score >= 7
      ? "text-emerald-600"
      : candidate.overall_score >= 6
      ? "text-amber-600"
      : "text-red-600"

  const scoreGradient =
    candidate.overall_score >= 8.5
      ? "from-green-500 to-emerald-400"
      : candidate.overall_score >= 7
      ? "from-emerald-500 to-teal-400"
      : candidate.overall_score >= 6
      ? "from-amber-500 to-orange-400"
      : "from-red-500 to-rose-400"

  // Badge trạng thái + recommendation
  const isPassed = candidate.status === "passed"
  const recommendationBadge = (
    <Badge
      variant="outline"
      className={`px-3 py-1 text-sm font-medium border-2 ${
        isPassed
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-red-50 text-red-700 border-red-300"
      }`}
    >
      {isPassed ? "Passed" : "Failed"} • {candidate.recommendation}
    </Badge>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-indigo-200 shadow-xl overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Section - Thông tin ứng viên */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                {/* Tên + Badge */}
                <div className="space-y-3">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {candidate.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {recommendationBadge}
                    {candidate.method_used.includes("BERT only") && (
                      <Badge variant="secondary" className="text-xs">
                        <BrainCircuit className="w-3 h-3 mr-1" />
                        BERT Only
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <span className="font-medium">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-4.5 h-4.5 text-purple-600" />
                  </div>
                  <span className="font-medium">
                    Submitted: {formatDate(candidate.submittedAt)}
                  </span>
                </div>
              </div>

              {/* Text length info (optional, nhưng hay để có) */}
              <div className="text-sm text-gray-500">
                Transcript length: <span className="font-semibold">{candidate.text_length} words</span>
              </div>
            </div>

            {/* Right Section - Điểm số + Action */}
            <div className="flex flex-col items-center lg:items-end gap-6">
              {/* Overall Score */}
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-2 mb-3">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <span className="text-sm font-semibold text-gray-600">Overall Score</span>
                </div>

                <div className={`text-6xl lg:text-7xl font-extrabold ${scoreColor} tabular-nums`}>
                  {candidate.overall_score.toFixed(1)}
                </div>

                {/* Progress bar */}
                <div className="relative w-64 h-4 bg-gray-200 rounded-full overflow-hidden mt-4 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(candidate.overall_score / 10) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${scoreGradient} rounded-full`}
                  />
                </div>

                <div className="flex items-center justify-center lg:justify-end gap-1.5 mt-3 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>out of 10.0</span>
                </div>
              </div>

              {/* Nút xem video */}
              <a href={candidate.videoUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Watch Interview Video
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}