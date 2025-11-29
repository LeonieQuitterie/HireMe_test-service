"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CandidateAssessment } from "@/data/candidates" // Đúng kiểu mới
import { CheckCircle2, XCircle, AlertCircle, Brain, TrendingUp, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface CandidateTraitDetailsProps {
  candidate: CandidateAssessment
}

export function CandidateTraitDetails({ candidate }: CandidateTraitDetailsProps) {
  const { trait_scores } = candidate

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-green-600"
    if (score >= 7) return "text-emerald-600"
    if (score >= 6) return "text-amber-600"
    return "text-red-600"
  }

  const getBadgeVariant = (score: number) => {
    if (score >= 8.5) return { badge: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="w-3 h-3" />, label: "Outstanding" }
    if (score >= 7) return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <Sparkles className="w-3 h-3" />, label: "Strong" }
    if (score >= 6) return { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: <AlertCircle className="w-3 h-3" />, label: "Average" }
    return { badge: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="w-3 h-3" />, label: "Needs Work" }
  }

  return (
    <div className="grid gap-5">
      {trait_scores.map((trait, index) => {
        const { trait: traitName, bert_score, gemini_score, ensemble_score, confidence, priority } = trait
        const badge = getBadgeVariant(ensemble_score)

        return (
          <motion.div
            key={traitName}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        Priority #{priority}
                      </span>
                      <Badge className={badge.badge}>
                        {badge.icon}
                        <span className="ml-1">{badge.label}</span>
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Brain className="w-3.5 h-3.5" />
                        Confidence: {(confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {traitName}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-extrabold ${getScoreColor(ensemble_score)}`}>
                      {ensemble_score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Ensemble Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">
                {/* Model Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bert_score !== null && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-800">BERT Model</span>
                        <span className={`text-xl font-bold ${getScoreColor(bert_score)}`}>
                          {bert_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-700"
                          style={{ width: `${(bert_score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {gemini_score !== null ? (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-purple-800">Gemini Model</span>
                        <span className={`text-xl font-bold ${getScoreColor(gemini_score)}`}>
                          {gemini_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-700"
                          style={{ width: `${(gemini_score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
                      Gemini analysis unavailable
                    </div>
                  )}
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Confidence Level</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${
                        confidence >= 0.8
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : confidence >= 0.7
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-indigo-300 hover:bg-indigo-50"
                    onClick={() => alert(`Xem video phần ${traitName} (sắp có)`)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Highlights
                  </Button>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Explanation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}