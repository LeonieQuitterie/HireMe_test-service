"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Candidate } from "@/data/candidates"
import { motion } from "framer-motion"

interface CandidateHeaderProps {
  candidate: Candidate
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{candidate.name}</h1>
                {candidate.status === "passed" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
                ) : (
                  <Badge variant="destructive">Failed</Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {formatDate(candidate.submittedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="text-center md:text-right">
                <div className="text-sm text-muted-foreground mb-1">Average Score</div>
                <div className="text-4xl font-bold text-primary">{candidate.averageScore.toFixed(2)}</div>
              </div>
              <a href={candidate.videoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Video
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
