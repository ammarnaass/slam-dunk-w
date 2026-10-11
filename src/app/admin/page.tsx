import fs from "fs";
import path from "path";
import Link from "next/link";
import { prisma } from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let animeCount = 0;
    let episodeCount = 0;
    let characterCount = 0;
    let userCount = 0;
    let latestAnimes: any[] = [];
    let featuredCount = 0;

    const dataDir = path.join(process.cwd(), "src/data");

    // Fetch from database with fallback
    try {
        [animeCount, episodeCount, characterCount, userCount, latestAnimes, featuredCount] = await Promise.all([
            prisma.anime.count(),
            prisma.episode.count(),
            prisma.character.count(),
            prisma.user.count(),
            prisma.anime.findMany({
                take: 6,
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.anime.count({ where: { isFeatured: true } })
        ]);
    } catch (err) {
        console.warn("Prisma query fallback on Admin Dashboard:", err);
    }

    // Local JSON fallback if needed
    if (animeCount === 0 && fs.existsSync(path.join(dataDir, "animes.json"))) {
        try {
            const animesData = JSON.parse(fs.readFileSync(path.join(dataDir, "animes.json"), "utf-8"));
            const list = Array.isArray(animesData) ? animesData : (animesData.animes || []);
            animeCount = list.length;
            latestAnimes = list.slice(0, 6);
            featuredCount = list.filter((a: any) => a.isFeatured).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (episodeCount === 0 && fs.existsSync(path.join(dataDir, "episodes.json"))) {
        try {
            const eps = JSON.parse(fs.readFileSync(path.join(dataDir, "episodes.json"), "utf-8"));
            episodeCount = (Array.isArray(eps) ? eps : (eps.episodes || [])).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (characterCount === 0 && fs.existsSync(path.join(dataDir, "characters.json"))) {
        try {
            const chars = JSON.parse(fs.readFileSync(path.join(dataDir, "characters.json"), "utf-8"));
            characterCount = (Array.isArray(chars) ? chars : (chars.characters || [])).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (userCount === 0 && fs.existsSync(path.join(dataDir, "users.json"))) {
        try {
            const users = JSON.parse(fs.readFileSync(path.join(dataDir, "users.json"), "utf-8"));
            userCount = users.length;
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col w-full gap-space-lg text-on-surface font-body-md">
            
            {/* 1. Top Command & Action Bar */}
            <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.06] shadow-md">
                <div className="flex flex-col gap-1 text-right">
                    <div className="flex items-center gap-space-sm flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-label-sm font-bold border border-primary/20">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                            GET /api/v1/admin/overview
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-secondary">sync</span>
                            متزامن • مباشر
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-extrabold">
                        لوحة القيادة والعمليات المركزية
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        مراقبة تدفق البث السحابي، إدارة أرشيف الأنمي، واستقرار خوادم المنصة
                    </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-space-sm flex-wrap">
                    <Link
                        href="/admin/animes/new"
                        className="flex items-center gap-2 px-space-lg py-space-sm rounded-xl bg-primary-container hover:brightness-110 text-on-primary-container font-headline-sm text-sm font-bold transition-all shadow-[0_8px_20px_-4px_rgba(220,38,38,0.45)]"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>+ إضافة أنمي جديد</span>
                    </Link>
                    <Link
                        href="/admin/animes"
                        className="flex items-center gap-2 px-space-md py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm font-bold transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px] text-secondary">movie</span>
                        <span>إدارة الأعمال</span>
                    </Link>
                </div>
            </section>

            {/* 2. Key Metrics Grid (4 Bento Columns) */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
                
                {/* Metric 1 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col text-right">
                            <span className="font-label-md text-label-md text-on-surface-variant font-bold">المكتبة الرقمية والأعمال</span>
                            <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{animeCount}</span>
                            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">star</span>
                                {featuredCount} عمل مميز بالسلايدر
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-[26px]">video_library</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                        <span className="text-on-surface-variant font-tajawal">الحلقات المرفوعة:</span>
                        <span className="font-mono font-bold text-on-surface">{episodeCount} حلقة</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col text-right">
                            <div className="flex items-center gap-2">
                                <span className="font-label-md text-label-md text-on-surface-variant font-bold">أبطال وشخصيات الأنمي</span>
                            </div>
                            <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{characterCount}</span>
                            <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">groups</span>
                                أبطال مسجلون بالدبلجة
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container shadow-inner">
                            <span className="material-symbols-outlined text-[26px]">person</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                        <span className="text-on-surface-variant font-tajawal">طاقم الدبلجة:</span>
                        <span className="font-mono font-bold text-secondary">مركز الزهرة + أصلي</span>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col text-right">
                            <span className="font-label-md text-label-md text-on-surface-variant font-bold">المشتركون المسجلون</span>
                            <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">{userCount}</span>
                            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                أعضاء نشطون في المنصة
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shadow-inner">
                            <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                        <span className="text-on-surface-variant font-tajawal">حالة الحسابات:</span>
                        <span className="font-mono font-bold text-emerald-400">100% نشطة</span>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="p-space-lg rounded-2xl bg-surface-container-low border border-white/[0.05] shadow-sm flex flex-col justify-between gap-space-md group hover:bg-surface-container transition-all">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col text-right">
                            <span className="font-label-md text-label-md text-on-surface-variant font-bold">حالة الخوادم و CDN</span>
                            <span className="font-headline-lg text-headline-lg text-emerald-400 font-bold tracking-tight mt-1">99.9%</span>
                            <span className="font-label-sm text-label-sm text-emerald-400 flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                جميع العقد مستقرة
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-emerald-400 shadow-inner">
                            <span className="material-symbols-outlined text-[26px]">dns</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm bg-surface-container/60 p-2 rounded-xl text-xs">
                        <span className="text-on-surface-variant font-tajawal">الاستجابة:</span>
                        <span className="font-mono font-bold text-on-surface">24ms فائق السرعة</span>
                    </div>
                </div>

            </section>

            {/* 3. Recent Animes Management Table */}
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

        </div>
    );
}
