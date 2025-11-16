"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Key,
    Video,
    BarChart3,
    CheckCircle2,
    Clock,
    Shield,
    TrendingUp,
    Play,
    Mic,
    Send,
    Zap,
    Award,
    Users,
    Globe,
    Star,
    ArrowRight,
    CheckCircle,
    Target,
    Brain,
    Eye,
    MessageSquare,
    Sparkles,
    ChevronDown
} from "lucide-react"

export default function HomePage() {
    const [roomCode, setRoomCode] = useState("")
    const router = useRouter()

    const handleJoinRoom = () => {
        if (roomCode.length === 6 && /^\d{6}$/.test(roomCode)) {
            router.push(`/test?room=${roomCode}`)
        } else {
            alert("Please enter a valid 6-digit room code.")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Hero Section with Stats */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 shadow-sm">
                        <span className="text-sm font-medium text-indigo-600 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Interview Platform
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-balance leading-tight">
                        Transform Your Recruitment
                        <br />
                        With Smart Video Interviews
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 text-balance leading-relaxed">
                        Streamline hiring with AI-powered video analysis, comprehensive candidate evaluation,
                        and data-driven insights. Save time, reduce bias, and make better hiring decisions.
                    </p>



                    {/* Scroll indicator */}
                    <div className="flex justify-center animate-bounce">
                        <ChevronDown className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>

                {/* Process Steps & HR Quick Actions Section */}
                <div className="max-w-6xl mx-auto mb-20 space-y-8">
                    {/* HR Quick Action Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Create Job Card */}
                        <div className="flex justify-center">
                            <Card className="w-full hover:shadow-2xl transition-all duration-500 border-2 border-indigo-300 hover:border-purple-500 hover:scale-105 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-indigo-800">Create Job</CardTitle>
                                    <CardDescription className="text-lg text-gray-600">
                                        Set up new job postings and start the recruitment process
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4 p-6">
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 h-12 text-base"
                                        onClick={() => router.push('/hr/jobs')}
                                    >
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Create New Job
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Create Test Card */}
                        <div className="flex justify-center">
                            <Card className="w-full hover:shadow-2xl transition-all duration-500 border-2 border-purple-300 hover:border-pink-500 hover:scale-105 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                        <Target className="w-10 h-10 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-purple-800">Create Test</CardTitle>
                                    <CardDescription className="text-lg text-gray-600">
                                        Design and launch assessment tests for candidates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4 p-6">
                                    <Button
                                        size="lg"
                                        className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 h-12 text-base"
                                        onClick={() => router.push('/hr/test')}
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Create New Test
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            How It Works
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our streamlined process makes video interviews simple and effective for everyone involved
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="relative overflow-hidden border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 opacity-10 rounded-bl-full"></div>
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <CardTitle className="text-xl text-indigo-900">For Candidates</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Receive invitation email with unique room code</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Test your camera and microphone before starting</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Record responses to pre-set questions at your own pace</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Review and re-record answers if needed</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 rounded-bl-full"></div>
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <CardTitle className="text-xl text-purple-900">AI Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Brain className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Advanced speech-to-text transcription with high accuracy</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Eye className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Sentiment analysis and confidence level detection</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Keyword matching against job requirements</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <BarChart3 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Generate comprehensive performance metrics</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-400 opacity-10 rounded-bl-full"></div>
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <CardTitle className="text-xl text-pink-900">For Recruiters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Access detailed analytics dashboard with insights</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Compare candidates side-by-side with objective metrics</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Review transcripts and video recordings anytime</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">Make data-driven hiring decisions faster</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Key Features Section */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to conduct professional video interviews and make informed hiring decisions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-green-50 border-green-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-green-800">Easy Recording</h3>
                                <p className="text-sm text-gray-600">
                                    Intuitive interface with camera preview, countdown timer, and unlimited retakes for perfect responses
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-blue-50 border-blue-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-blue-800">Advanced Analytics</h3>
                                <p className="text-sm text-gray-600">
                                    Interactive charts, sentiment graphs, and detailed performance metrics for comprehensive evaluation
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-purple-50 border-purple-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-purple-800">Time Efficient</h3>
                                <p className="text-sm text-gray-600">
                                    Reduce screening time by 70% while maintaining quality through automated initial assessments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-amber-50 border-amber-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-amber-800">Secure & Reliable</h3>
                                <p className="text-sm text-gray-600">
                                    Bank-level encryption, GDPR compliant, with automated backups and 99.9% uptime guarantee
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-indigo-50 border-indigo-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-indigo-800">Multi-Language</h3>
                                <p className="text-sm text-gray-600">
                                    Support for 25+ languages with automatic transcription and translation capabilities
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-rose-50 border-rose-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-rose-800">Team Collaboration</h3>
                                <p className="text-sm text-gray-600">
                                    Share candidate profiles, leave comments, and make collaborative hiring decisions with your team
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-teal-50 border-teal-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-teal-800">Real-time Processing</h3>
                                <p className="text-sm text-gray-600">
                                    Get instant AI analysis and results as soon as the candidate completes their interview
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:bg-cyan-50 border-cyan-200 group">
                            <CardContent className="pt-6">
                                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                                    <Video className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2 text-cyan-800">HD Video Quality</h3>
                                <p className="text-sm text-gray-600">
                                    Crystal-clear 1080p video recording with adaptive quality based on network conditions
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            What Our Users Say
                        </h2>
                        <p className="text-lg text-gray-600">
                            Trusted by leading companies worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">
                                    &quot;This platform reduced our initial screening time by 65%. The AI insights help us identify top candidates quickly and objectively.&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        SJ
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Sarah Johnson</p>
                                        <p className="text-xs text-gray-500">HR Director, TechCorp</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">
                                    &quot;The candidate experience is fantastic. We&apos;ve received overwhelmingly positive feedback about how easy and professional the process is.&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        MC
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Michael Chen</p>
                                        <p className="text-xs text-gray-500">Talent Manager, StartupHub</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-purple-400 text-purple-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">
                                    &quot;The analytics dashboard provides incredible insights we never had before. It&apos;s transformed how we make hiring decisions.&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        EP
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Emily Parker</p>
                                        <p className="text-xs text-gray-500">Recruiter, GlobalTech Inc</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

        
            </div>


            <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
        </div>
    )
}