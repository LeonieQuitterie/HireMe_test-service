"use client";

import { X, AlertTriangle, Trash2, ShieldAlert, Info } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  testName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  testName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-red-300 animate-in zoom-in-95 duration-300">
     

        {/* Header */}
        <div className="px-6 pt-4 pb-2 text-center relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          <h2 className="text-2xl font-bold text-red-600 mb-1">Delete Test?</h2>
          <p className="text-sm text-gray-600">This action is permanent and cannot be reversed</p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-5">
          {/* Warning Alert - More Prominent */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-50"></div>
            <div className="relative flex items-start gap-4 p-5 border-2 border-yellow-400 rounded-xl bg-white/80 backdrop-blur-sm">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-yellow-900 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Critical Warning
                </p>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  This action is <strong>irreversible</strong>. All test data, including questions, 
                  settings, and configurations will be permanently deleted.
                </p>
              </div>
            </div>
          </div>

         

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Note:</strong> Completed test sessions and candidate results in the database 
                will remain intact and accessible for reporting purposes.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white rounded-b-2xl">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-gray-700 shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Trash2 size={18} className="animate-pulse" />
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
}