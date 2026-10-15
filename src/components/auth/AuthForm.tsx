"use client";

import React from "react";
import Link from "next/link";
import {
    useAuthForm,
    GoogleSignInButton,
    AuthFormInputs,
    AuthPerksColumn,
} from "./";

interface AuthFormProps {
    type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
    const {
        loading,
        error,
        showPassword,
        setShowPassword,
        formData,
        setFormData,
        isLogin,
        handleSubmit,
    } = useAuthForm({ type });

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
                                    <span
                                        className="material-symbols-outlined text-2xl"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
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
                                    : "أنشئ حسابك المجاني اليوم واستمتع بأروع العوالم الأسطورية بدقة 4K وبدون انقطاع."}
                            </p>
                        </div>

                        {/* Google Sign In */}
                        <GoogleSignInButton />

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
                        <form onSubmit={handleSubmit}>
                            <AuthFormInputs
                                isLogin={isLogin}
                                formData={formData}
                                setFormData={setFormData}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                loading={loading}
                            />
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
                <AuthPerksColumn />
            </div>
        </div>
    );
}
