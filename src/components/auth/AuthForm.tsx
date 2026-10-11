"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

interface AuthFormProps {
    type: "login" | "register";
}

declare global {
    interface Window {
        google: any;
    }
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
    const isLogin = type === "login";

    useEffect(() => {
        // Initialize Google Sign-In if library is loaded
        if (window.google) {
            try {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                    callback: handleGoogleResponse,
                });
                const btnEl = document.getElementById("googleSignInDiv");
                if (btnEl) {
                    window.google.accounts.id.renderButton(
                        btnEl,
                        { theme: "filled_black", size: "large", width: "100%", text: "continue_with", shape: "pill" }
                    );
                }
            } catch (e) {
                console.error("Google auth init error", e);
            }
        }
    }, []);

    const handleGoogleResponse = async (response: any) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "فشل تسجيل الدخول بواسطة Google");

            setAuthUser(data);
            if (data.role === "ADMIN") {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin
                ? { username: formData.username, password: formData.password }
                : formData;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || (isLogin ? "فشل تسجيل الدخول" : "فشل إنشاء الحساب"));

            if (isLogin) {
                setAuthUser(data);
                if (data.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push(callbackUrl);
                }
            } else {
                // If auto-logged in or registered
                setAuthUser(data);
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
        <div className="w-full max-w-6xl mx-auto py-8">
            {/* Ambient Background Blooms */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Breadcrumb / Return Path */}
            <div className="flex items-center gap-2 mb-6 text-xs font-tajawal text-on-surface-variant">
                <Link href="/" className="hover:text-on-surface flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    <span>العودة إلى البوابة الرئيسية</span>
                </Link>
                <span>/</span>
                <span className="text-primary font-bold">
                    {isLogin ? "تسجيل الدخول" : "إنشاء حساب دايزر جديد"}
                </span>
            </div>

            {/* Main 12-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
                
                {/* Form Card (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl shadow-[0_16px_40px_rgba(0,0,0,0.65)] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
                    {/* Glowing Top Border Accent */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-container to-secondary-container" />

                    <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-space-md">
                            <div className="flex items-center gap-space-sm">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container text-primary-container shadow-[0_0_16px_rgba(220,38,38,0.35)]">
                                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        play_circle
                                    </span>
                                </span>
                                <div>
                                    <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-wide block">
                                        أنمي دايز
                                    </span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                                        بوابة العوالم الأسطورية
                                    </span>
                                </div>
                            </div>
                            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-2.5 py-1 rounded-full font-bold">
                                {isLogin ? "تسجيل الدخول" : "حساب جديد"}
                            </span>
                        </div>

                        <div className="mb-space-lg">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs font-extrabold">
                                {isLogin ? "مرحباً بعودتك إلى عالم الأنمي" : "انضم إلى عائلة ANIME DAZE"}
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                {isLogin 
                                    ? "تابع مشاهدة أعمالك المفضلة واستمتع بتجربة سينمائية فائقة الدقة وبدون انقطاع."
                                    : "أنشئ حسابك المجاني اليوم واستمتع بأروع العوالم الأسطورية بدقة 4K وبدون انقطاع."
                                }
                            </p>
                        </div>

                        {/* Google Sign In Wrapper */}
                        <div className="mb-space-md">
                            <div id="googleSignInDiv" className="w-full flex justify-center" />
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center my-space-md">
                            <div className="w-full h-px bg-white/[0.08]" />
                            <span className="absolute px-3 bg-surface-container-low text-xs font-tajawal text-on-surface-variant">
                                أو باستخدام بيانات الحساب
                            </span>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="mb-space-md p-space-sm rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-xs font-tajawal flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-space-md">
                            {/* Username or Email */}
                            <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-space-xs">
                                    {isLogin ? "اسم المستخدم أو البريد الإلكتروني" : "اسم المستخدم"}
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                                        person
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder={isLogin ? "otaku@animedaze.tv أو اسم المستخدم" : "مثال: kaito_otaku"}
                                        className="w-full bg-surface-container rounded-xl pr-11 pl-space-md py-space-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email (on Register only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface mb-space-xs">
                                        البريد الإلكتروني
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                                            alternate_email
                                        </span>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="otaku@animedaze.tv"
                                            className="w-full bg-surface-container rounded-xl pr-11 pl-space-md py-space-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-space-xs">
                                    <label className="block font-label-md text-label-md text-on-surface">
                                        كلمة المرور
                                    </label>
                                    {isLogin && (
                                        <Link href="/terms" className="font-label-sm text-label-sm text-primary hover:underline">
                                            نسيت كلمة المرور؟
                                        </Link>
                                    )}
                                </div>
                                <div className="relative flex items-center">
                                    <span className="absolute right-space-md text-on-surface-variant material-symbols-outlined pointer-events-none text-xl">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••••••"
                                        className="w-full bg-surface-container rounded-xl pr-11 pl-11 py-space-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-space-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 group relative flex items-center justify-center gap-space-sm bg-primary-container hover:brightness-110 text-on-primary-container py-space-md px-space-lg rounded-xl font-headline-sm text-headline-sm shadow-[0_0_24px_rgba(220,38,38,0.45)] active:scale-95 transition-all cursor-pointer font-bold"
                            >
                                <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
                                    {isLogin ? "login" : "person_add"}
                                </span>
                                <span>
                                    {loading ? "جاري المعالجة..." : (isLogin ? "تسجيل الدخول إلى الحساب" : "إنشاء حساب أوتاكو جديد")}
                                </span>
                            </button>
                        </form>
                    </div>

                    {/* Footer switch prompt */}
                    <div className="mt-space-lg pt-space-md border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                        <p className="font-body-md text-body-md text-on-surface-variant text-center sm:text-right">
                            {isLogin ? "ليس لديك حساب بعد؟" : "لديك حساب بالفعل؟"}
                            <Link
                                href={isLogin ? "/register" : "/login"}
                                className="text-secondary font-bold hover:underline mx-1.5"
                            >
                                {isLogin ? "اشترك الآن مجاناً" : "تسجيل الدخول"}
                            </Link>
                        </p>
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-sm text-secondary">lock</span>
                            <span>تشفير آمن 256-bit SSL</span>
                        </div>
                    </div>
                </div>

                {/* Right Decorative Column (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="h-full bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.45)] border border-white/[0.06] relative overflow-hidden">
                        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/10 rounded-full blur-2xl" />

                        <div>
                            <div className="inline-flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded-full text-secondary mb-space-md">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-label-sm text-label-sm font-bold">امتيازات حساب ANIME DAZE</span>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm font-extrabold">
                                عالمك المفضل متزامن في كل لحظة
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                                احصل على تجربة سينمائية متكاملة مصممة خصيصاً لعشاق الأنمي في العالم العربي.
                            </p>

                            <div className="space-y-space-md">
                                <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary-container flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-xl">devices</span>
                                    </div>
                                    <div>
                                        <h3 className="font-label-md text-label-md text-on-surface font-bold">مزامنة سحابية فورية</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">تابع من الدقيقة والثانية ذاتها سواء كنت على هاتفك أو حاسوبك أو شاشتك الذكية.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                                    <div className="w-10 h-10 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-xl">high_quality</span>
                                    </div>
                                    <div>
                                        <h3 className="font-label-md text-label-md text-on-surface font-bold">دقة 4K HDR ومسارات صوتية ثنائية</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">استمتع بترجمة احترافية منقحة وخيارات الدبلجة العربية الكلاسيكية بأعلى نقاء صوتي.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container/70 border border-white/[0.04]">
                                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-xl">notifications_active</span>
                                    </div>
                                    <div>
                                        <h3 className="font-label-md text-label-md text-on-surface font-bold">تنبيهات فورية لجدول الحلقات</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">كن أول من يعلم فور صدور الحلقات الأسبوعية لمسلسلات الموسم الحالي فور بثها.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fast Resume Preview Pill */}
                        <div className="mt-space-xl p-space-md rounded-xl bg-surface-container border border-white/[0.06] relative overflow-hidden">
                            <div className="flex items-center gap-space-md">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md">
                                    <img 
                                        src="/hero-bg.jpg" 
                                        alt="Recent Anime"
                                        className="w-full h-full object-cover" 
                                    />
                                    <span className="absolute bottom-0 inset-x-0 bg-primary-container text-on-primary-container text-[9px] text-center font-bold">
                                        جديد
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="font-label-sm text-label-sm text-secondary block truncate">استكمال المشاهدة الأخير</span>
                                    <span className="font-headline-sm text-headline-sm text-on-surface block truncate font-bold text-xs">
                                        سلام دانك: البطولة الوطنية
                                    </span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant block text-[11px]">
                                        الحلقة 14 • المتبقي 8 دقائق
                                    </span>
                                </div>
                                <span className="material-symbols-outlined text-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_circle
                                </span>
                            </div>
                            <div className="mt-space-sm w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary-container h-full w-2/3 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
