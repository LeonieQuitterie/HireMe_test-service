import { KPICards } from "@/components/dashboard/kpi-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { CandidateTable } from "@/components/dashboard/candidate-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">HR Dashboard</h1>
            <p className="text-muted-foreground">Candidate video interview analytics and evaluation</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Charts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
          <DashboardCharts />
        </div>

        {/* Candidate Table */}
        <div>
          <CandidateTable />
        </div>
      </div>
    </div>
  )
}
