"use client";

import { useState } from "react";
import { X, Calendar, Mail, Clock, Send, Users } from 'lucide-react';
import { Test } from "@/lib/mock";

interface ScheduleTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTest: Test) => void;
  test?: Test;
}

export function ScheduleTestModal({ isOpen, onClose, onSubmit, test }: ScheduleTestModalProps) {
  const [openTime, setOpenTime] = useState(() => test?.openAt ? test.openAt.toISOString().slice(0, 16) : "");
  const [emails, setEmails] = useState(() => test?.invitedEmails?.join("\n") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!test) return;

    if (!openTime) {
      alert("Please select an opening time");
      return;
    }

    const emailList = emails
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      alert("Please enter at least one email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      alert(`Invalid email addresses: ${invalidEmails.join(", ")}`);
      return;
    }

    const updatedTest: Test = {
      ...test,
      openAt: new Date(openTime),
      invitedEmails: emailList,
    };

    onSubmit(updatedTest);
    onClose();
  };

  if (!isOpen || !test) return null;

  const emailCount = emails.split("\n").filter(e => e.trim()).length;
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
              <h2 className="text-xl font-bold text-indigo-900">Schedule Test Opening</h2>
              <p className="text-sm text-gray-600 mt-0.5">Set timing and send invitations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Test Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-semibold text-blue-900">Test Details</label>
              </div>
              <p className="font-bold text-blue-900 text-lg">{test.name}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                <span>{test.questions.length} questions</span>
                <span>•</span>
                <span>{test.duration} minutes</span>

              </div>
            </div>

            {/* Opening Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Opening Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all font-medium"
                required
              />
              {selectedDate && (
                <p className="text-xs text-gray-600 mt-2">
                  Test will open on <strong>{selectedDate.toLocaleString()}</strong>
                </p>
              )}
            </div>

            {/* Email Addresses */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Invite Recipients <span className="text-red-500">*</span>
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="candidate1@gmail.com&#10;candidate2@gmail.com&#10;candidate3@gmail.com"
                rows={6}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none transition-all font-mono text-sm"
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  <Users className="w-3 h-3 inline mr-1" />
                  Enter one email address per line
                </p>
                {emailCount > 0 && (
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {emailCount} {emailCount === 1 ? 'recipient' : 'recipients'}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-6 border-t border-indigo-100 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <Send size={18} />
              Schedule & Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}