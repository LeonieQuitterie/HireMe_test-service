"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, Briefcase, CheckCircle, Video, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavbarCandidate() {
   const pathname = usePathname();

   const isActive = (path: string) => {
      if (path === "/" && pathname === "/") return true;
      if (path !== "/" && pathname.startsWith(path)) return true;
      return false;
   };

   return (
      <nav className="border-b border-indigo-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
               <Link
                  href="/candidate/dashboard"
                  className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
               >
                  <Briefcase className="w-6 h-6" />
                  Hire Me
               </Link>

               <div className="flex items-center gap-2">
                  <Link href="/candidate/dashboard">
                     <Button
                        variant={isActive("/candidate/dashboard") ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                           isActive("/candidate/dashboard") &&
                              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                        )}
                     >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                     </Button>
                  </Link>

                  <Link href="/candidate/profile">
                     <Button
                        variant={isActive("/candidate/profile") ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                           isActive("/candidate/profile") &&
                              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                        )}
                     >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </nav>
   );
}
