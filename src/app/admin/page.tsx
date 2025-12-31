import Link from "next/link";
import { Film, Users, Plus, ArrowRight, Star, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prismadb";

export default async function AdminDashboard() {
    // Fetch statistics using Prisma
    const [animeCount, episodeCount, characterCount, userCount, latestAnimes, featuredCount] = await Promise.all([
        prisma.anime.count(),
        prisma.episode.count(),
        prisma.character.count(),
        prisma.user.count(),
        prisma.anime.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' }
        }),
        prisma.anime.count({ where: { isFeatured: true } })
    ]);

    const stats = [
        { label: "إجمالي الأنمي", value: animeCount, icon: Film, color: "blue", href: "/admin/animes" },
        { label: "إجمالي الحلقات", value: episodeCount, icon: Film, color: "red", href: "/admin/animes" },
        { label: "الأعمال المميزة", value: featuredCount, icon: Star, color: "amber", href: "/admin/slider" },
        { label: "المشتركون", value: userCount, icon: Users, color: "purple", href: "/admin/users" },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white mb-8">لوحة التحكم</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-600/10 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`text-${stat.color}-500`} size={24} />
                            </div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <Link
                            href={stat.href}
                            className="text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center gap-1 mt-4"
                        >
                            إدارة <ArrowRight size={12} className="rotate-180" />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Animes */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">أهم الأعمال</h2>
                        <Link href="/admin/animes" className="text-red-500 text-sm hover:underline">عرض الكل</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800">
                                    <th className="pb-3 font-medium">العمل</th>
                                    <th className="pb-3 font-medium">الحلقات</th>
                                    <th className="pb-3 font-medium">الحالة</th>
                                    <th className="pb-3 font-medium">النوع</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300 divide-y divide-slate-800/50">
                                {latestAnimes.map((anime) => (
                                    <tr key={anime.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 font-medium text-white flex items-center gap-3">
                                            <img src={anime.coverImage} className="w-8 h-10 object-cover rounded" alt="" />
                                            {anime.title}
                                        </td>
                                        <td className="py-4">{anime.totalEpisodes || 0}</td>
                                        <td className="py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${anime.status === 'ongoing' ? 'bg-green-600/10 text-green-500' : 'bg-blue-600/10 text-blue-500'
                                                }`}>
                                                {anime.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-slate-500 text-sm">{anime.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Shortcuts */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">اختصارات سريعة</h2>
                        <div className="grid gap-3">
                            <Link
                                href="/admin/animes/new"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> إضافة أنمي جديد
                            </Link>
                            <Link
                                href="/admin/slider"
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} /> إدارة السلايدر
                            </Link>
                            <Link
                                href="/admin/characters"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> إدارة الشخصيات
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
