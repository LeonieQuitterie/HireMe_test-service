"use client";

import { useState } from "react";
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// DỮ LIỆU GIẢ – có thể thay đổi thoải mái
const MOCK_USER = {
   id: "1",
   full_name: "Nguyễn Văn A",
   email: "nguyenvana@example.com",
   role: "Admin",
   phone: "+84 912 345 678",
};

export default function ProfilePage() {
   const [isEditing, setIsEditing] = useState(false);

   const [editForm, setEditForm] = useState({
      full_name: MOCK_USER.full_name,
      email: MOCK_USER.email,
      phone: MOCK_USER.phone || "",
   });

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleSave = () => {
      // Chỉ để giả lập thành công, không gọi API
      setIsEditing(false);
      // Có thể thêm toast giả nếu muốn
      alert("Đã lưu thành công! (demo)");
   };

   const handleLogout = () => {
      if (confirm("Bạn có chắc muốn đăng xuất?")) {
         alert("Đã đăng xuất (demo)");
         // window.location.href = "/auth/login";
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

   // ==========================
   // EDIT MODE UI (giữ nguyên đẹp lung linh)
   // ==========================
   if (isEditing) {
      return (
         <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
            <div className="max-w-6xl mx-auto px-6">
               <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-2xl">
                  {/* Header */}
                  <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-t-xl">
                     <div className="flex items-center justify-between">
                        <div>
                           <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                           <p className="text-indigo-100 text-sm mt-1">Update your personal information</p>
                        </div>
                        <Button
                           variant="ghost"
                           onClick={() => setIsEditing(false)}
                           className="text-white hover:bg-white/20"
                        >
                           <X className="w-5 h-5" />
                        </Button>
                     </div>
                  </div>

                  <CardContent className="p-8">
                     <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                           <div className="relative">
                              <Avatar className="w-28 h-28 border-4 border-indigo-200 shadow-lg">
                                 <AvatarImage src="" alt={MOCK_USER.full_name} />
                                 <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                                    {getInitials(MOCK_USER.full_name)}
                                 </AvatarFallback>
                              </Avatar>
                              <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                 <Camera className="w-5 h-5 text-white" />
                              </button>
                           </div>

                           <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">Profile Picture</h3>
                              <p className="text-sm text-gray-600 mb-3">Upload a new avatar for your profile</p>
                              <Input type="file" accept="image/*" className="max-w-xs" disabled />
                           </div>
                        </div>

                        {/* Form */}
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
                                 Email
                              </Label>
                              <Input
                                 name="email"
                                 value={editForm.email}
                                 onChange={handleInputChange}
                                 className="border-indigo-200 focus:border-indigo-500"
                              />
                           </div>

                           <div>
                              <Label className="flex items-center gap-2 mb-2">
                                 <Phone className="w-4 h-4 text-green-600" />
                                 Phone
                              </Label>
                              <Input
                                 name="phone"
                                 value={editForm.phone}
                                 onChange={handleInputChange}
                                 placeholder="+84 123 456 789"
                                 className="border-indigo-200 focus:border-indigo-500"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                           Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-linear-to-r from-indigo-600 to-purple-600">
                           <Save className="w-4 h-4 mr-2" />
                           Save Changes
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   // ==========================
   // NORMAL PROFILE VIEW (giữ nguyên đẹp như cũ)
   // ==========================
   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
         <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
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
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl">
                                 {getInitials(MOCK_USER.full_name)}
                              </AvatarFallback>
                           </Avatar>

                           <h2 className="text-2xl font-bold text-gray-900 mt-4">{MOCK_USER.full_name}</h2>
                           <p className="text-gray-600 text-sm">{MOCK_USER.email}</p>

                           <Badge className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                              {MOCK_USER.role}
                           </Badge>
                        </div>

                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                           <div className="flex items-center gap-3 text-gray-700">
                              <Mail className="w-5 h-5 text-blue-600" />
                              <span>{MOCK_USER.email}</span>
                           </div>

                           {MOCK_USER.phone && (
                              <div className="flex items-center gap-3 text-gray-700">
                                 <Phone className="w-5 h-5 text-purple-600" />
                                 <span>{MOCK_USER.phone}</span>
                              </div>
                           )}
                        </div>

                        <div className="space-y-2">
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
                     <CardContent className="p-4 flex justify-between items-center">
                        <div>
                           <h3 className="font-semibold text-red-900">Sign Out</h3>
                           <p className="text-sm text-red-600">End your session securely</p>
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
   );
}