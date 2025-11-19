import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Candidate Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">The candidate you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary-hover">Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
