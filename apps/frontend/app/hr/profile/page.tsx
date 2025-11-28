"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   Edit3,
   LogOut,
   User,
   Mail,
   Phone,
   Camera,
   Save,
   X,
   Shield,
   Bell,
   Lock,
   Settings,
   CheckCircle2,
   XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
   id: string;
   full_name: string;
   email: string;
   phone: string | null;
   avatar: string | null;
   role: "candidate" | "hr";
}

// Simple Toast Component (no external dependency)
function Toast({
   message,
   type = "success",
   onClose,
}: {
   message: string;
   type?: "success" | "error";
   onClose: () => void;
}) {
   useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
   }, [onClose]);

   return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-full fade-in duration-300">
         <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium min-w-[320px] ${type === "success"
               ? "bg-gradient-to-r from-emerald-500 to-green-600"
               : "bg-gradient-to-r from-red-500 to-rose-600"
               }`}
         >
            {type === "success" ? (
               <CheckCircle2 className="w-6 h-6" />
            ) : (
               <XCircle className="w-6 h-6" />
            )}
            <span>{message}</span>
            <button onClick={onClose} className="ml-auto opacity-80 hover:opacity-100">
               <X className="w-5 h-5" />
            </button>
         </div>
      </div>
   );
}

export default function ProfilePage() {
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

   const [user, setUser] = useState<UserProfile | null>(null);
   const [editForm, setEditForm] = useState({
      full_name: "",
      email: "",
      phone: "",
      avatar: "",
   });

   const router = useRouter();
   useEffect(() => {
      console.log("ProfilePage: useEffect started...");

      let response: Response | null = null;

      const fetchProfile = async () => {
         console.log("Starting fetch /api/users/me");

         try {
            setIsLoading(true);

            // 1. Check token
            const token = localStorage.getItem("access_token");
            console.log(
               "Token in localStorage:",
               token ? `Present (length: ${token.length} characters)` : "NO TOKEN!"
            );

            if (!token) {
               console.log("No token → redirect to login");
               setToast({ message: "Please log in again", type: "error" });
               router.push("/auth/login");
               return;
            }

            // 2. Call API
            console.log("Calling API /api/users/me with Bearer token...");
            response = await fetch("http://localhost:5000/api/users/me", {
               method: "GET",
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               signal: AbortSignal.timeout(10000),
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            // 3. If not ok
            if (!response.ok) {
               const errorText = await response.text();
               console.error("API returned error:", response.status, errorText);

               if (response.status === 401) {
                  console.log("401 Unauthorized → remove token + redirect to login");
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("user");
                  setToast({
                     message: "Session expired. Logging out...",
                     type: "error",
                  });
                  router.push("/auth/login");
                  return;
               }

               throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            // 4. Success → parse JSON
            console.log("API success! Parsing JSON...");
            const result = await response.json();
            console.log("Full backend response:", result);

            if (!result.success) {
               console.error("Backend returned success: false →", result.message);
               throw new Error(result.message || "Unknown error");
            }

            const data = result.data;
            console.log("User data received:", data);

            setUser(data);
            setEditForm({
               full_name: data.full_name || "",
               email: data.email || "",
               phone: data.phone || "",
               avatar: data.avatar || "",
            });

            console.log("Profile loaded successfully!");
            setToast({ message: "Profile loaded successfully!", type: "success" });

         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         } catch (err: any) {
            console.error("Error in fetchProfile:", err);

            if (err.name === "TimeoutError") {
               setToast({
                  message: "Request timeout – server too slow",
                  type: "error",
               });
            } else if (err.name === "TypeError" && err.message.includes("fetch")) {
               setToast({
                  message: "No internet connection or API server is down",
                  type: "error",
               });
            } else {
               setToast({
                  message: err.message || "Failed to load profile",
                  type: "error",
               });
            }
         } finally {
            setIsLoading(false);
            console.log("fetchProfile completed (success or failure)");
         }
      };

      fetchProfile();
   }, []);



   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleSave = async () => {
      if (!user) return;

      try {
         setSaving(true);

         const token = localStorage.getItem("access_token");
         if (!token) {
            setToast({ message: "Please log in again", type: "error" });
            router.push("/auth/login");
            return;
         }

         const res = await fetch("http://localhost:5000/api/users/me", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`, // ← thêm dòng này
            },
            credentials: "include",
            body: JSON.stringify(editForm),
         });

         const json = await res.json();

         if (!res.ok || !json.success) {
            if (res.status === 401) {
               localStorage.removeItem("access_token");
               router.push("/auth/login");
               return;
            }
            throw new Error(json.message || "Failed to update profile");
         }

         setUser((prev) => ({ ...prev!, ...json.data }));
         setIsEditing(false);
         setToast({ message: "Profile updated successfully!", type: "success" });
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
         setToast({ message: err.message || "Failed to save changes", type: "error" });
      } finally {
         setSaving(false);
      }
   };

   const handleLogout = async () => {
      if (!confirm("Are you sure you want to log out?")) return;

      try {
         await fetch("/api/auth/logout", { method: "POST" });
         setToast({ message: "Logged out successfully", type: "success" });
         setTimeout(() => router.push("/auth/login"), 1000);
      } catch {
         setToast({ message: "Logout failed", type: "error" });
      }
   };

   const getInitials = (name: string) => {
      return name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-12 w-12 rounded-full border-b-4 border-indigo-600"></div>
         </div>
      );
   }

   if (!user) {
      return (
         <div className="min-h-screen flex items-center justify-center text-red-600">
            Failed to load profile.
         </div>
      );
   }


   // Edit Mode
   if (isEditing) {
      return (
         <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
               <div className="max-w-6xl mx-auto px-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-2xl">
                     <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-t-xl">
                        <div className="flex items-center justify-between">
                           <div>
                              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                              <p className="text-indigo-100 text-sm mt-1">Update your personal information</p>
                           </div>
                           <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-white hover:bg-white/20">
                              <X className="w-5 h-5" />
                           </Button>
                        </div>
                     </div>

                     <CardContent className="p-8">
                        <div className="space-y-8">
                           {/* Avatar Section */}
                           <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                              <div className="relative">
                                 <Avatar className="w-28 h-28 border-4 border-indigo-200 shadow-lg">
                                    <AvatarImage src={editForm.avatar || undefined} alt={user.full_name} />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold">
                                       {getInitials(user.full_name)}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Camera className="w-5 h-5 text-white" />
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <h3 className="font-semibold text-gray-900 mb-1">Profile Picture</h3>
                                 <p className="text-sm text-gray-600 mb-3">Enter image URL (file upload coming soon)</p>
                                 <Input
                                    type="url"
                                    name="avatar"
                                    value={editForm.avatar}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="max-w-md"
                                 />
                              </div>
                           </div>

                           {/* Form Fields */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <Label className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Full Name
                                 </Label>
                                 <Input
                                    name="full_name"
                                    value={editForm.full_name}
                                    onChange={handleInputChange}
                                    className="border-indigo-200 focus:border-indigo-500"
                                 />
                              </div>

                              <div>
                                 <Label className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-purple-600" />
                                    Email Address
                                 </Label>
                                 <Input
                                    name="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    className="border-indigo-200 focus:border-indigo-500"
                                 />
                              </div>

                              <div>
                                 <Label className="flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    Phone Number
                                 </Label>
                                 <Input
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleInputChange}
                                    placeholder="+84 912 345 678"
                                    className="border-indigo-200 focus:border-indigo-500"
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                           <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                              Cancel
                           </Button>
                           <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                              {saving ? (
                                 <>Saving...</>
                              ) : (
                                 <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                 </>
                              )}
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
         </>
      );
   }

   // View Mode
   return (
      <>
         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
               <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                     My Profile
                  </h1>
                  <p className="text-gray-600">Manage your account information</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                     <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-xl">
                        <CardContent className="p-6">
                           <div className="text-center mb-6">
                              <Avatar className="w-32 h-32 border-4 border-indigo-200 shadow-lg mx-auto">
                                 <AvatarImage src={user.avatar || undefined} alt={user.full_name} />
                                 <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold">
                                    {getInitials(user.full_name)}
                                 </AvatarFallback>
                              </Avatar>

                              <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.full_name}</h2>
                              <p className="text-gray-600 text-sm">{user.email}</p>

                              <Badge className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-4 py-1">
                                 {user.role === "hr" ? "HR" : "Candidate"}
                              </Badge>
                           </div>

                           <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                              <div className="flex items-center gap-3 text-gray-700">
                                 <Mail className="w-5 h-5 text-blue-600" />
                                 <span className="text-sm">{user.email}</span>
                              </div>
                              {user.phone && (
                                 <div className="flex items-center gap-3 text-gray-700">
                                    <Phone className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm">{user.phone}</span>
                                 </div>
                              )}
                           </div>

                           <div className="space-y-3">
                              <Button onClick={() => setIsEditing(true)} className="w-full">
                                 <Edit3 className="w-4 h-4 mr-2" />
                                 Edit Profile
                              </Button>
                              <Button variant="outline" className="w-full border-indigo-200">
                                 <Settings className="w-4 h-4 mr-2" />
                                 Settings
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-2 space-y-6">
                     <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              Security & Privacy
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <Button variant="outline" className="w-full justify-start">
                              <Lock className="w-4 h-4 mr-2" />
                              Change Password
                           </Button>
                           <Button variant="outline" className="w-full justify-start">
                              <Bell className="w-4 h-4 mr-2" />
                              Notification Preferences
                           </Button>
                        </CardContent>
                     </Card>

                     <Card className="bg-red-50 border-red-200 shadow-lg">
                        <CardContent className="p-6 flex justify-between items-center">
                           <div>
                              <h3 className="font-semibold text-red-900">Sign Out</h3>
                              <p className="text-sm text-red-700">End your session securely</p>
                           </div>
                           <Button onClick={handleLogout} variant="destructive">
                              <LogOut className="w-4 h-4 mr-2" />
                              Log Out
                           </Button>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>

         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </>
   );
}
