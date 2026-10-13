import React from "react";

const BADGES = [
    { title: "عاشق الصقور", desc: "أكملت مشاهدة موسم كامل من سلام دانك", icon: "sports_basketball", color: "text-amber-400" },
    { title: "جيل الطيبين", desc: "شاهدت 5 أعمال سبيستونية كلاسيكية", icon: "stars", color: "text-secondary" },
    { title: "مشاهد ماراثوني", desc: "شاهدت أكثر من 5 ساعات متواصلة", icon: "timer", color: "text-primary" },
    { title: "عضو مؤسس", desc: "انضممت لمنصة ANIME DAZE في انطلاقتها الأولى", icon: "verified", color: "text-emerald-400" },
    { title: "محقق الغموض", desc: "شاهدت 10 حلقات من المحقق كونان", icon: "search", color: "text-cyan-400" },
    { title: "صياد النجوم", desc: "أضفت 10 أعمال إلى قائمتك المفضلة", icon: "bookmark", color: "text-purple-400" },
];

export default function BadgesTab() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-gutter">
            {BADGES.map((b, idx) => (
                <div key={idx} className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] flex flex-col items-center text-center gap-2 shadow-md">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-1">
                        <span className={`material-symbols-outlined text-3xl ${b.color}`}>
                            {b.icon}
                        </span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold text-sm">
                        {b.title}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {b.desc}
                    </p>
                </div>
            ))}
        </div>
    );
}
