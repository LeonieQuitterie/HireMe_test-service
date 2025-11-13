"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Candidate } from "@/data/candidates"
import { systemAverageScore } from "@/data/candidates"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { motion } from "framer-motion"

interface CandidateDetailChartsProps {
  candidate: Candidate
}

export function CandidateDetailCharts({ candidate }: CandidateDetailChartsProps) {
  // Radar chart data for 5 big traits (OCEAN) - sử dụng trực tiếp từ data đã update
// Radar chart data for 5 big traits (OCEAN) - fallback tạm để test hiển thị
const criteriaData = [
  { criteria: "Openness", score: candidate.scores.openness ?? 8, fullMark: 10 }, // Fallback 8 nếu undefined
  { criteria: "Conscientiousness", score: candidate.scores.conscientiousness ?? 7, fullMark: 10 },
  { criteria: "Extraversion", score: candidate.scores.extraversion ?? 9, fullMark: 10 },
  { criteria: "Agreeableness", score: candidate.scores.agreeableness ?? 6, fullMark: 10 },
  { criteria: "Neuroticism", score: candidate.scores.neuroticism ?? 2, fullMark: 10 },
]

  // Horizontal bar chart with color coding
  const criteriaBarData = Object.entries(candidate.scores).map(([key, value]) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    score: value,
    fill: value < 6 ? "#ef4444" : value < 8 ? "#f59e0b" : "#10b981",
  }))

  // Radial bar chart for overall score (gauge)
  const gaugeData = [
    {
      name: "Score",
      value: (candidate.averageScore / 10) * 100,
      fill: candidate.averageScore > 7 ? "#10b981" : candidate.averageScore > 6 ? "#f59e0b" : "#ef4444",
    },
  ]

  // Emotion pie chart
  const emotionData = [
    { name: "Happy", value: candidate.emotions.happy, color: "#10b981" },
    { name: "Neutral", value: candidate.emotions.neutral, color: "#6b7280" },
    { name: "Anxious", value: candidate.emotions.anxious, color: "#f59e0b" },
    { name: "Stressed", value: candidate.emotions.stressed, color: "#ef4444" },
    { name: "Sad", value: candidate.emotions.sad, color: "#8b5cf6" },
  ]

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Radar Chart - Core Criteria */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="h-full shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Core Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={criteriaData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="criteria" tick={{ fill: "#64748b", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Horizontal Bar Chart - Color Coded */}
     <motion.div custom={1} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="h-full shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Individual Criterion Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={criteriaBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-muted-foreground">Below 6</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-500 rounded" />
                <span className="text-muted-foreground">6-8</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-muted-foreground">Above 8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div> 

      {/* Radial Bar Chart - Gauge */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="h-full shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={20}
                data={gaugeData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold"
                  fill="#3b82f6"
                >
                  {candidate.averageScore.toFixed(1)}
                </text>
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm" fill="#64748b">
                  out of 10
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Analysis Pie Chart */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="h-full shadow-lg border-0 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Emotion & Expression Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
