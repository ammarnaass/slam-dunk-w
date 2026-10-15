"use client";

import { useState } from "react";

interface SecurityPasswordCardProps {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    onChangeField: (field: string, value: string) => void;
}

export default function SecurityPasswordCard({
    currentPassword = "",
    newPassword = "",
    confirmPassword = "",
    onChangeField,
}: SecurityPasswordCardProps) {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Calculate password strength
    const getStrength = (pwd: string) => {
        if (!pwd) return { level: 0, text: "غير محدد", color: "bg-surface-container-highest", textColor: "text-on-surface-variant" };
        if (pwd.length < 6) return { level: 1, text: "قصيرة جداً (أقل من 6 أحرف)", color: "bg-error", textColor: "text-error" };
        
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 1) return { level: 2, text: "مقبولة", color: "bg-amber-500", textColor: "text-amber-400" };
        if (score === 2 || score === 3) return { level: 3, text: "جيدة وقوية", color: "bg-cyan-500", textColor: "text-cyan-400" };
        return { level: 4, text: "قوية جداً ومحمية", color: "bg-emerald-500", textColor: "text-emerald-400" };
    };

    const strength = getStrength(newPassword);
    const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-lg shadow-xl space-y-space-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.05]">
                <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">lock</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            أمان الحساب وكلمة المرور
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            قم بتحديث كلمة المرور لحماية حسابك وقائمتك المفضلة
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-space-md">
                {/* Current Password */}
                <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                        كلمة المرور الحالية (مطلوبة لتأكيد التغيير)
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => onChangeField("currentPassword", e.target.value)}
                            placeholder="أدخل كلمة المرور الحالية"
                            className="w-full min-h-[48px] bg-surface-container rounded-xl pr-4 pl-12 py-3.5 text-base sm:text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none font-mono"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute left-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                            aria-label={showCurrent ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {showCurrent ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* New Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                            كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => onChangeField("newPassword", e.target.value)}
                                placeholder="6 أحرف على الأقل"
                                className="w-full min-h-[48px] bg-surface-container rounded-xl pr-4 pl-12 py-3.5 text-base sm:text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute left-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                                aria-label={showNew ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {showNew ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => onChangeField("confirmPassword", e.target.value)}
                                placeholder="أعد كتابة كلمة المرور"
                                className="w-full min-h-[48px] bg-surface-container rounded-xl pr-4 pl-12 py-3.5 text-base sm:text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute left-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                                aria-label={showConfirm ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {showConfirm ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Password Mismatch Alert */}
                {passwordsMismatch && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-error/15 border border-error/30 text-error text-xs font-bold">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>كلمتا المرور غير متطابقتين، يرجى التحقق مرة أخرى.</span>
                    </div>
                )}

                {/* Password Strength Indicator */}
                {newPassword && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-surface-container border border-white/[0.03]">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-on-surface-variant">قوة كلمة المرور:</span>
                            <span className={strength.textColor}>{strength.text}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden flex gap-1">
                            <div className={`h-full flex-1 rounded-full transition-all ${strength.level >= 1 ? strength.color : "bg-transparent"}`} />
                            <div className={`h-full flex-1 rounded-full transition-all ${strength.level >= 2 ? strength.color : "bg-transparent"}`} />
                            <div className={`h-full flex-1 rounded-full transition-all ${strength.level >= 3 ? strength.color : "bg-transparent"}`} />
                            <div className={`h-full flex-1 rounded-full transition-all ${strength.level >= 4 ? strength.color : "bg-transparent"}`} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
