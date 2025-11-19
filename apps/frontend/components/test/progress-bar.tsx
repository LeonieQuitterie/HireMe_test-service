// D:\HireMeAI\apps\frontend\components\test\progress-bar.tsx
"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-indigo-200 shadow-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Subtle shine effect - toned down */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-full" style={{ animation: 'shine 3s infinite linear' }} />
      </motion.div>
      <div className="absolute -top-6 right-0 text-sm font-medium text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}