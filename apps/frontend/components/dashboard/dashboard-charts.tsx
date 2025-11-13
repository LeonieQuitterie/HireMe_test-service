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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Scores by Candidate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={averageScoresData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" fill="#0066cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top 5 Candidates Horizontal Bar Chart */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={chartVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCandidatesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0066cc"
                  strokeWidth={3}
                  dot={{ fill: "#0066cc", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pass/Fail Pie Chart */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={chartVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pass/Fail Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Distribution Histogram */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={chartVariants} className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
