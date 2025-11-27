"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { VideoRecorder } from "@/components/test/video-recorder"
import { ProgressBar } from "@/components/test/progress-bar"
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Loader2 } from "lucide-react"
import { submitTest } from '@/lib/api/submission';

type RecordingData = {
  questionId: string
  blob: Blob | null
  skipped: boolean
}

type Question = {
  id: string
  question_text: string
  order: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [testId, setTestId] = useState<string>("")
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testInfo, setTestInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [recordings, setRecordings] = useState<RecordingData[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy testId từ params
  useEffect(() => {
    params.then((resolvedParams) => {
      setTestId(resolvedParams.id)
    })
  }, [params])

  // Fetch test questions
  useEffect(() => {
    if (!testId) return

    const fetchTestQuestions = async () => {
      try {
        const token = localStorage.getItem('access_token')

        if (!token) {
          router.push('/auth/login')
          return
        }

        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('Token payload:', payload)
          console.log('User role:', payload.role)
        }

        const response = await fetch(`${API_BASE_URL}/api/testsq/${testId}/questions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch test questions')
        }

        if (result.success) {
          setTestQuestions(result.data.questions)
          setTestInfo(result.data.test)
          setRecordings(
            result.data.questions.map((q: Question) => ({
              questionId: q.id,
              blob: null,
              skipped: false,
            }))
          )
        }
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load test')
      } finally {
        setLoading(false)
      }
    }

    fetchTestQuestions()
  }, [testId, router])

  const totalSteps = testQuestions.length + 2

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
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Filter out skipped questions
      const validAnswers = recordings
        .filter((r) => r.blob !== null)
        .map((r) => ({
          questionId: r.questionId,
          blob: r.blob!,
        }));

      if (validAnswers.length === 0) {
        alert('Please record at least one answer before submitting');
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting videos for questions:', validAnswers.map(a => a.questionId));

      // Submit test
      await submitTest({
        testId,
        answers: validAnswers,
      });

      setIsSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Submit error:', error);
      alert(error.message || 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0 || currentStep === totalSteps - 1) return true
    const questionIndex = currentStep - 1
    return recordings[questionIndex].blob !== null || recordings[questionIndex].skipped
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/candidate/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="!w-[45vw] max-w-lg bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center py-6 px-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Thank You!</CardTitle>
              <CardDescription className="text-gray-600 text-lg leading-relaxed">
                Your video interview has been successfully submitted. Our HR team will review your responses and get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Link href="/candidate/dashboard">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-colors duration-300"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-slow animation-delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob-slow animation-delay-6000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Your Interview Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Record your responses with confidence in a professional setting.
          </p>
          <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Introduction */}
            {currentStep === 0 && (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
                <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="text-center py-8 px-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Welcome to Your Video Interview
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      Please read the instructions carefully before starting your session.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">You will be asked {testQuestions.length} questions</p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Each question has a maximum recording time of 2 minutes</p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">You can retry each recording up to 3 times</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">You may skip questions if needed</p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Review all your recordings before final submission</p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">Ensure a quiet, well-lit environment and test your camera</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleNext}
                        size="lg"
                        className="max-w-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 flex items-center"
                      >
                        Start Interview <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Question Steps */}
            {currentStep > 0 && currentStep <= testQuestions.length && (
              <div className="space-y-8">
                <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-purple-100 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="text-center py-3 px-6">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      Question {currentStep} of {testQuestions.length}: {testQuestions[currentStep - 1].question_text}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <VideoRecorder onRecordingComplete={handleRecordingComplete} maxDuration={120} maxRetries={3} />

                <div className="flex justify-between max-w-4xl mx-auto">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                    className="border-gray-300 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-gray-700 font-medium transition-colors duration-300 flex items-center gap-2 px-6 py-3"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </Button>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      size="lg"
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-300 px-6 py-3"
                    >
                      Skip Question
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 px-6 py-3"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === totalSteps - 1 && (
              <div className="space-y-6">
                <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-pink-100 shadow-lg rounded-2xl overflow-hidden">
                  <CardHeader className="text-center py-4 px-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-1">Review Your Responses</CardTitle>
                    <CardDescription className="text-gray-600 text-lg mb-0">
                      Take a moment to review all your recordings before submitting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 space-y-4">
                    {testQuestions.map((question, index) => {
                      const recording = recordings[index]
                      return (
                        <motion.div
                          key={question.id}
                          className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                              Question {index + 1}
                            </h4>
                            {recording.blob ? (
                              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Completed
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                                Skipped
                              </div>
                            )}
                          </div>
                          {recording.blob ? (
                            <div className="space-y-3">
                              <video
                                src={URL.createObjectURL(recording.blob)}
                                controls
                                className="w-full rounded-lg max-h-48 object-cover shadow-inner"
                              />
                              <p className="text-sm text-green-600 font-medium flex items-center gap-2 mb-0">
                                <CheckCircle2 className="w-4 h-4" /> Ready for review
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                              <CheckCircle2 className="w-8 h-8 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500">No recording - question skipped</span>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </CardContent>
                  <div className="px-6 pb-4 flex justify-between">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="lg"
                      className="border-gray-300 hover:border-green-400 bg-white hover:bg-green-50 text-gray-700 font-medium transition-colors duration-300 flex items-center gap-2 px-6 py-3"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 flex items-center gap-2 px-6 py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Interview <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
  @keyframes blob-slow {
    0% { transform: translate(0px, 0px) scale(1); }
    50% { transform: translate(20px, -20px) scale(1.05); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob-slow {
    animation: blob-slow 20s infinite ease-in-out;
  }
  .animation-delay-3000 { 
    animation-delay: 3s; 
  }
  .animation-delay-6000 { 
    animation-delay: 6s; 
  }
`}</style>
    </div>
  )
}