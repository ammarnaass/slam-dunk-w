import Link from "next/link";

interface AdminRecentAnimesTableProps {
    latestAnimes: any[];
}

export function AdminRecentAnimesTable({ latestAnimes }: AdminRecentAnimesTableProps) {
    return (
        <section className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.06] shadow-xl">
            <div className="flex items-center justify-between pb-space-md border-b border-white/[0.06] mb-space-md">
                <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-6 rounded-full bg-primary-container" />
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                        آخر الأعمال المحدثة في المكتبة
                    </h2>
                </div>
                <Link
                    href="/admin/animes"
                    className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
                >
                    <span>عرض جميع الأعمال</span>
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.05] text-on-surface-variant text-xs font-cairo">
                            <th className="pb-3 pr-2">العمل</th>
                            <th className="pb-3">النوع</th>
                            <th className="pb-3">الحلقات</th>
                            <th className="pb-3">الحالة</th>
                            <th className="pb-3">التقييم</th>
                            <th className="pb-3 pl-2 text-left">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-sm">
                        {latestAnimes.map((anime) => (
                            <tr key={anime.id} className="hover:bg-surface-container/50 transition-colors">
                                <td className="py-3.5 pr-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
                                            <img
                                                src={anime.coverImage || "/hero-bg.jpg"}
                                                alt={anime.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-cairo font-bold text-on-surface line-clamp-1">
                                                {anime.title}
                                            </span>
                                            <span className="text-xs text-on-surface-variant font-tajawal">
                                                {anime.releaseYear || "2024"}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5">
                                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs font-cairo text-on-surface">
                                        {anime.type || "مسلسل"}
                                    </span>
                                </td>
                                <td className="py-3.5 font-mono text-xs text-on-surface-variant">
                                    {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "غير محدد"}
                                </td>
                                <td className="py-3.5">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                        anime.status === "completed" || anime.status === "مكتمل"
                                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/20"
                                            : "bg-primary-container/20 text-primary border border-primary-container/30"
                                    }`}>
                                        {anime.status || "مستمر"}
                                    </span>
                                </td>
                                <td className="py-3.5 font-mono font-bold text-secondary text-xs">
                                    ⭐ {anime.rating ? anime.rating.toFixed(1) : "9.2"}
                                </td>
                                <td className="py-3.5 pl-2 text-left">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link
                                            href={`/animes/${anime.id}`}
                                            target="_blank"
                                            className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface"
                                            title="عرض في الموقع"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                        </Link>
                                        <Link
                                            href={`/admin/animes/${anime.id}`}
                                            className="px-3 py-1 rounded-lg bg-primary-container text-on-primary-container text-xs font-cairo font-bold hover:brightness-110"
                                        >
                                            تعديل
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
