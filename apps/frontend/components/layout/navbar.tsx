"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Video, BarChart3, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Video className="w-6 h-6" />
            Interview Manager
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant={isActive("/") && pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/") && pathname === "/" && "bg-primary hover:bg-primary-hover")}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/test">
              <Button
                variant={isActive("/test") ? "default" : "ghost"}
                size="sm"
                className={cn(isActive("/test") && "bg-primary hover:bg-primary-hover")}
              >
                <Video className="w-4 h-4 mr-2" />
                Take Test
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") || isActive("/candidates") ? "default" : "ghost"}
                size="sm"
                className={cn(
                  (isActive("/dashboard") || isActive("/candidates")) && "bg-primary hover:bg-primary-hover",
                )}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
