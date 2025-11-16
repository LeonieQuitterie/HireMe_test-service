"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink, Eye, Search, Filter, Download } from "lucide-react"
import { candidates } from "@/data/candidates"

// ✅ Thêm interface cho props
interface CandidateTableProps {
  onViewDetails?: (candidateId: string | number) => void
}

// ✅ Thêm props vào function
export function CandidateTable({ onViewDetails }: CandidateTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg h-full flex flex-col">
        <CardHeader className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Candidate Performance</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 lg:flex-initial lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white text-sm"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-indigo-200 hover:bg-indigo-50 transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button 
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow className="bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-gray-50 hover:to-indigo-50">
                  <TableHead className="font-semibold text-gray-700">Candidate</TableHead>
                  <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700">Interview Video</TableHead>
                  <TableHead className="font-semibold text-gray-700">Score</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64">
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 font-medium text-lg">No candidates found</p>
                          <p className="text-sm text-gray-400 mt-1">Try adjusting your search query</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => {
                    return (
                      <TableRow key={candidate.id} className="hover:bg-indigo-50/50 transition-colors duration-200 border-b border-gray-100 last:border-0">
                        <TableCell className="font-medium py-4">
                          <Link href={`/candidates/${candidate.id}`} className="hover:text-indigo-600 transition-colors flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 group-hover:scale-110 transition-transform duration-200">
                              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold group-hover:underline">{candidate.name}</div>
                              <div className="text-xs text-gray-500">ID: {candidate.id}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm">{candidate.email}</span>
                            <span className="text-xs text-gray-400 mt-0.5">Submitted: {candidate.submittedAt}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <a href={candidate.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md group">
                            <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            Watch Video
                          </a>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${candidate.averageScore >= 8 ? 'bg-gradient-to-r from-green-500 to-green-400' : candidate.averageScore >= 6 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`} style={{ width: `${(candidate.averageScore / 10) * 100}%` }} />
                              </div>
                              <span className="font-bold text-lg text-gray-800">{candidate.averageScore.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-500">out of 10.0</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {candidate.status === "passed" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 font-medium px-3 py-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1.5"></span>
                              Passed
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 font-medium px-3 py-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block mr-1.5"></span>
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          {/* ✅ Kiểm tra nếu có onViewDetails thì dùng callback, không thì dùng Link */}
                          {onViewDetails ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onViewDetails(candidate.id)}
                              className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View Details
                            </Button>
                          ) : (
                            <Link href={`/candidates/${candidate.id}`}>
                              <Button size="sm" variant="outline" className="border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                                <Eye className="w-4 h-4 mr-1.5" />
                                View Details
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}