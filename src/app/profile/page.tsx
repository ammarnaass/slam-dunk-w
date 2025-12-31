"use client";

import { useEffect, useState } from "react";
import { User, Anime } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, User as UserIcon, Calendar, Shield, Edit, Save, X, Phone, UserCircle, Star, Sparkles, Film, Heart, Home, Mail, Camera } from "lucide-react";
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
        profileImage: ""
    });
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [saving, setSaving] = useState(false);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                if (!data) {
                    router.push("/login");
                    return;
                }
                setUser(data);
                setEditForm({
                    username: data.name || "",
                    email: data.email || "",
                    password: "",
                    profileImage: data.profileImage || ""
                });

                // Fetch watchlist animes
                if (data.watchlist && data.watchlist.length > 0) {
                    const animePromises = data.watchlist.map((id: string) =>
                        fetch(`/api/animes/${id}`).then(res => res.ok ? res.json() : null)
                    );
                    const animeData = await Promise.all(animePromises);
                    setWatchlistAnimes(animeData.filter((a: any) => a !== null));
                }
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

            setMsg({ type: "success", text: "تم تحديث البيانات بنجاح ✅" });
            setIsEditing(false);
            setEditForm(prev => ({ ...prev, password: "" }));

            // Refresh user data
            await fetchUser();
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
        <div className="container mx-auto px-4 py-20 max-w-6xl">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-8 mb-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    {/* Profile Image */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-slate-900">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                                    {(user.name || user.email || "U")[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        {user.subscription?.isActive && (
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <Star className="w-3 h-3 fill-current" />
                                VIP
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-right">
                        <h1 className="text-4xl font-bold text-white mb-2">{user.name || "مستخدم"}</h1>
                        <p className="text-white/80 text-lg mb-3 flex items-center gap-2 justify-center md:justify-start">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </p>
                        <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                {user.role === "ADMIN" ? "مدير" : "مستخدم"}
                            </span>
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Link
                            href="/"
                            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/20 text-white"
                            title="العودة للرئيسية"
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/20 text-white"
                                title="تعديل الملف الشخصي"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Edit Form or Stats */}
                <div className="lg:col-span-1">
                    {isEditing ? (
                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Edit className="w-5 h-5 text-red-500" />
                                    تعديل البيانات
                                </h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {msg.text && (
                                <div className={`mb-4 p-3 rounded-xl text-sm text-center animate-in slide-in-from-top ${msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {msg.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">اسم المستخدم</label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                        required
                                        minLength={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">رابط الصورة الشخصية</label>
                                    <div className="relative">
                                        <Camera className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="url"
                                            value={editForm.profileImage}
                                            onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pr-11 pl-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">كلمة المرور الجديدة (اختياري)</label>
                                    <input
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                        placeholder="اتركه فارغاً إذا لم ترد التغيير"
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02]"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                        <Save className="w-5 h-5 mr-2" /> حفظ التغييرات
                                    </>}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                حالة الاشتراك
                            </h3>

                            {user.subscription?.isActive ? (
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <p className="text-green-400 text-lg font-bold mb-2">اشتراك مميز فعال</p>
                                    <p className="text-slate-400 text-sm">
                                        صالح حتى {user.subscription.endDate ? new Date(user.subscription.endDate).toLocaleDateString('ar-EG') : ''}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Star className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 mb-4">حساب مجاني</p>
                                    <Link
                                        href="/pricing"
                                        className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-transform hover:scale-105 shadow-lg text-sm"
                                    >
                                        ترقية الاشتراك
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column - Watchlist */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                قائمتي ({watchlistAnimes.length})
                            </h3>
                            {watchlistAnimes.length > 0 && (
                                <Link href="/animes" className="text-sm text-slate-400 hover:text-red-500 transition-colors">
                                    استكشف المزيد
                                </Link>
                            )}
                        </div>

                        {watchlistAnimes.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {watchlistAnimes.map((anime) => (
                                    <Link
                                        key={anime.id}
                                        href={`/animes/${anime.id}`}
                                        className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-red-600/50 transition-all aspect-[2/3] hover:scale-105"
                                    >
                                        <img
                                            src={anime.coverImage}
                                            alt={anime.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                                        <div className="absolute bottom-0 p-3 w-full">
                                            <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-500 transition-colors">
                                                {anime.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 mb-4">قائمة المشاهدة فارغة</p>
                                <Link href="/animes" className="inline-block text-red-400 font-bold hover hover:underline">
                                    ابدأ بإضافة أعمالك المفضلة
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
