// apps/frontend/app/auth/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Login() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [role, setRole] = useState<"applicant" | "employer">("applicant");
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email,
               password,
            }),
         });

         const data = await response.json();

         if (!data.success) {
            setError(data.message || 'Login failed');
            setLoading(false);
            return;
         }

         // Save token and user info to localStorage
         localStorage.setItem('access_token', data.data.access_token);
         localStorage.setItem('user', JSON.stringify(data.data.user));

         // Redirect based on role
         if (data.data.user.role === 'HR') {
            router.push('/hr/dashboard');
         } else {
            router.push('/candidate/dashboard');
         }
      } catch (err) {
         console.error('Login error:', err);
         setError('Network error. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         {/* Animated Background Blobs */}
         <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
         </div>

         <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center">
               <div className="flex justify-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center">
                     <Briefcase className="w-8 h-8 text-white" />
                  </div>
               </div>
               <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
               <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="space-y-4">
                

                  {/* Email */}
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                     </label>
                     <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           id="email"
                           name="email"
                           type="email"
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="Enter your email"
                        />
                     </div>
                  </div>

                  {/* Password */}
                  <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                     </label>
                     <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           id="password"
                           name="password"
                           type={showPassword ? "text" : "password"}
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="Enter your password"
                        />
                        <button
                           type="button"
                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
                           onClick={() => setShowPassword(!showPassword)}
                        >
                           {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                           ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                           )}
                        </button>
                     </div>
                  </div>
               </div>

               {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                     {error}
                  </div>
               )}

               <div className="flex items-center justify-between">
                  <div className="flex items-center">
                     <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                     />
                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                     </label>
                  </div>
                  <button type="button" className="text-sm text-indigo-600 hover:text-indigo-500">
                     Forgot password?
                  </button>
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? "Signing in..." : "Sign in"}
               </button>

               <div className="text-center">
                  <span className="text-sm text-gray-600">
                     Don&apos;t have an account?{" "}
                     <button
                        type="button"
                        onClick={() => router.push("/auth/register")}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                     >
                        Sign up
                     </button>
                  </span>
               </div>
            </form>
         </div>
      </div>
   );
}