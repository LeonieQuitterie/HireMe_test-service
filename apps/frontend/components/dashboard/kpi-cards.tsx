"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, XCircle, TrendingUp, Award, AlertCircle } from "lucide-react"
import { candidates } from "@/data/candidates"
import { motion } from "framer-motion"

export function KPICards() {
  const totalCandidates = candidates.length
  const passedCandidates = candidates.filter((c) => c.status === "passed").length
  const failedCandidates = candidates.filter((c) => c.status === "failed").length
  const passRate = ((passedCandidates / totalCandidates) * 100).toFixed(1)
  const averageScore = (candidates.reduce((sum, c) => sum + c.averageScore, 0) / totalCandidates).toFixed(2)
  const highestScore = Math.max(...candidates.map((c) => c.averageScore)).toFixed(2)
  const lowestScore = Math.min(...candidates.map((c) => c.averageScore)).toFixed(2)

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
      title: "Average Score",
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
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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