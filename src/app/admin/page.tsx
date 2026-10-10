import fs from "fs";
import path from "path";
import Link from "next/link";
import { 
    Tv, 
    Film, 
    Users, 
    Plus, 
    ArrowLeft, 
    Star, 
    Sparkles, 
    ShieldCheck, 
    Smartphone, 
    Settings, 
    CheckCircle2, 
    ExternalLink,
    Database,
    Zap,
    Clock
} from "lucide-react";
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

    // Try fetching from database with resilient fallback
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
        console.warn("Prisma query failed on Admin Dashboard, using local fallback:", err);
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

    const stats = [
        {
            label: "مسلسلات الأنمي",
            value: animeCount,
            subtext: "أعمال مضافة",
            icon: Tv,
            gradient: "from-red-600 to-rose-600",
            bgGlow: "bg-red-600/10",
            textColor: "text-red-500",
            href: "/admin/animes"
        },
        {
            label: "إجمالي الحلقات",
            value: episodeCount,
            subtext: "حلقة وسيرفر",
            icon: Film,
            gradient: "from-amber-500 to-orange-500",
            bgGlow: "bg-amber-600/10",
            textColor: "text-amber-500",
            href: "/admin/animes"
        },
        {
            label: "اللاعبين والشخصيات",
            value: characterCount,
            subtext: "ملفات شخصية",
            icon: Users,
            gradient: "from-blue-600 to-indigo-600",
            bgGlow: "bg-blue-600/10",
            textColor: "text-blue-500",
            href: "/admin/characters"
        },
        {
            label: "المشتركون المسجلون",
            value: userCount,
            subtext: "مستخدم ومدير",
            icon: ShieldCheck,
            gradient: "from-emerald-600 to-teal-600",
            bgGlow: "bg-emerald-600/10",
            textColor: "text-emerald-500",
            href: "/admin/users"
        },
    ];

    const quickActions = [
        {
            title: "إضافة أنمي جديد",
            desc: "إضافة مسلسل أو فيلم مع البوستر والتصنيفات",
            href: "/admin/animes/new",
            icon: Plus,
            color: "bg-red-600 hover:bg-red-500 text-white"
        },
        {
            title: "إدارة السلايدر البصري",
            desc: "تحديد واختيار الأعمال المميزة في الواجهة",
            href: "/admin/slider",
            icon: Sparkles,
            color: "bg-amber-600 hover:bg-amber-500 text-white"
        },
        {
            title: "إدارة الشخصيات والفرق",
            desc: "تعديل صور وبيانات لاعبي سلام دانك",
            href: "/admin/characters",
            icon: Users,
            color: "bg-blue-600 hover:bg-blue-500 text-white"
        },
        {
            title: "إعدادات تطبيق الهاتف (API)",
            desc: "إدارة التحديثات وروابط التطبيق",
            href: "/admin/api-app",
            icon: Smartphone,
            color: "bg-purple-600 hover:bg-purple-500 text-white"
        },
        {
            title: "إعدادات المنصة و AdMob",
            desc: "اسم الموقع، الشعار، وإعلانات الهاتف",
            href: "/admin/settings",
            icon: Settings,
            color: "bg-slate-800 hover:bg-slate-700 text-slate-200"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            لوحة التحكم والإدارة
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                        مرحباً بك في مركز إدارة المحتوى، المشتركين، وسيرفرات البث لمنصة سلام دانك.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>قاعدة البيانات: متصلة</span>
                    </div>

                    <Link
                        href="/admin/animes/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                    >
                        <Plus size={16} />
                        <span>إضافة عمل جديد</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div 
                            key={i} 
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 p-5 sm:p-6 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgGlow} ${stat.textColor} group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} />
                                </div>
                                <span className="text-xs font-bold text-slate-400">
                                    {stat.label}
                                </span>
                            </div>

                            <div className="flex items-baseline justify-between">
                                <div>
                                    <div className="text-3xl font-black text-white tracking-tight mb-0.5">
                                        {stat.value}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium">
                                        {stat.subtext}
                                    </div>
                                </div>

                                <Link
                                    href={stat.href}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors p-1"
                                >
                                    <span>إدارة</span>
                                    <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" />
                    <h2 className="text-base font-bold text-white">
                        إجراءات واختصارات سريعة
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={idx}
                                href={action.href}
                                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 group"
                            >
                                <div className={`p-2.5 rounded-xl ${action.color} shrink-0 group-hover:scale-105 transition-transform shadow-md`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                        {action.desc}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Animes Table & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Table (Recent Animes) */}
                <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Tv size={18} className="text-red-500" />
                            <h2 className="text-base font-bold text-white">
                                أحدث الأعمال المضافة
                            </h2>
                        </div>

                        <Link 
                            href="/admin/animes" 
                            className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center gap-1"
                        >
                            <span>عرض كل الأعمال</span>
                            <ArrowLeft size={13} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800/80 pb-2">
                                    <th className="py-2.5 pr-2 font-semibold">العمل</th>
                                    <th className="py-2.5 font-semibold">الحلقات</th>
                                    <th className="py-2.5 font-semibold">الحالة</th>
                                    <th className="py-2.5 font-semibold">النوع</th>
                                    <th className="py-2.5 pl-2 text-left font-semibold">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {latestAnimes.map((anime) => {
                                    const isOngoing = anime.status?.toLowerCase() === "ongoing" || anime.status === "مستمر";
                                    return (
                                        <tr key={anime.id} className="hover:bg-slate-800/40 transition-colors group">
                                            <td className="py-3 pr-2">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={anime.coverImage || "/hero-bg.jpg"} 
                                                        alt={anime.title} 
                                                        className="w-8 h-11 object-cover rounded-lg bg-slate-950 shrink-0 border border-white/5" 
                                                    />
                                                    <div>
                                                        <span className="font-bold text-white text-xs group-hover:text-red-400 transition-colors line-clamp-1">
                                                            {anime.title}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">
                                                            {anime.releaseYear || "1993"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 font-semibold text-white">
                                                {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}
                                            </td>

                                            <td className="py-3">
                                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    isOngoing 
                                                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                }`}>
                                                    <span className={`w-1 h-1 rounded-full ${isOngoing ? "bg-sky-400 animate-pulse" : "bg-emerald-400"}`} />
                                                    {isOngoing ? "مستمر" : "مكتمل"}
                                                </span>
                                            </td>

                                            <td className="py-3 text-slate-400">
                                                {anime.type || "TV Series"}
                                            </td>

                                            <td className="py-3 pl-2 text-left">
                                                <Link
                                                    href={`/admin/animes/${anime.id}`}
                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                                >
                                                    تعديل
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health & Status Card */}
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Database size={18} className="text-emerald-400" />
                        <h2 className="text-base font-bold text-white">
                            حالة النظام والخادم
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                            <span className="text-xs text-slate-400">قاعدة البيانات</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Neon PostgreSQL
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                            <span className="text-xs text-slate-400">الاستضافة السحابية</span>
                            <span className="text-xs font-bold text-slate-200">
                                Vercel Edge / Node 22
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                            <span className="text-xs text-slate-400">واجهة الهاتف (API)</span>
                            <span className="text-xs font-bold text-slate-200">
                                v1.0.0 (جاهز)
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                            <span className="text-xs text-slate-400">وضع الصيانة</span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                غير مفعّل (المنصة تعمل)
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Link
                            href="/admin/settings"
                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                        >
                            <Settings size={14} />
                            <span>تعديل إعدادات الصيانة و AdMob</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
