"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { candidates } from "@/data/candidates"
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
} from "recharts"
import { motion } from "framer-motion"
import { TrendingUp, Users, Award, BarChart3, PieChart as PieChartIcon } from "lucide-react"

// ✅ DI CHUYỂN COMPONENT RA NGOÀI
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

export function DashboardCharts() {
  // Data for average scores bar chart
  const averageScoresData = candidates.map((c) => ({
    name: c.name.split(" ")[0],
    score: Number.parseFloat(c.averageScore.toFixed(2)),
  }))

  // Data for top 5 candidates horizontal bar chart
  const topCandidatesData = [...candidates]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5)
    .map((c) => ({
      name: c.name.split(" ")[0],
      score: Number.parseFloat(c.averageScore.toFixed(2)),
    }))

  // Data for score trend line chart
  const trendData = candidates.map((c, index) => ({
    date: c.submittedAt,
    score: Number.parseFloat(c.averageScore.toFixed(2)),
    name: c.name.split(" ")[0],
  }))

  // Data for pass/fail pie chart
  const passedCount = candidates.filter((c) => c.status === "passed").length
  const failedCount = candidates.filter((c) => c.status === "failed").length
  const statusData = [
    { name: "Passed", value: passedCount, color: "#10b981" },
    { name: "Failed", value: failedCount, color: "#ef4444" },
  ]

  // Data for score distribution histogram
  const scoreRanges = [
    { range: "5.0-6.0", count: 0 },
    { range: "6.0-7.0", count: 0 },
    { range: "7.0-8.0", count: 0 },
    { range: "8.0-9.0", count: 0 },
    { range: "9.0-10.0", count: 0 },
  ]

  candidates.forEach((c) => {
    const score = c.averageScore
    if (score >= 5 && score < 6) scoreRanges[0].count++
    else if (score >= 6 && score < 7) scoreRanges[1].count++
    else if (score >= 7 && score < 8) scoreRanges[2].count++
    else if (score >= 8 && score < 9) scoreRanges[3].count++
    else if (score >= 9 && score <= 10) scoreRanges[4].count++
  })

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
      {/* Average Scores Bar Chart */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={chartVariants}>
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
          <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">Average Scores by Candidate</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">Performance overview</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageScoresData}>
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

      {/* Top 5 Candidates Horizontal Bar Chart */}
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

      {/* Score Trend Line Chart */}
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

      {/* Pass/Fail Pie Chart */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={chartVariants}>
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

      {/* Score Distribution Histogram */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={chartVariants} className="lg:col-span-2">
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