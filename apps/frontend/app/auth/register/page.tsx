// apps/frontend/app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Register() {
   const router = useRouter();

   const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      role: "Candidate",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;

      setForm((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (form.password !== form.confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      if (!form.acceptTerms) {
         setError("Please accept terms and conditions");
         return;
      }

      setLoading(true);

      try {
         const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               name: form.name,
               email: form.email,
               password: form.password,
               role: form.role,
            }),
         });

         const data = await response.json();

         if (!data.success) {
            setError(data.message || 'Registration failed');
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
         console.error('Register error:', err);
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
               <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
               <p className="mt-2 text-sm text-gray-600">Register to start your journey</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button
                           type="button"
                           onClick={() => setForm({ ...form, role: "Candidate" })}
                           className={`p-3 rounded-lg border-2 transition-colors ${form.role === "Candidate"
                                 ? "border-indigo-500 bg-indigo-50 text-gray-900"
                                 : "border-gray-300 hover:border-gray-400"
                              }`}
                        >
                           <div className="text-sm font-medium">Candidate</div>
                           <div className="text-xs text-gray-500">Find opportunities</div>
                        </button>
                        <button
                           type="button"
                           onClick={() => setForm({ ...form, role: "HR" })}
                           className={`p-3 rounded-lg border-2 transition-colors ${form.role === "HR"
                                 ? "border-indigo-500 bg-indigo-50 text-gray-900"
                                 : "border-gray-300 hover:border-gray-400"
                              }`}
                        >
                           <div className="text-sm font-medium">HR</div>
                           <div className="text-xs text-gray-500">Hire talent</div>
                        </button>
                     </div>
                  </div>

                  {/* Name */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Full Name</label>
                     <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Doe"
                     />
                  </div>

                  {/* Email */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Email address</label>
                     <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           name="email"
                           type="email"
                           required
                           value={form.email}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           placeholder="you@example.com"
                        />
                     </div>
                  </div>

                  {/* Password */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Password</label>
                     <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           name="password"
                           type={showPassword ? "text" : "password"}
                           required
                           value={form.password}
                           onChange={handleChange}
                           className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                  {/* Confirm Password */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                     <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           name="confirmPassword"
                           type="password"
                           required
                           value={form.confirmPassword}
                           onChange={handleChange}
                           className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                           placeholder="Re-enter your password"
                        />
                     </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-center gap-2">
                     <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={form.acceptTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                     />
                     <label className="text-sm text-gray-700">I agree to the terms and conditions</label>
                  </div>

                  {error && (
                     <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={loading}
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? "Registering..." : "Sign up"}
                  </button>
               </div>

               <div className="text-center">
                  <span className="text-sm text-gray-600">
                     Already have an account?{" "}
                     <button
                        type="button"
                        onClick={() => router.push("/auth/login")}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                     >
                        Sign in
                     </button>
                  </span>
               </div>
            </form>
         </div>
      </div>
   );
}