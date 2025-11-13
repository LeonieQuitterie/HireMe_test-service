"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, VideoOff, RotateCcw, Play, Square } from "lucide-react"

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

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: "user" 
        },
        // Cụ Q hỏng mic 
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsPreviewing(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setError("Unable to access camera. Please check permissions and ensure no other app is using it.")
    }
  }

  const startRecording = () => {
    if (!stream) {
      setError("Camera stream not available")
      return
    }

    try {
      chunksRef.current = []
      
      // Check supported mime types
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
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setTimeRemaining(maxDuration)

      // Start countdown timer
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Video Preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted={isPreviewing && !recordedBlob} // Chỉ mute khi preview, không mute khi xem lại
              controls={recordedBlob !== null} // Hiện controls khi có recording
              className="w-full h-full object-cover" 
            />
            {!isPreviewing && !recordedBlob && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera not started</p>
                </div>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-destructive text-white px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Recording {formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isPreviewing && !recordedBlob && (
              <Button onClick={startCamera} size="lg" className="bg-primary hover:bg-primary-hover">
                <Video className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            )}

            {isPreviewing && !isRecording && !recordedBlob && (
              <Button onClick={startRecording} size="lg" className="bg-destructive hover:bg-destructive/90">
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} size="lg" variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}

            {recordedBlob && (
              <>
                <Button onClick={handleConfirm} size="lg" className="bg-success hover:bg-success/90">
                  Confirm & Continue
                </Button>
                {retryCount < maxRetries && (
                  <Button onClick={handleRetry} size="lg" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry ({retryCount}/{maxRetries})
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Maximum duration: {formatTime(maxDuration)}</p>
            <p>Retries remaining: {maxRetries - retryCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}