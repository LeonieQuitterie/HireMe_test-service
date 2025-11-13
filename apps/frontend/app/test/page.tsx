"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoRecorder } from "@/components/test/video-recorder"
import { ProgressBar } from "@/components/test/progress-bar"
import { StepIndicator } from "@/components/test/step-indicator"
import { testQuestions } from "@/data/candidates"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

type RecordingData = {
  questionId: number
  blob: Blob | null
  skipped: boolean
}

export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [recordings, setRecordings] = useState<RecordingData[]>(
    testQuestions.map((q) => ({ questionId: q.id, blob: null, skipped: false })),
  )
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = testQuestions.length + 2 // Introduction + Questions + Review
  const steps = ["Introduction", ...testQuestions.map((_, i) => `Q${i + 1}`), "Review"]

  const handleRecordingComplete = (blob: Blob) => {
    const questionIndex = currentStep - 1
    const newRecordings = [...recordings]
    newRecordings[questionIndex] = {
      questionId: testQuestions[questionIndex].id,
      blob,
      skipped: false,
    }
    setRecordings(newRecordings)
  }

  const handleSkip = () => {
    const questionIndex = currentStep - 1
    const newRecordings = [...recordings]
    newRecordings[questionIndex] = {
      questionId: testQuestions[questionIndex].id,
      blob: null,
      skipped: true,
    }
    setRecordings(newRecordings)
    handleNext()
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Simulate submission
    console.log("[v0] Submitting recordings:", recordings)
    setIsSubmitted(true)
  }

  const canProceed = () => {
    if (currentStep === 0) return true // Introduction
    if (currentStep === totalSteps - 1) return true // Review
    const questionIndex = currentStep - 1
    return recordings[questionIndex].blob !== null || recordings[questionIndex].skipped
  }

  if (isSubmitted) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center !p-0"> {/* !p-0 force full width */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="!w-[90vw] max-w-none mx-auto text-center p-12"> {/* !w-[90vw] force rộng 90% màn hình, bỏ max-w */}
          {/* Nội dung giữ nguyên */}
          <CardHeader>
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <CardTitle className="text-3xl">Thank You for Completing the Test!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Your video interview has been successfully submitted. Our HR team will review your responses and get
              back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Link href="/">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Video Interview Test</h1>
          <p className="text-center text-muted-foreground mb-6">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep + 1} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Introduction Step */}
            {currentStep === 0 && (
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to Your Video Interview</CardTitle>
                  <CardDescription className="text-base">
                    Please read the instructions carefully before starting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold">Instructions:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>You will be asked {testQuestions.length} questions</li>
                      <li>Each question has a maximum recording time of 2 minutes</li>
                      <li>You can retry each recording up to 3 times</li>
                      <li>You may skip questions if needed</li>
                      <li>Review all your recordings before final submission</li>
                      <li>Make sure you are in a quiet, well-lit environment</li>
                      <li>Test your camera and microphone before starting</li>
                    </ul>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleNext} size="lg" className="w-full bg-primary hover:bg-primary-hover">
                      Start Interview
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question Steps */}
            {currentStep > 0 && currentStep <= testQuestions.length && (
              <div className="space-y-6">
                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Question {currentStep} of {testQuestions.length}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground mt-2">
                      {testQuestions[currentStep - 1].question}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <VideoRecorder
                  onRecordingComplete={handleRecordingComplete}
                  maxDuration={testQuestions[currentStep - 1].duration}
                  maxRetries={3}
                />

                <div className="flex justify-between max-w-3xl mx-auto">
                  <Button onClick={handlePrevious} variant="outline" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex gap-3">
                    <Button onClick={handleSkip} variant="ghost" size="lg">
                      Skip Question
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      size="lg"
                      className="bg-primary hover:bg-primary-hover"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === totalSteps - 1 && (
              <div className="space-y-6">
                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">Review Your Responses</CardTitle>
                    <CardDescription className="text-base">
                      Please review all your recordings before submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {testQuestions.map((question, index) => {
                      const recording = recordings[index]
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">
                            Question {index + 1}: {question.question}
                          </h4>
                          {recording.blob ? (
                            <div className="space-y-2">
                              <video
                                src={URL.createObjectURL(recording.blob)}
                                controls
                                className="w-full rounded-lg max-h-48"
                              />
                              <p className="text-sm text-success">Recording completed</p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Question skipped</p>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                <div className="flex justify-between max-w-3xl mx-auto">
                  <Button onClick={handlePrevious} variant="outline" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} size="lg" className="bg-success hover:bg-success/90">
                    Submit Interview
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
