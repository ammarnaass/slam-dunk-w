"use client";

import { useEffect, useState } from "react";
import { User, Anime } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, User as UserIcon, Calendar, Shield, Edit, Save, X, Phone, UserCircle, Star, Sparkles, Film, Heart } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [watchlistAnimes, setWatchlistAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "other" as "male" | "female" | "other",
        profileImage: ""
    });
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (!data) {
                        router.push("/login");
                        return;
                    }
                    setUser(data);
                    setEditForm({
                        username: data.name || data.username || "",
                        email: data.email,
                        password: "",
                        phoneNumber: data.phoneNumber || "",
                        gender: data.gender || "other",
                        profileImage: data.profileImage || ""
                    });

                    // Fetch watchlist animes
                    if (data.watchlist && data.watchlist.length > 0) {
                        try {
                            const animePromises = data.watchlist.map((id: string) =>
                                fetch(`/api/animes/${id}`).then(res => res.ok ? res.json() : null)
                            );
                            const animeData = await Promise.all(animePromises);
                            setWatchlistAnimes(animeData.filter((a: any) => a !== null));
                        } catch (err) {
                            console.error("Failed to fetch watchlist animes", err);
                        }
                    }
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });

        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "فشل التحديث");
            }

            setUser(data);
            setIsEditing(false);
            setEditForm(prev => ({ ...prev, password: "" })); // Clear password
            setMsg({ type: "success", text: "تم تحديث البيانات بنجاح" });
            router.refresh();
        } catch (error: any) {
            setMsg({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-20 animate-in fade-in zoom-in duration-500">
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">

                {/* Header / Cover */}
                <div className="bg-gradient-to-r from-red-600 to-red-900 h-40 relative">
                    {user.subscription?.status === "ACTIVE" && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                            <Sparkles size={16} /> مميز (VIP)
                        </div>
                    )}

                    <div className="absolute -bottom-16 right-8">
                        <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-900 overflow-hidden flex items-center justify-center shadow-xl">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name || user.username || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-bold text-white">
                                    {(user.name || user.username || user.email || "U")[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Link
                                href="/"
                                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                title="العودة للرئيسية"
                            >
                                <Home size={20} />
                            </Link>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                title="تعديل الملف الشخصي"
                            >
                                <Edit size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-20 px-8 pb-8">
                    {msg.text && (
                        <div className={`mb-6 p-4 rounded-lg text-center ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {msg.text}
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">تعديل البيانات</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">اسم المستخدم</label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                        required
                                        minLength={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">الجنس</label>
                                    <select
                                        value={editForm.gender}
                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                    >
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                        <option value="other">غير محدد</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-2 text-sm">رقم الهاتف</label>
                                    <input
                                        type="tel"
                                        value={editForm.phoneNumber}
                                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-slate-400 mb-2 text-sm">رابط الصورة الشخصية (URL)</label>
                                    <input
                                        type="url"
                                        value={editForm.profileImage}
                                        onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-slate-400 mb-2 text-sm">كلمة المرور الجديدة (اختياري)</label>
                                    <input
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                        placeholder="اتركه فارغاً إذا لم ترد التغيير"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> حفظ التغييرات</>}
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1 mb-8">
                                <h1 className="text-4xl font-bold text-white">{user.name || user.username || "User"}</h1>
                                <p className="text-slate-400 text-lg">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
                                    <div className="bg-blue-500/10 p-4 rounded-full text-blue-500">
                                        <Shield size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">نوع الحساب</p>
                                        <p className="font-bold text-white text-lg">
                                            {user.role === "ADMIN" ? "مدير النظام" : "مستخدم"}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
                                    <div className="bg-green-500/10 p-4 rounded-full text-green-500">
                                        <Calendar size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">تاريخ الانضمام</p>
                                        <p className="font-bold text-white text-lg">
                                            {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
                                    <div className="bg-purple-500/10 p-4 rounded-full text-purple-500">
                                        <UserCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">الجنس</p>
                                        <p className="font-bold text-white text-lg">
                                            {user.gender === "male" ? "ذكر" : user.gender === "female" ? "أنثى" : "غير محدد"}
                                        </p>
                                    </div>
                                </div>

                                {user.phoneNumber && (
                                    <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
                                        <div className="bg-orange-500/10 p-4 rounded-full text-orange-500">
                                            <Phone size={28} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">رقم الهاتف</p>
                                            <p className="font-bold text-white text-lg font-mono">
                                                {user.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subscription Status Section */}
                            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Star className="text-yellow-500" /> حالة الاشتراك
                                    </h3>
                                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${user.subscription?.status === "ACTIVE"
                                        ? "bg-green-500/20 text-green-500"
                                        : "bg-slate-600/20 text-slate-400"
                                        }`}>
                                        {user.subscription?.status === "ACTIVE" ? "اشتراك فعال" : "حساب مجاني"}
                                    </span>
                                </div>

                                {user.subscription?.status === "ACTIVE" ? (
                                    <div className="text-slate-300">
                                        <p>أنت تستمتع بمميزات العضوية المميزة حتى {user.subscription.endDate}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <p className="text-slate-300">قم بالترقية للعضوية المميزة واستمتع بالمشاهدة بدون إعلانات وبجودة 4K!</p>
                                        <button
                                            onClick={() => router.push("/pricing")}
                                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105 shadow-lg"
                                        >
                                            ترقية الاشتراك الآن
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Watchlist Section */}
                            <div className="mt-12 space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Heart className="text-red-500 fill-red-500" size={24} /> قائمة المشاهدة ({watchlistAnimes.length})
                                    </h3>
                                    {watchlistAnimes.length > 0 && (
                                        <Link href="/animes" className="text-sm text-slate-400 hover:text-red-500 transition-colors">
                                            استكشف المزيد
                                        </Link>
                                    )}
                                </div>

                                {watchlistAnimes.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {watchlistAnimes.map((anime) => (
                                            <Link
                                                key={anime.id}
                                                href={`/animes/${anime.id}`}
                                                className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-red-600/50 transition-all aspect-[2/3]"
                                            >
                                                <img
                                                    src={anime.coverImage}
                                                    alt={anime.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                                                <div className="absolute bottom-0 p-3 w-full">
                                                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                                                        {anime.title}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{anime.type} • {anime.status}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                                        <Film size={40} className="text-slate-700 mx-auto mb-3" />
                                        <p className="text-slate-500">قائمة المشاهدة الخاصة بك فارغة حالياً.</p>
                                        <Link href="/animes" className="text-red-500 text-sm font-bold mt-2 inline-block hover:underline">
                                            ابدأ بإضافة أعمالك المفضلة
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {user.role === "ADMIN" && (
                                <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-yellow-500/10 transition-colors" onClick={() => router.push("/admin")}>
                                    <div>
                                        <h3 className="text-yellow-500 font-bold mb-1 text-lg">منطقة الإدارة</h3>
                                        <p className="text-slate-400">لديك صلاحيات الوصول للوحة التحكم وإدارة المحتوى.</p>
                                    </div>
                                    <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-500 group-hover:scale-110 transition-transform">
                                        <Shield size={24} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
