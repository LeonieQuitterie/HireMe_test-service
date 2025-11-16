"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastId = 0;
let toastCallbacks: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: "success" | "error" | "info" = "success", duration = 3000) {
  const id = `toast-${toastId++}`;
  const toast: Toast = { id, message, type, duration };
  toastCallbacks.forEach((cb) => cb(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      if (toast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);
      }
    };

    toastCallbacks.push(handleToast);
    return () => {
      toastCallbacks = toastCallbacks.filter((cb) => cb !== handleToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-[100]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right text-white ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="ml-2 p-1 hover:bg-white/20 rounded"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
