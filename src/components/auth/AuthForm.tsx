"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface AuthFormProps {
    type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login: setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
            const payload = type === "login"
                ? { username: formData.username, password: formData.password }
                : formData;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة");
            }

            setAuthUser(data);

            if (data.role === "ADMIN" && callbackUrl === "/") {
                router.push("/admin");
            } else {
                router.push(callbackUrl);
            }
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
            {/* Header with gradient */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 mb-4 shadow-lg shadow-red-500/50">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    {type === "login" ? "مرحباً بعودتك" : "انضم إلينا"}
                </h2>
                <p className="text-slate-400">
                    {type === "login" ? "سجل دخولك للاستمرار" : "أنشئ حساباً جديداً للبدء"}
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-center text-sm animate-in slide-in-from-top duration-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div className="group">
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            اسم المستخدم
                        </label>
                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                placeholder="أدخل اسم المستخدم"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email Field (Register only) */}
                    {type === "register" && (
                        <div className="group">
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-11 pl-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    placeholder="example@domain.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Field */}
                    <div className="group">
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-11 pl-11 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                placeholder="••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {type === "register" && (
                            <p className="text-xs text-slate-500 mt-1.5">يجب أن تكون 6 أحرف على الأقل</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] mt-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            type === "login" ? "تسجيل الدخول" : "إنشاء الحساب"
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm">
                        {type === "login" ? (
                            <>
                                ليس لديك حساب؟{" "}
                                <Link href="/register" className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors">
                                    انشئ حساب الآن
                                </Link>
                            </>
                        ) : (
                            <>
                                لديك حساب بالفعل؟{" "}
                                <Link href="/login" className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors">
                                    سجل دخولك
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
