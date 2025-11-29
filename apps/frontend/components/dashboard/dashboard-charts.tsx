"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { motion } from "framer-motion"
import { TrendingUp, Users, Award, BarChart3, PieChart as PieChartIcon, Brain } from "lucide-react"
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
  overall_score: number
  trait_scores: TraitScore[]
  method_used: string
  status: "passed" | "failed"
  submittedAt: string
}

interface DashboardChartsProps {
  candidates?: CandidateAssessment[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-indigo-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-indigo-600 font-bold text-lg">
          {payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

// ✅ Default empty array
export function DashboardCharts({ candidates = [] }: DashboardChartsProps) {
  const assessedCandidates = candidates.filter(c => c.overall_score !== undefined && c.overall_score !== null)
  
  if (assessedCandidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium text-lg">No assessment data available</p>
          <p className="text-sm text-gray-400 mt-1">Candidates haven&apos;t been assessed yet</p>
        </div>
      </div>
    )
  }

  const overallScoresData = assessedCandidates.map((c) => ({
    name: c.name.split(" ")[0],
    score: Number.parseFloat(c.overall_score.toFixed(2)),
  }))

  const topCandidatesData = [...assessedCandidates]
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 5)
    .map((c) => ({
      name: c.name.split(" ")[0],
      score: Number.parseFloat(c.overall_score.toFixed(2)),
    }))

  const trendData = assessedCandidates.map((c) => ({
    date: c.submittedAt,
    score: Number.parseFloat(c.overall_score.toFixed(2)),
    name: c.name.split(" ")[0],
  }))

  const passedCount = candidates.filter((c) => c.status === "passed").length
  const failedCount = candidates.filter((c) => c.status === "failed").length
  const statusData = [
    { name: "Passed", value: passedCount, color: "#10b981" },
    { name: "Failed", value: failedCount, color: "#ef4444" },
  ]

  const scoreRanges = [
    { range: "0-2", count: 0 },
    { range: "2-4", count: 0 },
    { range: "4-6", count: 0 },
    { range: "6-8", count: 0 },
    { range: "8-10", count: 0 },
  ]

  assessedCandidates.forEach((c) => {
    const score = c.overall_score
    if (score >= 0 && score < 2) scoreRanges[0].count++
    else if (score >= 2 && score < 4) scoreRanges[1].count++
    else if (score >= 4 && score < 6) scoreRanges[2].count++
    else if (score >= 6 && score < 8) scoreRanges[3].count++
    else if (score >= 8 && score <= 10) scoreRanges[4].count++
  })

  const candidatesWithTraits = assessedCandidates.filter(c => c.trait_scores && c.trait_scores.length > 0)
  
  const avgTraitScores = candidatesWithTraits.length > 0 ? (() => {
    const traitNames = candidatesWithTraits[0].trait_scores.map(t => t.trait)
    return traitNames.map(traitName => {
      const scores = candidatesWithTraits.flatMap(c => 
        c.trait_scores.filter(t => t.trait === traitName).map(t => t.ensemble_score)
      )
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
      return {
        trait: traitName,
        score: Number.parseFloat(avg.toFixed(2))
      }
    })
  })() : []

  const candidatesWithMethod = assessedCandidates.filter(c => c.method_used)
  const methodCounts = candidatesWithMethod.reduce((acc, c) => {
    const method = c.method_used.includes('Ensemble') ? 'Ensemble' 
                  : c.method_used.includes('BERT') ? 'BERT Only' 
                  : 'Gemini Only'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const methodData = Object.entries(methodCounts).map(([name, value]) => ({
    name,
    value,
    color: name === 'Ensemble' ? '#3b82f6' : name === 'BERT Only' ? '#f97316' : '#a855f7'
  }))

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Scores Bar Chart */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Overall AI Scores</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Performance overview</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallScoresData}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#e0e7ff", opacity: 0.3 }} />
                <Bar dataKey="score" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top 5 Candidates */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Top 5 Candidates</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Highest performers</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCandidatesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.5} />
                <XAxis
                  type="number"
                  domain={[0, 10]}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  width={80}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#d1fae5", opacity: 0.3 }} />
                <Bar dataKey="score" fill="url(#greenGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Trend */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Score Trend Over Time</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Performance timeline</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: "#fff", stroke: "#a855f7", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#a855f7" }}
                  fill="url(#purpleGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Average Trait Analysis */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Average Trait Analysis</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Skills distribution across all candidates</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={avgTraitScores}>
                <PolarGrid stroke="#67e8f9" opacity={0.3} />
                <PolarAngleAxis 
                  dataKey="trait" 
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fill: "#64748b", fontSize: 10 }}
                />
                <Radar
                  name="Average Score"
                  dataKey="score"
                  stroke="#0891b2"
                  fill="#06b6d4"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pass/Fail Distribution */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Pass/Fail Distribution</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Success rate analysis</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
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
                  {statusData.map((entry, index) => (
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
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">Passed: {passedCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700">Failed: {failedCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Method Usage */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-violet-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">AI Method Usage</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Assessment model distribution</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodData}
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
                  {methodData.map((entry, index) => (
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
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {methodData.map((method, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{method.name}: {method.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Distribution */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={chartVariants} className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Score Distribution</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Candidate distribution across score ranges</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreRanges}>
                <defs>
                  <linearGradient id="indigoPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
                <XAxis
                  dataKey="range"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#e0e7ff", opacity: 0.3 }} />
                <Bar dataKey="count" fill="url(#indigoPurpleGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}