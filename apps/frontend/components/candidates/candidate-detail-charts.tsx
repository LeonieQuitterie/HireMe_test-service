"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Candidate } from "@/data/candidates"
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
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { motion } from "framer-motion"
import { Brain, BarChart3, Target, Smile } from "lucide-react"

interface CandidateDetailChartsProps {
  candidate: Candidate
}

// Custom Tooltip Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-indigo-200">
        <p className="font-semibold text-gray-800">{payload[0].name || payload[0].payload.name}</p>
        <p className="text-indigo-600 font-bold text-lg">
          {payload[0].value?.toFixed(1)}
        </p>
      </div>
    )
  }
  return null
}

export function CandidateDetailCharts({ candidate }: CandidateDetailChartsProps) {
  // Radar chart data for personality traits
  const criteriaData = [
    { criteria: "Openness", score: candidate.scores.openness ?? 8, fullMark: 10 },
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

  // Radial bar chart for overall score
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart - Personality Traits */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Personality Profile</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Big Five personality traits</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={criteriaData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#e0e7ff" strokeWidth={1.5} />
                <PolarAngleAxis 
                  dataKey="criteria" 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fill: "#64748b", fontSize: 11 }} 
                />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  fill="url(#radarGradient)" 
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Horizontal Bar Chart - Detailed Scores */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Detailed Criterion Scores</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Performance breakdown</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={criteriaBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.5} />
                <XAxis 
                  type="number" 
                  domain={[0, 10]} 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} 
                  width={120} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded shadow-sm" />
                <span className="text-gray-600">Below 6.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded shadow-sm" />
                <span className="text-gray-600">6.0 - 8.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded shadow-sm" />
                <span className="text-gray-600">Above 8.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radial Bar Chart - Overall Performance */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Overall Performance</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Composite score visualization</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                barSize={25}
                data={gaugeData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  background={{ fill: '#e0e7ff' }} 
                  dataKey="value" 
                  cornerRadius={15}
                />
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-5xl font-bold"
                  fill={gaugeData[0].fill}
                >
                  {candidate.averageScore.toFixed(1)}
                </text>
                <text 
                  x="50%" 
                  y="58%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-sm font-medium" 
                  fill="#64748b"
                >
                  out of 10.0
                </text>
                <text 
                  x="50%" 
                  y="68%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-xs" 
                  fill="#94a3b8"
                >
                  {candidate.averageScore >= 8 ? 'Excellent' : candidate.averageScore >= 6 ? 'Good' : 'Needs Improvement'}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Analysis Pie Chart */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Smile className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Emotional Intelligence</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Expression & sentiment analysis</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {emotionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ 
                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {emotionData.map((emotion) => (
                <div key={emotion.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotion.color }}></div>
                  <span className="text-xs text-gray-600 font-medium">{emotion.name}: {emotion.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}