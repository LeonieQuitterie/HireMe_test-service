"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    BarChart3,
    Users,
    Briefcase,
    FileText,
    User
} from "lucide-react"
import { cn } from "@/lib/utils"

export function NavbarHR() {
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
                    <Link href="/candidate/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Briefcase className="w-6 h-6" />  {/* Icon Briefcase tượng trưng cho công việc/tuyển dụng, free từ lucide-react */}
                        Hire Me
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link href="/hr/dashboard">
                            <Button
                                variant={isActive("/hr/dashboard") ? "default" : "ghost"}
                                size="sm"
                                className={cn(isActive("/hr/dashboard") && "bg-primary hover:bg-primary-hover")}
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/hr/jobs">
                            <Button
                                variant={isActive("/hr/jobs") ? "default" : "ghost"}
                                size="sm"
                                className={cn(isActive("/hr/jobs") && "bg-primary hover:bg-primary-hover")}
                            >
                                <Briefcase className="w-4 h-4 mr-2" />
                                Jobs
                            </Button>
                        </Link>

                        <Link href="/hr/test">
                            <Button
                                variant={isActive("/hr/tests") ? "default" : "ghost"}
                                size="sm"
                                className={cn(isActive("/hr/tests") && "bg-primary hover:bg-primary-hover")}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Tests
                            </Button>
                        </Link>

                        <Link href="/hr/profile">
                            <Button
                                variant={isActive("/hr/profile") ? "default" : "ghost"}
                                size="sm"
                                className={cn(isActive("/hr/profile") && "bg-primary hover:bg-primary-hover")}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}