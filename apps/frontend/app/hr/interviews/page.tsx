"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Mail,
  Eye,
  AlertCircle,
  TrendingUp,
  FileText,
  Lock,
  Trash2,
  MailPlus,
  Send,
  UserPlus
} from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

type Candidate = {
  candidate_id: string
  full_name: string
  email: string
  invited_at: string
  submitted_at: string | null
}

type TestSchedule = {
  schedule_id: string
  test_id: string
  test_title: string
  start_time: string
  end_time: string | null
  total_invited: number
  total_submitted: number
  candidates: Candidate[]
}

export default function ScheduledTestsPage() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<TestSchedule[]>([])
  const [filteredSchedules, setFilteredSchedules] = useState<TestSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState<TestSchedule | null>(null)
  const [showInvitesModal, setShowInvitesModal] = useState(false)
  const [showAddInviteModal, setShowAddInviteModal] = useState(false)
  const [newEmails, setNewEmails] = useState("")

  useEffect(() => {
    fetchSchedules()
  }, [])

  useEffect(() => {
    filterSchedules()
  }, [schedules, searchQuery])

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/schedules/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch schedules')
      }

      if (result.success) {
        setSchedules(result.data)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterSchedules = () => {
    let filtered = schedules

    if (searchQuery) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.test_title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSchedules(filtered)
  }

  const handleViewInvites = (schedule: TestSchedule) => {
    setSelectedSchedule(schedule)
    setShowInvitesModal(true)
  }

  const handleAddInvites = () => {
    setShowInvitesModal(false)
    setShowAddInviteModal(true)
  }

  

  const handleCancelSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to cancel this schedule? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()
      if (result.success) {
        alert('Schedule cancelled successfully')
        fetchSchedules()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to cancel schedule')
    }
  }

 const handleSubmitInvites = async () => {
  if (!selectedSchedule || !newEmails.trim()) return

  try {
    const token = localStorage.getItem('access_token')
    const emails = newEmails.split('\n').map(e => e.trim()).filter(e => e)

    // Validate có ít nhất 1 email
    if (emails.length === 0) {
      alert('Please enter at least one email address')
      return
    }

    const response = await fetch(`${API_BASE_URL}/api/schedules/${selectedSchedule.schedule_id}/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails }),
    })

    const result = await response.json()
    
    if (result.success) {
      alert(result.message || 'Invites sent successfully')
      setNewEmails("")
      setShowAddInviteModal(false)
      setShowInvitesModal(true)
      // Refresh schedules để cập nhật số lượng invited
      await fetchSchedules()
    } else {
      alert(result.message || 'Failed to send invites')
    }
  } catch (err) {
    console.error('Error:', err)
    alert('Failed to send invites')
  }
}

  const stats = {
    total: schedules.length,
    totalInvited: schedules.reduce((acc, s) => acc + s.total_invited, 0),
    totalSubmissions: schedules.reduce((acc, s) => acc + s.total_submitted, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Scheduled Tests Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage all your scheduled interview tests
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
                  <p className="text-xs text-gray-600">Total Schedules</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalInvited}</p>
                  <p className="text-xs text-gray-600">Total Invited</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/80 backdrop-blur-sm border-pink-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-600">{stats.totalSubmissions}</p>
                  <p className="text-xs text-gray-600">Submissions</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <Card className="bg-white/90 backdrop-blur-sm border-indigo-200 shadow-lg mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by test title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     transition-all text-sm"
                />
              </div>
            </div>

            {searchQuery ? (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Showing <span className="font-semibold text-indigo-600">{filteredSchedules.length}</span> of{" "}
                  <span className="font-semibold text-gray-700">{schedules.length}</span> schedules
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Test
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Start Time
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Invited
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Submitted
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredSchedules.map((schedule, index) => (
                  <motion.tr
                    key={schedule.schedule_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Test Info */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {schedule.test_title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Start Time */}
                    <td className="px-3 py-3 text-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(schedule.start_time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(schedule.start_time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Invited */}
                    <td className="px-3 py-3 text-center">
                      <div className="text-base font-bold text-purple-600">
                        {schedule.total_invited}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase">People</div>
                    </td>

                    {/* Submitted */}
                    <td className="px-3 py-3 text-center">
                      <div className="text-base font-bold text-green-600">
                        {schedule.total_submitted}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase">Done</div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewInvites(schedule)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

               

                        <button
                          onClick={() => handleCancelSchedule(schedule.schedule_id)}
                          className="p-1.5 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* View Invites Modal */}
      <AnimatePresence>
        {showInvitesModal && selectedSchedule && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInvitesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Invited Candidates
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedSchedule.candidates.length} total invites for {selectedSchedule.test_title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInvitesModal(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-220px)]">
                {selectedSchedule.candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No invites sent yet</p>
                    <p className="text-sm text-gray-500 mt-1">Click &quot;Add Invites&quot; to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSchedule.candidates.map((candidate) => (
                      <div
                        key={candidate.candidate_id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{candidate.full_name}</p>
                            <p className="text-xs text-gray-600">{candidate.email}</p>
                            <p className="text-xs text-gray-500">
                              Invited {new Date(candidate.invited_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div>
                          {candidate.submitted_at ? (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Submitted
                            </div>
                          ) : (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleAddInvites}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-5 h-5" />
                  Add More Invites
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Invites Modal */}
      {/* Add Invites Modal */}
      <AnimatePresence>
        {showAddInviteModal && selectedSchedule && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MailPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Add New Invites
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Send invitations for {selectedSchedule.test_title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddInviteModal(false)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Addresses
                  <span className="text-gray-500 font-normal ml-2">(one per line)</span>
                </label>
                <textarea
                  value={newEmails}
                  onChange={(e) => setNewEmails(e.target.value)}
                  placeholder="candidate1@example.com&#10;candidate2@example.com&#10;candidate3@example.com"
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none font-mono text-sm"
                />
                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Enter one email address per line. Invalid emails will be automatically skipped.</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={() => setShowAddInviteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitInvites}
                  disabled={!newEmails.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Send className="w-5 h-5" />
                  Send Invitations
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}