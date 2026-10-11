"use client";

import { StreamingPreferences } from "@/server/types/profile.types";

interface StreamingPreferencesCardProps {
    preferences: StreamingPreferences;
    onChangePreference: <K extends keyof StreamingPreferences>(key: K, value: StreamingPreferences[K]) => void;
}

const PLANETS = [
    { id: "رياضة", name: "كوكب رياضة", icon: "sports_basketball", color: "text-red-400 bg-red-950/40" },
    { id: "مغامرات", name: "كوكب مغامرات", icon: "explore", color: "text-amber-400 bg-amber-950/40" },
    { id: "أكشن", name: "كوكب أكشن", icon: "flash_on", color: "text-orange-400 bg-orange-950/40" },
    { id: "غموض", name: "كوكب غموض", icon: "search", color: "text-purple-400 bg-purple-950/40" },
    { id: "كوميديا", name: "كوكب كوميديا", icon: "sentiment_very_satisfied", color: "text-emerald-400 bg-emerald-950/40" },
    { id: "زمردة", name: "كوكب زمردة", icon: "diamond", color: "text-pink-400 bg-pink-950/40" },
];

export default function StreamingPreferencesCard({
    preferences,
    onChangePreference,
}: StreamingPreferencesCardProps) {
    return (
        <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-lg shadow-xl space-y-space-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-white/[0.05]">
                <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">tune</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            تفضيلات المشاهدة والبث السينمائي
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            اضبط جودة البث، لغة الصوت الافتراضية، وتشغيل الحلقات التلقائي
                        </p>
                    </div>
                </div>
            </div>

            {/* Audio Language Preference */}
            <div className="space-y-space-xs">
                <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary-container">record_voice_over</span>
                    <span>المسار الصوتي الافتراضي (Default Audio Track)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => onChangePreference("audioLanguage", "dubbed")}
                        className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                            preferences.audioLanguage === "dubbed"
                                ? "bg-primary-container/15 border-primary-container ring-2 ring-primary-container/30 shadow-md"
                                : "bg-surface-container border-white/5 hover:border-white/10"
                        }`}
                    >
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">stars</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-on-surface">دبلجة مركز الزهرة الذهبية (عربي)</span>
                                {preferences.audioLanguage === "dubbed" && (
                                    <span className="material-symbols-outlined text-[16px] text-primary-container">check_circle</span>
                                )}
                            </div>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                أصوات الجيل الذهبي الأصلية ونقاء الترجمة العربية الكلاسيكية
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onChangePreference("audioLanguage", "subbed")}
                        className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                            preferences.audioLanguage === "subbed"
                                ? "bg-secondary-container/15 border-secondary ring-2 ring-secondary/30 shadow-md"
                                : "bg-surface-container border-white/5 hover:border-white/10"
                        }`}
                    >
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">subtitles</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-on-surface">الصوت الياباني الأصلي (مترجم)</span>
                                {preferences.audioLanguage === "subbed" && (
                                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                                )}
                            </div>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                الاستماع إلى الأداء الصوتي للمؤدين اليابانيين الأصليين مع الترجمة
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Video Quality Default */}
            <div className="space-y-space-xs">
                <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">hd</span>
                    <span>الجودة التلقائية للمشغل</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                        { id: "4k", label: "4K فائقة الوضوح", badge: "VIP" },
                        { id: "1080p", label: "1080p FHD", badge: "مُوصى به" },
                        { id: "720p", label: "720p HD", badge: "اقتصادي" },
                        { id: "auto", label: "تلقائي (حسب السرعة)", badge: "ذكي" },
                    ].map((q) => {
                        const isSelected = preferences.quality === q.id;
                        return (
                            <button
                                key={q.id}
                                type="button"
                                onClick={() => onChangePreference("quality", q.id as any)}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-secondary-container/20 border-secondary text-secondary font-bold shadow"
                                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                                }`}
                            >
                                <span className="text-xs block font-bold">{q.label}</span>
                                <span className="text-[10px] opacity-70 block mt-0.5">{q.badge}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Autoplay & Planet Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                {/* Autoplay Toggle */}
                <div className="p-space-md rounded-2xl bg-surface-container flex items-center justify-between border border-white/[0.04]">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-on-surface block">التشغيل التلقائي للحلقات</span>
                        <span className="text-[10px] text-on-surface-variant block">
                            الانتقال تلقائياً للحلقة التالية بعد نهاية المشاهدة
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => onChangePreference("autoplay", !preferences.autoplay)}
                        className={`w-12 h-7 rounded-full transition-all relative cursor-pointer border ${
                            preferences.autoplay
                                ? "bg-primary-container border-primary-container"
                                : "bg-surface-container-highest border-white/10"
                        }`}
                    >
                        <span
                            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${
                                preferences.autoplay ? "left-1" : "right-1"
                            }`}
                        />
                    </button>
                </div>

                {/* Favorite Planet */}
                <div className="p-space-md rounded-2xl bg-surface-container space-y-2 border border-white/[0.04]">
                    <span className="text-xs font-bold text-on-surface block">كوكبي السبيستوني المفضل</span>
                    <div className="grid grid-cols-3 gap-1.5">
                        {PLANETS.map((planet) => {
                            const isSelected = preferences.favoritePlanet === planet.id;
                            return (
                                <button
                                    key={planet.id}
                                    type="button"
                                    onClick={() => onChangePreference("favoritePlanet", planet.id)}
                                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all border text-center cursor-pointer ${
                                        isSelected
                                            ? `${planet.color} border-white/20 shadow`
                                            : "bg-surface-container-high/60 text-on-surface-variant border-transparent hover:border-white/10"
                                    }`}
                                >
                                    {planet.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
