// D:\HireMeAI\apps\frontend\components\test\video-recorder.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Video,
  VideoOff,
  RotateCcw,
  Play,
  Square,
  Clock,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users
} from "lucide-react"

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  maxDuration: number
  maxRetries: number
}

export function VideoRecorder({ onRecordingComplete, maxDuration, maxRetries }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(maxDuration)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [faceCount, setFaceCount] = useState(0)
  const [multipleFacesDetected, setMultipleFacesDetected] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceDetectorRef = useRef<any>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load MediaPipe FaceDetector khi component mount
    loadFaceDetectionModel()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close()
      }
    }
  }, [])
const loadFaceDetectionModel = async () => {
  try {
    console.log('Bước 1: Bắt đầu tải MediaPipe Tasks Vision...')

    const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision')
    console.log('Bước 2: Import thành công!')

    console.log('Bước 3: Đang tải WASM files từ CDN...')
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    )
    console.log('Bước 4: WASM tải xong!', vision)

    console.log('Bước 5: Đang tải model .tflite (~3MB)...')
    const startTime = performance.now()

    faceDetectorRef.current = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite',
      },
      runningMode: 'VIDEO',
      minDetectionConfidence: 0.5
    })

    const loadTime = ((performance.now() - startTime) / 1000).toFixed(1)
    console.log(`HOÀN TẤT! Model load xong trong ${loadTime}s`)
    console.log('faceDetectorRef.current =', faceDetectorRef.current)

    setModelLoaded(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('MODEL LOAD THẤT BẠI TẠI ĐÂY:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    setError('Không tải được AI. Vui lòng tải lại trang.')
  }
}

const detectFaces = async () => {
  // ✅ BỎ CHECK isPreviewing, chỉ check video element
  if (!videoRef.current) {
    console.log('Video element chưa sẵn sàng')
    return
  }
  if (!faceDetectorRef.current) {
    console.log('MODEL CHƯA LOAD XONG HOẶC BỊ LỖI!')
    return
  }
  
  // ✅ CHỈ CHECK readyState
  if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
    console.log('Video chưa có đủ data')
    return
  }
  
  // ✅ BỎ check recordedBlob vì khi có recordedBlob thì interval đã bị clear rồi

  try {
    console.log('Đang detect frame...')
    const nowInMs = performance.now()
    const result = await faceDetectorRef.current.detectForVideo(videoRef.current, nowInMs)

    console.log('KẾT QUẢ DETECT:', result)
    console.log('Số khuôn mặt:', result.detections.length)
    if (result.detections.length > 0) {
      console.log('Bounding box đầu tiên:', result.detections[0].boundingBox)
      console.log('Confidence:', result.detections[0].categories[0].score)
    }

    const detectedFaces = result.detections.length
    setFaceCount(detectedFaces)

    if (detectedFaces > 1) {
      setMultipleFacesDetected(true)
      setError(`Detected ${detectedFaces} people! Only 1 allowed!`)
    } else if (detectedFaces === 0) {
      setMultipleFacesDetected(false)
      setError('No face detected. Please show your face.')
    } else {
      setMultipleFacesDetected(false)
      setError(null)
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('DETECT THẤT BẠI:', error)
    console.error(error.message)
  }
}

 const startCamera = async () => {
  try {
    setError(null)

    if (!modelLoaded) {
      setError('Face detection model is still loading. Please wait...')
      return
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user"
      },
      audio: false,
    })

    setStream(mediaStream)

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream

      // ← SỬA CHỖ NÀY: PHẢI CÓ await play() TRƯỚC KHI setIsPreviewing(true)
      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current!.play()   // ← DẤU CHẤM THAN + await là bắt buộc!
          console.log('Video đã play thành công!')
          setIsPreviewing(true)            // ← Bây giờ mới được bật

          setTimeout(() => {
            detectionIntervalRef.current = setInterval(detectFaces, 300)
            console.log('Bắt đầu detect mỗi 300ms')
          }, 800)
        } catch (err) {
          console.error('Play video bị chặn (thường do user chưa interact)', err)
        }
      }
    }
  } catch (error) {
    console.error("Error accessing camera:", error)
    setError("Unable to access camera. Please check permissions.")
  }
}

  const startRecording = () => {
    if (!stream) {
      setError("Camera stream not available")
      return
    }

    // Kiểm tra số người trước khi cho phép quay
    if (multipleFacesDetected) {
      setError("Cannot start recording: Multiple people detected in frame!")
      return
    }

    if (faceCount === 0) {
      setError("Cannot start recording: No face detected!")
      return
    }

    try {
      chunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm"

      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setRecordedBlob(blob)
        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = URL.createObjectURL(blob)
        }
        // Dừng face detection khi đã ghi xong
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setTimeRemaining(maxDuration)

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setError("Failed to start recording. Please try again.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      setIsPreviewing(false)
    }
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRecordedBlob(null)
      setRetryCount(retryCount + 1)
      setTimeRemaining(maxDuration)
      setError(null)
      setFaceCount(0)
      setMultipleFacesDetected(false)
      startCamera()
    }
  }

  const handleConfirm = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="text-center py-4 px-6">
          <CardTitle className="text-xl font-bold text-gray-800">Record Your Response</CardTitle>
          <CardDescription className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Speak clearly and maintain eye contact - Only 1 person allowed
            {modelLoaded && <span className="text-xs text-green-600">(✓ AI Ready)</span>}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 space-y-6">
          {/* Model Loading Status */}
          {!modelLoaded && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-5 py-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5"></div>
                <div className="text-sm">
                  <p className="font-medium">Loading MediaPipe AI Model...</p>
                  <p className="mt-1">Please wait while we initialize face detection</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`${multipleFacesDetected
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
                  } border px-5 py-4 rounded-xl shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {multipleFacesDetected ? 'Multiple People Detected!' : 'Detection Alert'}
                    </p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Preview */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isPreviewing && !recordedBlob}
              controls={recordedBlob !== null}
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Multiple faces warning overlay */}
            {multipleFacesDetected && isPreviewing && (
              <motion.div
                className="absolute inset-0 bg-red-500/20 border-4 border-red-500 rounded-xl flex items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl text-center">
                  <Users className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-bold text-xl">
                    {faceCount} People Detected!
                  </p>
                  <p className="text-sm mt-1">
                    Only 1 person is allowed in the frame
                  </p>
                </div>
              </motion.div>
            )}

            {!isPreviewing && !recordedBlob && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-3 opacity-60" />
                  <p className="text-lg font-medium text-gray-600">Ready to start - click below</p>
                  {!modelLoaded && (
                    <p className="text-sm text-gray-500 mt-2">Waiting for AI model...</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Face count indicator */}
            {isPreviewing && !recordedBlob && !isRecording && modelLoaded && (
              <motion.div
                className={`absolute top-4 left-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${faceCount === 1
                  ? 'bg-green-600 text-white'
                  : faceCount > 1
                    ? 'bg-red-600 text-white'
                    : 'bg-black/70 text-white'
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Faces: {faceCount} {faceCount === 1 ? '✓' : faceCount > 1 ? '✗' : '?'}
                </span>
              </motion.div>
            )}

            {isRecording && (
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 opacity-80" />
                  <span className="text-sm font-medium">Live</span>
                  <span className="text-xs ml-1">{formatTime(timeRemaining)}</span>
                </div>
              </motion.div>
            )}

            {recordedBlob && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Review your recording
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence mode="wait">
              {!isPreviewing && !recordedBlob && (
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={startCamera}
                    size="lg"
                    disabled={!modelLoaded}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 px-8 py-3 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {modelLoaded ? 'Start Camera' : 'Loading...'}
                  </Button>
                </motion.div>
              )}

              {isPreviewing && !isRecording && !recordedBlob && (
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={startRecording}
                    size="lg"
                    disabled={multipleFacesDetected || faceCount === 0}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 px-8 py-3 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </motion.div>
              )}

              {isRecording && (
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={stopRecording}
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 px-8 py-3 min-w-[160px]"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </motion.div>
              )}

              {recordedBlob && (
                <>
                  <motion.div
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={handleConfirm}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300 px-8 py-3 min-w-[180px]"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                  </motion.div>
                  {retryCount < maxRetries && (
                    <motion.div
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={handleRetry}
                        size="lg"
                        variant="outline"
                        className="border-gray-300 hover:border-purple-400 bg-white hover:bg-purple-50 text-gray-700 font-semibold transition-all duration-300 px-8 py-3"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retry ({retryCount + 1}/{maxRetries})
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <motion.div
              className="flex items-center justify-center gap-2 text-indigo-600 font-medium p-3 bg-indigo-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Max: {formatTime(maxDuration)}</span>
            </motion.div>
            <motion.div
              className="flex items-center justify-center gap-2 text-purple-600 font-medium p-3 bg-purple-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Retries: {maxRetries - retryCount}</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}