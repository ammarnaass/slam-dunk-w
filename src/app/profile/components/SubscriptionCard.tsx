import Link from "next/link";

interface SubscriptionCardProps {
    role?: string;
    isVip: boolean;
}

export default function SubscriptionCard({ role, isVip }: SubscriptionCardProps) {
    return (
        <div className="bg-surface-container-low p-space-lg rounded-2xl border border-white/[0.06] shadow-xl space-y-4" dir="rtl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">diamond</span>
                    </div>
                    <div>
                        <h3 className="font-headline-sm text-sm font-bold text-white">الاشتراك وحالة العضوية</h3>
                        <span className="font-tajawal text-xs text-[#94a3b8]">خطة المشاهدة وباقات VIP المتاحة</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-cairo ${
                    isVip 
                        ? "bg-secondary-container/20 text-secondary border border-secondary-container/40" 
                        : "bg-white/5 text-[#94a3b8] border border-white/10"
                }`}>
                    {isVip ? "عضوية VIP فعالة" : "عضوية مجانية"}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">بث فائق الجودة 4K & FHD</span>
                        <span className="font-tajawal text-[11px] text-[#94a3b8]">أعلى نقاوة صورة وصوت</span>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">block</span>
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">مشاهدة بدون فواصل إعلانية</span>
                        <span className="font-tajawal text-[11px] text-[#94a3b8]">تجربة سينمائية متواصلة</span>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">download_for_offline</span>
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">تحميل أوفلاين في التطبيق</span>
                        <span className="font-tajawal text-[11px] text-[#94a3b8]">مشاهدة أثناء السفر وبدون إنترنت</span>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">speed</span>
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">سيرفرات فائقة السرعة</span>
                        <span className="font-tajawal text-[11px] text-[#94a3b8]">أولوية قصوى بدون تقطيع</span>
                    </div>
                </div>
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <p className="font-tajawal text-xs text-[#94a3b8]">
                    {isVip ? "استمتع بجميع المزايا الحصرية لكافة كواكب الأنمي." : "قم بالترقية للحصول على تجربة VIP سينمائية متكاملة."}
                </p>
                <Link
                    href="/pricing"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-container text-on-secondary font-cairo font-bold text-xs shadow-md hover:brightness-110 transition-all"
                >
                    <span className="material-symbols-outlined text-base">diamond</span>
                    <span>{isVip ? "إدارة باقة VIP" : "ترقية إلى باقة VIP"}</span>
                </Link>
            </div>
        </div>
    );
}
