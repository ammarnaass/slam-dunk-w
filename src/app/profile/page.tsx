"use client";

import { useEffect, useState } from "react";
import { User, Anime } from "@/types";
import { useRouter } from "next/navigation";
import { 
    Loader2, 
    User as UserIcon, 
    Calendar, 
    Shield, 
    Edit, 
    Save, 
    X, 
    Phone, 
    Star, 
    Sparkles, 
    Film, 
    Heart, 
    Mail, 
    Camera,
    LogOut,
    CheckCircle2,
    Crown,
    Settings,
    ArrowLeft,
    Layers,
    Lock
} from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimeCard from "@/components/AnimeCard";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [watchlistAnimes, setWatchlistAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"watchlist" | "info" | "edit">("watchlist");
    
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
            setEditForm(prev => ({ ...prev, password: "" }));

            // Refresh user data
            await fetchUser();
            setTimeout(() => {
                setActiveTab("info");
                setMsg({ type: "", text: "" });
            }, 1200);
        } catch (error: any) {
            setMsg({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
                <p className="text-sm text-slate-400 font-semibold">جاري تحميل الملف الشخصي...</p>
            </div>
        );
    }

    if (!user) return null;

    const isAdmin = user.role?.toUpperCase() === "ADMIN" || user.name === "admin" || user.email === "admin@slamdunk.com" || user.email === "amarnaas1981@gmail.com";
    const isVip = user.subscription?.isActive;
    const avatarUrl = editForm.profileImage || user.avatar || user.profileImage;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
            {/* Ambient Background Radial Glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[450px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.2),transparent_80%)]" />

            {/* Breadcrumbs */}
            <div className="relative border-b border-slate-900/80 bg-slate-950/40 backdrop-blur-md">
                <Breadcrumbs customLabels={{ profile: "الملف الشخصي" }} />
            </div>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Hero Profile Header Card */}
                <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/95 border border-slate-800/80 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl backdrop-blur-xl">
                    {/* Top subtle highlight hairline */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none" />
                    
                    {/* Background glow orbs */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        {/* Avatar & User Details */}
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                            {/* Avatar with Badges */}
                            <div className="relative group shrink-0">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-xl shadow-red-950/40">
                                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img 
                                                src={avatarUrl} 
                                                alt={user.name || "User"} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                            />
                                        ) : (
                                            <span className="text-4xl sm:text-5xl font-black text-white">
                                                {(user.name || user.email || "U")[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* VIP Crown or Admin Star Badge */}
                                {isVip && (
                                    <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-lg border-2 border-slate-950">
                                        <Crown size={12} className="fill-slate-950" />
                                        <span>VIP</span>
                                    </div>
                                )}

                                {isAdmin && (
                                    <div className="absolute -bottom-2 -right-2 bg-red-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-lg border-2 border-slate-950">
                                        <Shield size={11} />
                                        <span>ADMIN</span>
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        {user.name || "مستخدم سلام دانك"}
                                    </h1>
                                    {isAdmin && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-0.5 rounded-full">
                                            <Shield size={12} />
                                            مدير النظام
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5 font-medium">
                                    <Mail size={14} className="text-red-500" />
                                    <span>{user.email}</span>
                                </p>

                                {/* Meta details pills */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
                                        <Calendar size={12} className="text-red-500" />
                                        انضم في: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : '2026'}
                                    </span>

                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
                                        <Heart size={12} className="text-red-500 fill-red-500" />
                                        {watchlistAnimes.length} في المفضلة
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 hover:border-red-600 text-xs font-bold transition-all shadow-md"
                                >
                                    <Settings size={15} />
                                    <span>لوحة الإدارة</span>
                                </Link>
                            )}

                            <button
                                onClick={() => setActiveTab("edit")}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition-all shadow-sm"
                            >
                                <Edit size={14} />
                                <span>تعديل الحساب</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                title="تسجيل الخروج"
                                className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs Bar */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab("watchlist")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                            activeTab === "watchlist"
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                        }`}
                    >
                        <Heart size={16} className={activeTab === "watchlist" ? "fill-white" : ""} />
                        <span>قائمتي والمفضلة</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            activeTab === "watchlist" ? "bg-black/30 text-white" : "bg-slate-800 text-slate-300"
                        }`}>
                            {watchlistAnimes.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("info")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                            activeTab === "info"
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                        }`}
                    >
                        <UserIcon size={16} />
                        <span>البيانات والاشتراك</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                            activeTab === "edit"
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                        }`}
                    >
                        <Edit size={16} />
                        <span>تعديل وكلمة المرور</span>
                    </button>
                </div>

                {/* Tab 1: Watchlist */}
                {activeTab === "watchlist" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                                <h2 className="text-lg font-bold text-white">
                                    الأعمال المحفوظة في قائمتك
                                </h2>
                            </div>

                            <Link 
                                href="/animes" 
                                className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center gap-1 transition-colors"
                            >
                                <span>استكشاف المزيد</span>
                                <ArrowLeft size={14} />
                            </Link>
                        </div>

                        {watchlistAnimes.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                {watchlistAnimes.map((anime) => (
                                    <AnimeCard key={anime.id} anime={anime} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
                                <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-900/40 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-950/40">
                                    <Heart size={28} className="fill-red-500/20" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">
                                    قائمتك فارغة حالياً
                                </h3>
                                <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                                    لم تقم بإضافة أي أنمي إلى قائمة المتابعة بعد. يمكنك إضافة أعمالك المفضلة للوصول إليها بنقرة واحدة.
                                </p>
                                <Link
                                    href="/animes"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                                >
                                    <Film size={15} />
                                    <span>تصفح دليل الأنميات</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: User Info & Subscription */}
                {activeTab === "info" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Details Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <UserIcon size={18} className="text-red-500" />
                                        المعلومات الشخصية
                                    </h3>
                                    <button 
                                        onClick={() => setActiveTab("edit")}
                                        className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center gap-1"
                                    >
                                        <Edit size={13} />
                                        تعديل
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                                        <span className="text-[11px] text-slate-400 block mb-1">اسم المستخدم</span>
                                        <span className="text-sm font-bold text-white">{user.name || "غير محدد"}</span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                                        <span className="text-[11px] text-slate-400 block mb-1">البريد الإلكتروني</span>
                                        <span className="text-sm font-bold text-white">{user.email}</span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                                        <span className="text-[11px] text-slate-400 block mb-1">رقم الهاتف</span>
                                        <span className="text-sm font-bold text-white" dir="ltr">{user.phoneNumber || "غير مضاف"}</span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                                        <span className="text-[11px] text-slate-400 block mb-1">الجنس</span>
                                        <span className="text-sm font-bold text-white">
                                            {user.gender === "male" ? "ذكر" : user.gender === "female" ? "أنثى" : "غير محدد"}
                                        </span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 sm:col-span-2">
                                        <span className="text-[11px] text-slate-400 block mb-1">تاريخ الميلاد</span>
                                        <span className="text-sm font-bold text-white">
                                            {user.birthDate ? new Date(user.birthDate).toLocaleDateString('ar-EG') : "غير محدد"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Card */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
                                    <Star size={18} className="text-amber-400 fill-amber-400" />
                                    <h3 className="text-base font-bold text-white">
                                        حالة الاشتراك
                                    </h3>
                                </div>

                                {isVip ? (
                                    <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 space-y-3">
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
                                            <Sparkles size={28} />
                                        </div>
                                        <h4 className="text-lg font-black text-amber-400">اشتراك VIP نشط</h4>
                                        <p className="text-xs text-slate-300">
                                            صالح حتى: {user.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString('ar-EG') : "مدى الحياة"}
                                        </p>
                                        <div className="pt-2 text-xs text-slate-400 flex flex-col gap-1.5 text-right">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={13} className="text-emerald-400" />
                                                <span>مشاهدة بدقة 1080p و 4K</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={13} className="text-emerald-400" />
                                                <span>خالٍ تماماً من الإعلانات</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={13} className="text-emerald-400" />
                                                <span>سرعة تحميل وتشغيل قصوى</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center">
                                            <Star size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white">الحساب المجاني</h4>
                                            <p className="text-xs text-slate-400 mt-1">قم بالترقية للاستمتاع بالمشاهدة بدون إعلانات وبأعلى جودة</p>
                                        </div>
                                        <Link
                                            href="/pricing"
                                            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                                        >
                                            <Sparkles size={14} />
                                            <span>ترقية إلى VIP الآن</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 3: Edit Form */}
                {activeTab === "edit" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Edit size={18} className="text-red-500" />
                                    تعديل بيانات الحساب
                                </h3>
                                <button
                                    onClick={() => setActiveTab("info")}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {msg.text && (
                                <div className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                                    msg.type === "success" 
                                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" 
                                        : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                                }`}>
                                    <CheckCircle2 size={16} />
                                    <span>{msg.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-4">
                                {/* Profile Photo Upload */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                                        الصورة الشخصية
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                    U
                                                </div>
                                            )}
                                        </div>

                                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors">
                                            <Camera size={14} />
                                            <span>رفع صورة جديدة</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>

                                        {editForm.profileImage && (
                                            <button
                                                type="button"
                                                onClick={() => setEditForm(prev => ({ ...prev, profileImage: "" }))}
                                                className="text-xs text-red-400 hover:underline"
                                            >
                                                إزالة
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            اسم المستخدم
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                            required
                                            minLength={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            البريد الإلكتروني
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            الجنس
                                        </label>
                                        <select
                                            value={editForm.gender}
                                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                                        >
                                            <option value="">غير محدد</option>
                                            <option value="male">ذكر</option>
                                            <option value="female">أنثى</option>
                                            <option value="other">أخرى</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            رقم الهاتف
                                        </label>
                                        <input
                                            type="tel"
                                            dir="ltr"
                                            value={editForm.phoneNumber}
                                            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                            placeholder="+966 50 000 0000"
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 text-left"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            تاريخ الميلاد
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.birthDate}
                                            onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 pt-2 border-t border-slate-800">
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <Lock size={13} className="text-red-500" />
                                            <span>كلمة المرور الجديدة (اختياري)</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={editForm.password}
                                            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                            placeholder="اتركه فارغاً للاحتفاظ بكلمة المرور الحالية"
                                            minLength={6}
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">يجب أن تتكون من 6 أحرف أو أرقام على الأقل في حال الرغبة بالتغيير.</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("info")}
                                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                                    >
                                        إلغاء
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>جاري الحفظ...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>حفظ التغييرات</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
