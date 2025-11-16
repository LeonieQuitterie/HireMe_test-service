"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Calendar, Award, TrendingUp } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Candidate } from "@/data/candidates"
import { motion } from "framer-motion"

interface CandidateHeaderProps {
  candidate: Candidate
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const scoreColor = candidate.averageScore >= 8 ? 'text-green-600' : 
                     candidate.averageScore >= 6 ? 'text-amber-600' : 'text-red-600'
  
  const scoreGradient = candidate.averageScore >= 8 ? 'from-green-500 to-green-400' : 
                        candidate.averageScore >= 6 ? 'from-amber-500 to-amber-400' : 
                        'from-red-500 to-red-400'

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg">
                  {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                
                {/* Name & Status */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h2>
                  {candidate.status === "passed" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1.5"></span>
                      Passed Evaluation
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block mr-1.5"></span>
                      Failed Evaluation
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Submitted: {formatDate(candidate.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Right Section - Score & Actions */}
            <div className="flex flex-col items-center gap-6 lg:items-end">
              {/* Score Display */}
              <div className="text-center lg:text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-600 font-medium">Overall Score</span>
                </div>
                <div className={`text-6xl font-bold ${scoreColor} mb-2`}>
                  {candidate.averageScore.toFixed(1)}
                </div>
                <div className="relative w-48 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${scoreGradient} rounded-full transition-all duration-500`}
                    style={{ width: `${(candidate.averageScore / 10) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-1 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>out of 10.0</span>
                </div>
              </div>

              {/* Video Button */}
              <a href={candidate.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full lg:w-auto">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch Interview Video
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}