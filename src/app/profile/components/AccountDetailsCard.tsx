"use client";

import { OTAKU_TITLES } from "@/lib/profile-presets";
import { OtakuTitle } from "@/server/types/profile.types";

interface AccountDetailsCardProps {
    username: string;
    email: string;
    phoneNumber: string;
    gender: string;
    birthDate: string;
    bio: string;
    otakuTitle: string;
    onChangeField: (field: string, value: any) => void;
}

const BIO_SUGGESTIONS = [
    "عاشق سلام دانك وصقور شوهوكو للأبد 🏀🔥",
    "أوتاكو فخور من جيل الطيبين وسبيستون الذهبية 📺✨",
    "أبحث عن الون بيس في أعماق الغراند لاين 🏴‍☠️🌊",
    "الحقيقة واحدة دائماً ولا شيء غيرها 🔍",
    "طاقة نين متدفقة وشغف لا ينتهي بالأنمي ⚡"
];

export default function AccountDetailsCard({
    username,
    email,
    phoneNumber,
    gender,
    birthDate,
    bio,
    otakuTitle,
    onChangeField,
}: AccountDetailsCardProps) {
    const maxBioLength = 180;
    const remainingChars = maxBioLength - (bio?.length || 0);

    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-lg shadow-xl space-y-space-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.05]">
                <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">badge</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            البيانات الأساسية واللقب الفخري
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            حدد هويتك واسمك ولقبك المميز بين مجتمع الأوتاكو
                        </p>
                    </div>
                </div>
            </div>

            {/* Otaku Honorary Title Badges */}
            <div className="space-y-space-xs">
                <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-400">military_tech</span>
                    <span>اللقب الفخري في المجتمع (Otaku Honorary Title)</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {OTAKU_TITLES.map((title: OtakuTitle) => {
                        const isSelected = otakuTitle === title.title;
                        return (
                            <button
                                key={title.id}
                                type="button"
                                onClick={() => onChangeField("otakuTitle", title.title)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                        ? `${title.color} ring-2 ring-primary-container/50 scale-[1.02] shadow-md`
                                        : "bg-surface-container/60 text-on-surface-variant border-white/[0.04] hover:border-white/10"
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <span className="text-sm">{title.badge}</span>
                                    <span>{title.title}</span>
                                </span>
                                {isSelected && (
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {/* Username */}
                <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                        الاسم المستعار / المعروض
                    </label>
                    <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                            person
                        </span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => onChangeField("username", e.target.value)}
                            className="w-full bg-surface-container rounded-xl pr-10 pl-4 py-3 text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none transition-all font-bold"
                            placeholder="مثال: حسان شوهوكو"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                        البريد الإلكتروني
                    </label>
                    <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                            mail
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => onChangeField("email", e.target.value)}
                            className="w-full bg-surface-container rounded-xl pr-10 pl-4 py-3 text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none transition-all font-mono"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                        رقم الهاتف (اختياري)
                    </label>
                    <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
                            phone
                        </span>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => onChangeField("phoneNumber", e.target.value)}
                            className="w-full bg-surface-container rounded-xl pr-10 pl-4 py-3 text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none transition-all font-mono"
                            placeholder="+966 50 123 4567"
                        />
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
                        الجنس
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onChangeField("gender", "male")}
                            className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                gender === "male"
                                    ? "bg-primary-container text-on-primary-container border-primary-container shadow"
                                    : "bg-surface-container text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">male</span>
                            <span>ذكر</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onChangeField("gender", "female")}
                            className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                gender === "female"
                                    ? "bg-rose-600 text-white border-rose-500 shadow"
                                    : "bg-surface-container text-on-surface-variant border-white/5 hover:bg-surface-container-high"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">female</span>
                            <span>أنثى</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Otaku Bio */}
            <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary-container">edit_note</span>
                        النبذة التعريفية (Otaku Bio)
                    </label>
                    <span className={`text-[11px] font-mono font-bold ${
                        remainingChars < 20 ? "text-error" : "text-on-surface-variant"
                    }`}>
                        {remainingChars} حرف متبقٍ
                    </span>
                </div>

                <textarea
                    rows={3}
                    maxLength={maxBioLength}
                    value={bio}
                    onChange={(e) => onChangeField("bio", e.target.value)}
                    placeholder="اكتب عبارة تصف شغفك بالأنمي أو مقولتك المفضلة..."
                    className="w-full bg-surface-container rounded-xl p-3 text-sm text-on-surface border border-white/5 focus:border-primary-container outline-none resize-none transition-all leading-relaxed"
                />

                {/* Quick Bio Suggestions */}
                <div className="pt-1 space-y-1">
                    <span className="text-[10px] text-on-surface-variant block">اقتراحات سريعة للنبذة:</span>
                    <div className="flex flex-wrap gap-1.5">
                        {BIO_SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onChangeField("bio", suggestion)}
                                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[10px] text-on-surface-variant hover:text-on-surface transition-all cursor-pointer border border-white/[0.03]"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
