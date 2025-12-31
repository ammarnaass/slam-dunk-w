"use client";

import { useEffect, useState } from "react";
import { User, Anime } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, User as UserIcon, Calendar, Shield, Edit, Save, X, Phone, UserCircle, Star, Sparkles, Film, Heart, Home, Mail, Camera } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";

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
        profileImage: "",
        gender: "",
        phoneNumber: "",
        birthDate: ""
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
                    profileImage: data.avatar || data.profileImage || "",
                    gender: data.gender || "",
                    phoneNumber: data.phoneNumber || "",
                    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : ""
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setMsg({ type: "error", text: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

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
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Navbar />
            <Breadcrumbs />

            <div className="container mx-auto px-4 py-10 max-w-6xl">
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-slate-900 group-hover:scale-105 transition-transform duration-500">
                                {user.avatar || user.profileImage ? (
                                    <img src={user.avatar || user.profileImage} alt={user.name || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                                        {(user.name || user.email || "U")[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Camera className="w-8 h-8" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                            {user.subscription?.isActive && (
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border-2 border-slate-900">
                                    <Star className="w-3 h-3 fill-current" />
                                    VIP
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-right">
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">{user.name || "مستخدم"}</h1>
                            <p className="text-white/80 text-lg mb-4 flex items-center gap-2 justify-center md:justify-start">
                                <Mail className="w-4 h-4 opacity-70" />
                                {user.email}
                            </p>
                            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                                <span className="px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-white text-sm font-medium flex items-center gap-2 border border-white/10">
                                    <Shield className="w-4 h-4 text-red-300" />
                                    {user.role === "ADMIN" ? "مدير" : "مستخدم"}
                                </span>
                                <span className="px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-white text-sm font-medium flex items-center gap-2 border border-white/10">
                                    <Calendar className="w-4 h-4 text-red-300" />
                                    {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Link
                                href="/"
                                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/20 text-white shadow-xl"
                                title="العودة للرئيسية"
                            >
                                <Home className="w-5 h-5" />
                            </Link>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/20 text-white shadow-xl"
                                    title="تعديل الملف الشخصي"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Edit Form or Stats */}
                    <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000">
                        {isEditing ? (
                            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl p-8 sticky top-24">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-lg">
                                            <Edit className="w-5 h-5 text-red-500" />
                                        </div>
                                        تعديل البيانات
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {msg.text && (
                                    <div className={`mb-6 p-4 rounded-2xl text-sm text-center animate-in slide-in-from-top duration-300 ${msg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {msg.text}
                                    </div>
                                )}

                                <form onSubmit={handleUpdate} className="space-y-5">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">اسم المستخدم</label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all"
                                            required
                                            minLength={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">الجنس</label>
                                            <select
                                                value={editForm.gender}
                                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all appearance-none"
                                            >
                                                <option value="" disabled className="bg-slate-900">اختر الجنس</option>
                                                <option value="male" className="bg-slate-900">ذكر</option>
                                                <option value="female" className="bg-slate-900">أنثى</option>
                                                <option value="other" className="bg-slate-900">أخرى</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">رقم الهاتف</label>
                                            <div className="relative">
                                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                                <input
                                                    type="tel"
                                                    value={editForm.phoneNumber}
                                                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pr-12 pl-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all text-left"
                                                    dir="ltr"
                                                    placeholder="+966 50 000 0000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">تاريخ الميلاد</label>
                                        <div className="relative">
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                            <input
                                                type="date"
                                                value={editForm.birthDate}
                                                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pr-12 pl-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all text-right"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">رابط الصورة الشخصية (اختياري)</label>
                                        <div className="relative">
                                            <Camera className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                            <input
                                                type="url"
                                                value={editForm.profileImage.startsWith('data:') ? 'صورة مرفوعة' : editForm.profileImage}
                                                disabled={editForm.profileImage.startsWith('data:')}
                                                onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pr-12 pl-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all disabled:opacity-50"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {editForm.profileImage.startsWith('data:') && (
                                                <button
                                                    type="button"
                                                    onClick={() => setEditForm({ ...editForm, profileImage: "" })}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold"
                                                >
                                                    إزالة
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 pr-1">كلمة المرور الجديدة (اختياري)</label>
                                        <input
                                            type="password"
                                            value={editForm.password}
                                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02]"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                            <Save className="w-5 h-5 ml-2" /> حفظ التغييرات
                                        </>}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-8 pr-1 flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    حالة الاشتراك
                                </h3>

                                {user.subscription?.isActive ? (
                                    <div className="text-center group">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                                            <Sparkles className="w-12 h-12 text-white" />
                                        </div>
                                        <p className="text-yellow-400 text-xl font-black mb-1">اشتراك مميز فعال</p>
                                        <p className="text-slate-500 text-sm">
                                            صالح حتى {user.subscription.endDate ? new Date(user.subscription.endDate).toLocaleDateString('ar-EG') : ''}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center group">
                                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 -rotate-3 group-hover:rotate-0">
                                            <Star className="w-12 h-12 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 font-bold mb-6 italic">حساب مجاني</p>
                                        <Link
                                            href="/pricing"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black px-8 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-yellow-500/10 text-sm"
                                        >
                                            <Sparkles size={16} /> مميز (VIP) ترقية الآن
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Watchlist */}
                    <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-4 duration-1000">
                        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 shadow-2xl p-8 h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-4 pr-1">
                                    <div className="p-2 bg-red-500/10 rounded-xl">
                                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                    </div>
                                    قائمتي ({watchlistAnimes.length})
                                </h3>
                                {watchlistAnimes.length > 0 && (
                                    <Link href="/animes" className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 group">
                                        استكشف المزيد
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>

                            {watchlistAnimes.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {watchlistAnimes.map((anime) => (
                                        <Link
                                            key={anime.id}
                                            href={`/animes/${anime.id}`}
                                            className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all aspect-[2/3] hover:scale-105 shadow-xl"
                                        >
                                            <img
                                                src={anime.coverImage}
                                                alt={anime.title}
                                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                                            <div className="absolute bottom-0 p-4 w-full">
                                                <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-500 transition-colors drop-shadow-md">
                                                    {anime.title}
                                                </h4>
                                            </div>
                                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-red-600 p-2 rounded-full shadow-lg">
                                                    <PlayCircle className="w-4 h-4 text-white fill-white/20" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-slate-950/30 rounded-3xl border border-dashed border-white/5">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                                        <Heart className="w-10 h-10 text-slate-800" />
                                    </div>
                                    <p className="text-slate-500 mb-6 font-medium">لا توجد أعمال في قائمتك بعد</p>
                                    <Link
                                        href="/animes"
                                        className="inline-flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition-colors border-b-2 border-red-500/20 pb-1"
                                    >
                                        ابدأ باكتشاف الأنميات
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fixed missing icon imports
import { ChevronRight, PlayCircle } from "lucide-react";
