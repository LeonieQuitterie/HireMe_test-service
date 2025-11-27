"use client";

import { useState } from "react";
import { X, Calendar, Mail, Clock, Send, Users, FileQuestion, Loader2 } from "lucide-react";
import { Test } from "@/app/types/test";

interface ScheduleTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Return schedule data for parent to process API
  onSubmit: (schedule: {
    testId: string;
    startTime: string; // ISO string for backend
    emails: string[];
  }) => void;
  test: Test; // test is required
}

export function ScheduleTestModal({
  isOpen,
  onClose,
  onSubmit,
  test,
}: ScheduleTestModalProps) {
  const [openTime, setOpenTime] = useState<string>("");
  const [emails, setEmails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!openTime) {
      alert("Please select an opening time for the test");
      return;
    }

    // Validate time is in the future
    const selectedTime = new Date(openTime);
    const now = new Date();
    if (selectedTime <= now) {
      alert("Start time must be in the future");
      return;
    }

    const emailList = emails
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailList.length === 0) {
      alert("Please enter at least one email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emailList.filter((email) => !emailRegex.test(email));
    if (invalid.length > 0) {
      alert(`Invalid email(s): ${invalid.join(", ")}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Send data to parent component to handle API call
      await onSubmit({
        testId: test.id,
        startTime: selectedTime.toISOString(),
        emails: emailList,
      });

      // Reset form
      setOpenTime("");
      setEmails("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOpenTime("");
      setEmails("");
      onClose();
    }
  };

  if (!isOpen) return null;

  const emailCount = emails.split("\n").filter((e) => e.trim().length > 0).length;
  const selectedDate = openTime ? new Date(openTime) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-indigo-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-900">
                Schedule Test Opening
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Choose the time and send invitation emails to candidates
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Test Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileQuestion className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Test Information</span>
              </div>

              <p className="font-bold text-blue-900 text-lg">{test.title}</p>

              <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{test.time_limit_minutes} minutes</span>
                </div>
                <div>
                  Passing score: <strong>{test.pass_score}%</strong>
                </div>
                <div>
                  Total questions: <strong>{test.questions_count}</strong>
                </div>
                <div>
                  Status: <strong className="text-indigo-600">{test.status}</strong>
                </div>
              </div>
            </div>

            {/* Open Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Test Opening Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              />
              {selectedDate && (
                <p className="text-xs text-gray-600 mt-2">
                  Opens at: <strong>{selectedDate.toLocaleString("en-US", {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</strong>
                </p>
              )}
            </div>

            {/* Emails */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Invitation Email List <span className="text-red-500">*</span>
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder={"candidate1@gmail.com\ncandidate2@yahoo.com\ncandidate3@company.com"}
                rows={7}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  <Users className="w-3 h-3 inline mr-1" />
                  One email per line
                </p>
                {emailCount > 0 && (
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {emailCount} recipient{emailCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-6 border-t border-indigo-100 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Schedule & Send Invitations
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}