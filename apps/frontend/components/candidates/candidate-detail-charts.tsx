"use client"

import React from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

// Kiểu dữ liệu Big Five nhận từ API (có thể backend trả thêm trường khác)
export interface PersonalityScores {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  // backend có thể có thêm fields — nhưng component chỉ dùng 5 trên
  [key: string]: any
}

const traitLabels: Record<keyof PersonalityScores, string> = {
  openness: "Openness to Experience",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism",
}

const traitColors = {
  openness: "#3B82F6",
  conscientiousness: "#10B981",
  extraversion: "#8B5CF6",
  agreeableness: "#F59E0B",
  neuroticism: "#EF4444",
}

export default function CandidateDetailCharts({
  personality
}: {
  personality: PersonalityScores | null | undefined
}) {
  if (!personality) return null

  // CHỈ LẤY 5 TRAIT CỤ THỂ → tránh lấy các key phụ khác từ API
  const traitKeys: Array<keyof PersonalityScores> = [
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "neuroticism",
  ]

  const data = traitKeys.map((key) => {
    const raw = typeof personality[key] === "number" ? personality[key] : 0
    return {
      trait: traitLabels[key],
      shortTrait: key.charAt(0).toUpperCase() + key.slice(1, 3) + ".",
      value: Number(raw), // giữ 0..1
      fullMark: 1,
    }
  })

  return (
    <div className="w-full">
      {/* Radar Chart */}
      <div className="h-96 md:h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="80%">
            <PolarGrid stroke="#e5e7eb" strokeDasharray="4 4" />

            <PolarAngleAxis
              dataKey="shortTrait"
              tick={{ fontSize: 15, fontWeight: 600, fill: "#1f2937" }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 1]}
              ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => Number(v).toFixed(1)}
            />

            <Radar
              name="Personality Score"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#a78bfa"
              fillOpacity={0.7}
              strokeWidth={4}
              dot={{ r: 7, fill: "#8b5cf6", strokeWidth: 3, stroke: "#fff" }}
              animationDuration={1800}
            />

            <Tooltip
              // tooltip hiện dạng 0.00 — 1.00
              formatter={(value: number) => Number(value).toFixed(2)}
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.97)",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend dưới chart */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
        {traitKeys.map((key) => {
          const raw = typeof personality[key] === "number" ? personality[key] : 0
          return (
            <div key={String(key)} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full shadow-lg"
                style={{ backgroundColor: traitColors[key as keyof typeof traitColors] }}
              />
              <div>
                <div className="text-sm font-medium text-gray-600">{traitLabels[key]}</div>
                <div className="text-lg font-bold text-gray-900">{raw.toFixed(2)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
