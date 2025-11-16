"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function Register({ onToggleMode }: { onToggleMode: () => void }) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        role: "applicant",
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
            setError("Please accept the terms");
            return;
        }

        if (!form.name || !form.email || !form.password) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        // Giả lập delay cho frontend
        setTimeout(() => {
            setLoading(false);
            // Chuyển đến login sau đăng ký
            router.push("/auth/login");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
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
                                    onClick={() => setForm({ ...form, role: "applicant" })}
                                    className={`p-3 rounded-lg border-2 transition-colors ${form.role === "applicant"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-300 hover:border-gray-400"
                                        }`}
                                >
                                    <div className="text-sm font-medium">Candidate</div>
                                    <div className="text-xs text-gray-500">Find opportunities</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, role: "employer" })}
                                    className={`p-3 rounded-lg border-2 transition-colors ${form.role === "employer"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
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
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Re-enter your password"
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={form.acceptTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label className="text-sm text-gray-700">I agree to the terms and conditions</label>
                        </div>

                        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registering..." : "Sign up"}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => router.push('/auth/login')}
                                className="text-blue-600 hover:text-blue-500 font-medium"
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