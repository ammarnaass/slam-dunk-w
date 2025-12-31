"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
    const [formData, setFormData] = useState({
        username: "",
        email: "", // Register only
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

            // Successful auth
            setAuthUser(data);

            // Redirect based on role or callbackUrl
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
        <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
                {type === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                        اسم المستخدم
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                {type === "register" && (
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                        كلمة المرور
                    </label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        type === "login" ? "دخول" : "تسجيل"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
                {type === "login" ? (
                    <>
                        ليس لديك حساب؟{" "}
                        <Link href="/register" className="text-red-400 hover:text-red-300">
                            انشئ حساب الآن
                        </Link>
                    </>
                ) : (
                    <>
                        لديك حساب بالفعل؟{" "}
                        <Link href="/login" className="text-red-400 hover:text-red-300">
                            سجل دخولك
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
