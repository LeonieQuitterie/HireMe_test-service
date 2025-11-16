"use client";

import { useState } from "react";
import {
    Edit3,
    LogOut,
    User,
    Mail,
    Phone,
    Briefcase,
    Link2,
    Camera,
    Save,
    X,
    MapPin,
    Calendar,
    Award,
    Settings,
    Shield,
    Bell,
    Lock,
    Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast-container";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    company?: string;
    avatarUrl?: string;
    linkedinUrl?: string;
    location?: string;
    joinedDate?: string;
    bio?: string;
    department?: string;
}

const mockUser: UserProfile = {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@company.com",
    phone: "+84 123 456 789",
    role: "HR Recruiter",
    company: "HireMeAI Corp",
    department: "Human Resources",
    location: "Ho Chi Minh City, Vietnam",
    joinedDate: "January 2024",
    bio: "Passionate about connecting talented individuals with great opportunities. Specializing in tech recruitment with 5+ years of experience.",
    avatarUrl: "", // Will show fallback
    linkedinUrl: "https://linkedin.com/in/nguyenvana",
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<UserProfile>(mockUser);
    const [editForm, setEditForm] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        company: user.company || "",
        department: user.department || "",
        location: user.location || "",
        bio: user.bio || "",
        linkedinUrl: user.linkedinUrl || "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUser({
            ...user,
            ...editForm,
        });
        setIsEditing(false);
        showToast("Profile updated successfully", "success");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
        showToast("Logged out successfully", "info");
    };

    const handleCancelEdit = () => {
        setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            company: user.company || "",
            department: user.department || "",
            location: user.location || "",
            bio: user.bio || "",
            linkedinUrl: user.linkedinUrl || "",
        });
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
                <div className="max-w-6xl mx-auto px-6"> {/* Tăng max-w-4xl lên max-w-6xl (96rem ~ 1536px) cho rộng hơn, và px-4 lên px-6 cho padding đẹp hơn */}
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
                                    onClick={handleCancelEdit}
                                    className="text-white hover:bg-white/20"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                                    <div className="relative">
                                        <Avatar className="w-28 h-28 border-4 border-indigo-200 shadow-lg">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                                            <Camera className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">Profile Picture</h3>
                                        <p className="text-sm text-gray-600 mb-3">Upload a new avatar for your profile</p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    const url = URL.createObjectURL(e.target.files[0]);
                                                    setUser(prev => ({ ...prev, avatarUrl: url }));
                                                }
                                            }}
                                            className="max-w-xs"
                                        />
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-indigo-600" />
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleInputChange}
                                            required
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                            <Mail className="w-4 h-4 text-purple-600" />
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            required
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                                            <Phone className="w-4 h-4 text-green-600" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleInputChange}
                                            placeholder="+84 123 456 789"
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-red-600" />
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            value={editForm.location}
                                            onChange={handleInputChange}
                                            placeholder="City, Country"
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company" className="flex items-center gap-2 mb-2">
                                            <Briefcase className="w-4 h-4 text-blue-600" />
                                            Company
                                        </Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={editForm.company}
                                            onChange={handleInputChange}
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="department" className="flex items-center gap-2 mb-2">
                                            <Award className="w-4 h-4 text-orange-600" />
                                            Department
                                        </Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            value={editForm.department}
                                            onChange={handleInputChange}
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="linkedin" className="flex items-center gap-2 mb-2">
                                            <Link2 className="w-4 h-4 text-blue-600" />
                                            LinkedIn Profile
                                        </Label>
                                        <Input
                                            id="linkedin"
                                            name="linkedinUrl"
                                            value={editForm.linkedinUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="bio" className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-purple-600" />
                                            Bio
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={editForm.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="border-indigo-200 focus:border-indigo-500 resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Brief description for your profile</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="px-6"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="px-6 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-xl">
                            <CardContent className="p-6">
                                {/* Avatar & Name */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <Avatar className="w-32 h-32 border-4 border-indigo-200 shadow-lg">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 border-4 border-white rounded-full"></div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                                    <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                                        {user.role}
                                    </Badge>
                                </div>

                                {/* Quick Stats */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Company</p>
                                            <p className="font-semibold">{user.company}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Department</p>
                                            <p className="font-semibold">{user.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Joined</p>
                                            <p className="font-semibold">{user.joinedDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-indigo-200 hover:bg-indigo-50"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-900">
                                    <User className="w-5 h-5" />
                                    About
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{user.bio || "No bio provided yet."}</p>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-900">
                                    <Mail className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-purple-600" />
                                            Email Address
                                        </Label>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-green-600" />
                                            Phone Number
                                        </Label>
                                        <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-red-600" />
                                            Location
                                        </Label>
                                        <p className="text-gray-900 font-medium">{user.location || "Not provided"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <Link2 className="w-4 h-4 text-blue-600" />
                                            LinkedIn
                                        </Label>
                                        {user.linkedinUrl ? (
                                            <a
                                                href={user.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                View Profile
                                                <Globe className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <p className="text-gray-500">Not provided</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Privacy */}
                        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-900">
                                    <Shield className="w-5 h-5" />
                                    Security & Privacy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start border-gray-300">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-gray-300">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notification Preferences
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Logout Section */}
                        <Card className="bg-linear-to-br from-red-50 to-red-100 border-red-200 shadow-lg">

                            <CardContent className="p-3 py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-red-900 mb-1">Sign Out</h3>
                                        <p className="text-sm text-red-700">End your current session securely</p>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Button>
                                </div>
                            </CardContent>

                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}