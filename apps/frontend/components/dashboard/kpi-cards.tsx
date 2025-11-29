"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle2, XCircle, TrendingUp, Award, AlertCircle, Brain, Zap } from "lucide-react"
import { motion } from "framer-motion"

export interface TraitScore {
  trait: string
  bert_score: number | null
  gemini_score: number | null
  ensemble_score: number
  priority: number
  confidence: number
}

interface CandidateAssessment {
  id: string
  name: string
  email: string
  overall_score: number
  trait_scores: TraitScore[]
  method_used: string
  status: "passed" | "failed"
}

interface KPICardsProps {
  candidates?: CandidateAssessment[]
}

// ✅ Default empty array để tránh undefined
export function KPICards({ candidates = [] }: KPICardsProps) {
  const totalCandidates = candidates.length
  const passedCandidates = candidates.filter((c) => c.status === "passed").length
  const failedCandidates = candidates.filter((c) => c.status === "failed").length
  const passRate = totalCandidates > 0 ? ((passedCandidates / totalCandidates) * 100).toFixed(1) : "0.0"
  
  const assessedCandidates = candidates.filter(c => c.overall_score !== undefined && c.overall_score !== null)
  
  const averageScore = assessedCandidates.length > 0 
    ? (assessedCandidates.reduce((sum, c) => sum + c.overall_score, 0) / assessedCandidates.length).toFixed(2)
    : "N/A"
  
  const highestScore = assessedCandidates.length > 0
    ? Math.max(...assessedCandidates.map((c) => c.overall_score)).toFixed(2)
    : "N/A"
  
  const lowestScore = assessedCandidates.length > 0
    ? Math.min(...assessedCandidates.map((c) => c.overall_score)).toFixed(2)
    : "N/A"

  const candidatesWithTraits = candidates.filter(c => c.trait_scores && c.trait_scores.length > 0)
  const avgConfidence = candidatesWithTraits.length > 0 ? (
    candidatesWithTraits.reduce((sum, c) => {
      const candidateAvgConf = c.trait_scores.reduce((s, t) => s + t.confidence, 0) / c.trait_scores.length
      return sum + candidateAvgConf
    }, 0) / candidatesWithTraits.length * 100
  ).toFixed(1) : "N/A"

  const candidatesWithMethod = candidates.filter(c => c.method_used)
  const ensembleCount = candidatesWithMethod.filter(c => c.method_used.includes('Ensemble')).length
  const ensembleRate = candidatesWithMethod.length > 0
    ? ((ensembleCount / candidatesWithMethod.length) * 100).toFixed(1)
    : "0.0"

  const kpis = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      subtitle: "active participants",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      gradient: "from-blue-600 to-blue-400"
    },
    {
      title: "Passed",
      value: passedCandidates,
      subtitle: `${passRate}% pass rate`,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      gradient: "from-green-600 to-green-400"
    },
    {
      title: "Failed",
      value: failedCandidates,
      subtitle: `${(100 - Number.parseFloat(passRate)).toFixed(1)}% fail rate`,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      gradient: "from-red-600 to-red-400"
    },
    {
      title: "Average AI Score",
      value: averageScore,
      subtitle: "out of 10.0",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      gradient: "from-purple-600 to-purple-400"
    },
    {
      title: "Highest Score",
      value: highestScore,
      subtitle: "top performer",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-200",
      gradient: "from-amber-600 to-amber-400"
    },
    {
      title: "Lowest Score",
      value: lowestScore,
      subtitle: "needs improvement",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
      gradient: "from-orange-600 to-orange-400"
    },
    {
      title: "Avg Confidence",
      value: `${avgConfidence}%`,
      subtitle: "AI prediction certainty",
      icon: Brain,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      borderColor: "border-cyan-200",
      gradient: "from-cyan-600 to-cyan-400"
    },
    {
      title: "Ensemble Usage",
      value: `${ensembleRate}%`,
      subtitle: `${ensembleCount} dual-model analyses`,
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      borderColor: "border-indigo-200",
      gradient: "from-indigo-600 to-indigo-400"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="h-full"
        >
          <Card className={`bg-white/80 backdrop-blur-sm ${kpi.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col`}>
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`px-2 py-1 bg-gradient-to-r ${kpi.gradient} rounded-md shrink-0`}>
                  <span className="text-xs font-semibold text-white">Live</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                <p className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-auto min-h-[16px]">
                  {kpi.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}