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
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Passed",
      value: `${passedCandidates} (${passRate}%)`,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Failed",
      value: `${failedCandidates} (${(100 - Number.parseFloat(passRate)).toFixed(1)}%)`,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Average Score",
      value: averageScore,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Highest Score",
      value: highestScore,
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Lowest Score",
      value: lowestScore,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
