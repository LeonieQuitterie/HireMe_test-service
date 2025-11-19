// D:\HireMeAI\apps\frontend\components\test\step-indicator.tsx
"use client"

import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      {/* Subtle background - very light */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl blur-xl -z-10" />
      
      <div className="flex items-center justify-between relative z-10 py-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex items-center flex-1 relative">
              {/* Step circle - simpler, less scale */}
              <motion.div
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-700 group",
                  isCompleted && "ring-1 ring-green-200/30",
                  isCurrent && "ring-1 ring-indigo-200/30",
                )}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Subtle gradients */}
                {isCompleted ? (
                  <div className="absolute inset-0 bg-green-400/80 rounded-full" />
                ) : isCurrent ? (
                  <div className="absolute inset-0 bg-indigo-500/80 rounded-full" />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                )}
                
                <div className="relative z-10">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className={cn("text-white font-bold", isUpcoming && "text-gray-400")}>
                      {stepNumber}
                    </span>
                  )}
                </div>
                
                {/* Subtle sparkle - slower */}
                {isCurrent && (
                  <motion.div
                    className="absolute -top-1 -right-1 opacity-70"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </motion.div>
                )}
              </motion.div>

              {/* Step label - refined spacing */}
              <motion.span
                className={cn(
                  "text-xs mt-3 text-center block sm:inline-block ml-3 font-medium transition-colors duration-500 whitespace-nowrap",
                  isCurrent ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-gray-400",
                )}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {step}
              </motion.span>

              {/* Connecting line - smoother */}
              {index < steps.length - 1 && (
                <motion.div
                  className={cn(
                    "flex-1 h-1 mx-4 rounded-full relative overflow-hidden",
                    isCompleted ? "bg-green-400/80" : isCurrent ? "bg-indigo-500/80" : "bg-gray-200"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Gentle shine - slower */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full" style={{ animation: 'shine 4s infinite linear' }} />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}