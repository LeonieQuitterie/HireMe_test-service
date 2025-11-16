"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Candidate } from "@/data/candidates"
import { CheckCircle2, XCircle, AlertCircle, Video, Clock, Brain, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface CandidateQuestionDetailsProps {
  candidate: Candidate
}

export function CandidateQuestionDetails({ candidate }: CandidateQuestionDetailsProps) {
  // Mock question data - video interview questions with AI scoring
  const questions = [
    {
      id: 1,
      question: "Explain the difference between var, let, and const in JavaScript",
      score: 9.0,
      duration: "2:34", // Video duration
      aiAnalysis: {
        clarity: 9.5,
        technical: 8.8,
        confidence: 9.2,
        communication: 8.7
      },
      videoTimestamp: "00:00:00", // Timestamp trong video tổng
      status: "excellent"
    },
    {
      id: 2,
      question: "What is a closure in JavaScript?",
      score: 7.5,
      duration: "3:12",
      aiAnalysis: {
        clarity: 7.8,
        technical: 7.2,
        confidence: 7.5,
        communication: 7.6
      },
      videoTimestamp: "00:02:34",
      status: "good"
    },
    {
      id: 3,
      question: "Describe the event loop in Node.js",
      score: 5.5,
      duration: "1:58",
      aiAnalysis: {
        clarity: 6.0,
        technical: 5.2,
        confidence: 5.8,
        communication: 5.5
      },
      videoTimestamp: "00:05:46",
      status: "poor"
    },
  ]

  return (
    <div className="grid gap-4">
      {questions.map((q, index) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-500">Question {q.id}</span>
                    {q.status === 'excellent' && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Excellent
                      </Badge>
                    )}
                    {q.status === 'good' && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Good
                      </Badge>
                    )}
                    {q.status === 'poor' && (
                      <Badge className="bg-red-100 text-red-700 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Needs Improvement
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                      <Clock className="w-3 h-3" />
                      {q.duration}
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold text-gray-800 mb-1">
                    {q.question}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Video className="w-3 h-3" />
                    <span>Video starts at {q.videoTimestamp}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-3xl font-bold ${
                    q.score >= 8 ? 'text-green-600' : 
                    q.score >= 6 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {q.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* AI Analysis Breakdown */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-gray-800">AI Analysis Breakdown</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Clarity */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">Clarity</span>
                      <span className="text-xs font-bold text-gray-800">{q.aiAnalysis.clarity.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          q.aiAnalysis.clarity >= 8 ? 'bg-green-500' :
                          q.aiAnalysis.clarity >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(q.aiAnalysis.clarity / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Technical */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">Technical</span>
                      <span className="text-xs font-bold text-gray-800">{q.aiAnalysis.technical.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          q.aiAnalysis.technical >= 8 ? 'bg-green-500' :
                          q.aiAnalysis.technical >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(q.aiAnalysis.technical / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">Confidence</span>
                      <span className="text-xs font-bold text-gray-800">{q.aiAnalysis.confidence.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          q.aiAnalysis.confidence >= 8 ? 'bg-green-500' :
                          q.aiAnalysis.confidence >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(q.aiAnalysis.confidence / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Communication */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">Communication</span>
                      <span className="text-xs font-bold text-gray-800">{q.aiAnalysis.communication.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          q.aiAnalysis.communication >= 8 ? 'bg-green-500' :
                          q.aiAnalysis.communication >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(q.aiAnalysis.communication / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Action Button */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                  onClick={() => {
                    // Navigate to video with timestamp
                    console.log(`Play video at ${q.videoTimestamp}`)
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Watch Answer
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Transcript
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}