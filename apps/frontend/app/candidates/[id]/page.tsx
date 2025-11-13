import { notFound } from "next/navigation"
import { candidates } from "@/data/candidates"
import { CandidateHeader } from "@/components/candidates/candidate-header"
import { CandidateDetailCharts } from "@/components/candidates/candidate-detail-charts"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function generateStaticParams() {
  return candidates.map((candidate) => ({
    id: candidate.id,
  }))
}

// THAY ĐỔI: Thêm async và await params
export default async function CandidateDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await params trước khi dùng
  const { id } = await params
  
  const candidate = candidates.find((c) => c.id === id)

  if (!candidate) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Candidate Header */}
        <div className="mb-8">
          <CandidateHeader candidate={candidate} />
        </div>

        {/* Analytics Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Detailed Analytics</h2>
        </div>

        {/* Charts Grid */}
        <CandidateDetailCharts candidate={candidate} />
      </div>
    </div>
  )
}