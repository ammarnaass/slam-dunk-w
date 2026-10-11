"use client";

import { useEffect, useState, useMemo } from "react";
import { User, Anime } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AnimeCard from "@/components/AnimeCard";
import { useAuth } from "@/providers/AuthProvider";
import { UserProfileData, StreamingPreferences } from "@/server/types/profile.types";
import { DEFAULT_PREFERENCES, AURA_GLOW_OPTIONS } from "@/lib/profile-presets";

import AvatarCustomizerCard from "./components/AvatarCustomizerCard";
import BannerCustomizerCard from "./components/BannerCustomizerCard";
import AccountDetailsCard from "./components/AccountDetailsCard";
import StreamingPreferencesCard from "./components/StreamingPreferencesCard";
import SecurityPasswordCard from "./components/SecurityPasswordCard";
import ProfilePreviewSimulator from "./components/ProfilePreviewSimulator";

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuth();
    
    // Core Profile State
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [watchlistAnimes, setWatchlistAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"customize" | "watchlist" | "badges" | "history">("customize");

    // Customization Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        avatar: "/logoep.jpg",
        bannerImage: "/hero-bg.jpg",
        auraColor: "crimson",
        otakuTitle: "صقر شوهوكو",
        bio: "",
        gender: "male",
        phoneNumber: "",
        birthDate: "",
        preferences: DEFAULT_PREFERENCES as StreamingPreferences,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

    // Show temporary toast notification
    const triggerToast = (type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => {
            setToast({ type: "", text: "" });
        }, 4000);
    };

    // Fetch User Profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/profile");
            if (res.ok) {
                const data: UserProfileData = await res.json();
                if (!data) {
                    router.push("/login");
                    return;
                }
                setUser(data);
                setFormData({
                    username: data.name || "",
                    email: data.email || "",
                    avatar: data.avatar || "/logoep.jpg",
                    bannerImage: data.bannerImage || "/hero-bg.jpg",
                    auraColor: data.auraColor || "crimson",
                    otakuTitle: data.otakuTitle || "صقر شوهوكو",
                    bio: data.bio || "عاشق للأعمال الكلاسيكية وسبيستون الذهبية 🌟",
                    gender: data.gender || "male",
                    phoneNumber: data.phoneNumber || "",
                    birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
                    preferences: data.preferences || DEFAULT_PREFERENCES,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });

                // Fetch watchlist animes
                if (data.watchlist && data.watchlist.length > 0) {
                    const animePromises = data.watchlist.map((id: string) =>
                        fetch(`/api/animes/${id}`).then((r) => (r.ok ? r.json() : null))
                    );
                    const animeData = await Promise.all(animePromises);
                    setWatchlistAnimes(animeData.filter((a: any) => a !== null));
                }
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [router]);

    // Check if there are unsaved changes
    const isDirty = useMemo(() => {
        if (!user) return false;
        return (
            formData.username !== (user.name || "") ||
            formData.email !== (user.email || "") ||
            formData.avatar !== (user.avatar || "/logoep.jpg") ||
            formData.bannerImage !== (user.bannerImage || "/hero-bg.jpg") ||
            formData.auraColor !== (user.auraColor || "crimson") ||
            formData.otakuTitle !== (user.otakuTitle || "صقر شوهوكو") ||
            formData.bio !== (user.bio || "") ||
            formData.gender !== (user.gender || "male") ||
            formData.phoneNumber !== (user.phoneNumber || "") ||
            formData.newPassword.length > 0 ||
            JSON.stringify(formData.preferences) !== JSON.stringify(user.preferences || DEFAULT_PREFERENCES)
        );
    }, [formData, user]);

    // Reset Form changes
    const handleReset = () => {
        if (!user) return;
        setFormData({
            username: user.name || "",
            email: user.email || "",
            avatar: user.avatar || "/logoep.jpg",
            bannerImage: user.bannerImage || "/hero-bg.jpg",
            auraColor: user.auraColor || "crimson",
            otakuTitle: user.otakuTitle || "صقر شوهوكو",
            bio: user.bio || "",
            gender: user.gender || "male",
            phoneNumber: user.phoneNumber || "",
            birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
            preferences: user.preferences || DEFAULT_PREFERENCES,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        triggerToast("success", "تمت استعادة الإعدادات الأصلية");
    };

    // Save All Profile Customizations
    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            triggerToast("error", "كلمتا المرور غير متطابقتين، يرجى التحقق");
            return;
        }

        setSaving(true);

        try {
            const payload: any = {
                username: formData.username,
                name: formData.username,
                email: formData.email,
                avatar: formData.avatar,
                bannerImage: formData.bannerImage,
                auraColor: formData.auraColor,
                otakuTitle: formData.otakuTitle,
                bio: formData.bio,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                birthDate: formData.birthDate || null,
                preferences: formData.preferences,
            };

            if (formData.newPassword) {
                payload.newPassword = formData.newPassword;
                payload.currentPassword = formData.currentPassword;
            }

            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const updated: UserProfileData = await res.json();
                setUser(updated);
                setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
                triggerToast("success", "تم حفظ كافة التعديلات وتخصيصات الأوتاكو بنجاح! 🎉");
            } else {
                const err = await res.json();
                triggerToast("error", err.error || "تعذر حفظ التعديلات، يرجى المحاولة ثانية");
            }
        } catch (error) {
            triggerToast("error", "حدث خطأ غير متوقع أثناء الاتصال بالخادم");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] gap-4 bg-surface-container-lowest">
                <div className="w-12 h-12 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
                <span className="font-cairo text-sm text-on-surface-variant font-bold animate-pulse">
                    جاري تحميل ملف الأوتاكو وتفضيلات المشاهدة...
                </span>
            </div>
        );
    }

    if (!user) return null;

    const isVip = user.role?.toUpperCase() === "VIP" || user.role?.toUpperCase() === "ADMIN";
    const activeAura = AURA_GLOW_OPTIONS.find((a) => a.id === formData.auraColor) || AURA_GLOW_OPTIONS[0];

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-20 pb-32">
            
            {/* Toast Floating Notification */}
            {toast.text && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <div
                        className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-xl ${
                            toast.type === "success"
                                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30"
                                : "bg-red-950/90 text-red-300 border-red-500/30"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {toast.type === "success" ? "check_circle" : "error"}
                        </span>
                        <span>{toast.text}</span>
                    </div>
                </div>
            )}

            {/* 1. Cinematic Hero Banner Section */}
            <section className="relative w-full overflow-hidden bg-surface-container-lowest">
                {/* Banner Art */}
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                    <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700"
                        style={{ backgroundImage: `url('${formData.bannerImage || user.bannerImage || "/hero-bg.jpg"}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-transparent to-surface-container-lowest/80" />
                </div>

                {/* Identity & Stats Row */}
                <div className="w-full max-w-7xl mx-auto px-gutter-lg -mt-20 md:-mt-24 pb-space-lg relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-xl">
                        
                        {/* User Identity Details */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-space-lg text-center sm:text-right">
                            {/* Avatar with selected Aura Glow Ring */}
                            <div className="relative group">
                                <div
                                    className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden p-1 shadow-2xl relative transition-all duration-300"
                                    style={{
                                        boxShadow: `0 0 28px ${activeAura.borderGlow}`,
                                        background: activeAura.gradient
                                    }}
                                >
                                    <img
                                        src={formData.avatar || user.avatar || "/logoep.jpg"}
                                        alt={user.name || "User"}
                                        className="w-full h-full object-cover rounded-xl relative z-10 bg-surface-container-highest"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/logoep.jpg";
                                        }}
                                    />
                                </div>
                                <span
                                    className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-0.5 rounded-full shadow-lg text-[11px] font-extrabold uppercase whitespace-nowrap border ${activeAura.badgeColor}`}
                                >
                                    <span className="material-symbols-outlined text-[14px]">star</span>
                                    {isVip ? "VIP DAZER" : "OTAKU MEMBER"}
                                </span>
                            </div>

                            {/* Text Metadata */}
                            <div className="flex flex-col gap-space-xs pb-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-sm">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                                        {formData.username || user.name || "صديق الأنمي"}
                                    </h1>
                                    <span className="font-label-md text-label-md px-space-sm py-0.5 rounded-md bg-surface-container-highest text-secondary font-mono">
                                        @{user.email?.split("@")[0] || "user"}
                                    </span>
                                    {formData.otakuTitle && (
                                        <span className="flex items-center gap-1 text-label-sm font-label-sm text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold">
                                            <span className="material-symbols-outlined text-[14px]">military_tech</span>
                                            {formData.otakuTitle}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-space-md text-on-surface-variant font-body-md text-body-md pt-1">
                                    <span className="flex items-center gap-1 text-xs">
                                        <span className="material-symbols-outlined text-[16px] text-primary-container">record_voice_over</span>
                                        {formData.preferences.audioLanguage === "dubbed" ? "صوت سبيستون الذهبي (مدبلج)" : "ياباني أصلي (مترجم)"}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <span className="material-symbols-outlined text-[16px] text-secondary">hd</span>
                                        دقة المشغل: {formData.preferences.quality.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top CTA Actions */}
                        <div className="flex items-center gap-space-sm w-full lg:w-auto justify-center sm:justify-end flex-wrap">
                            <button
                                onClick={() => setActiveTab("customize")}
                                className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-xl font-headline-sm text-headline-sm transition-all cursor-pointer ${
                                    activeTab === "customize"
                                        ? "bg-primary-container text-on-primary-container shadow-lg"
                                        : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">palette</span>
                                <span>تخصيص الملف</span>
                            </button>
                            <Link
                                href="/pricing"
                                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-secondary-container text-on-secondary font-headline-sm text-headline-sm shadow-md hover:brightness-110 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">diamond</span>
                                <span>باقات VIP</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-all font-headline-sm text-headline-sm cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                <span>خروج</span>
                            </button>
                        </div>

                    </div>

                    {/* Bento Metrics Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-space-xl">
                        {/* Metric 1 */}
                        <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                            <div className="flex flex-col">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">الأعمال المفضلة</span>
                                <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">{watchlistAnimes.length}</span>
                                <span className="font-label-sm text-label-sm text-secondary">في قائمتك</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[26px]">favorite</span>
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                            <div className="flex flex-col">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">كوكب الأوتاكو</span>
                                <span className="font-headline-md text-headline-md text-on-surface font-extrabold">{formData.preferences.favoritePlanet || "مغامرات"}</span>
                                <span className="font-label-sm text-label-sm text-secondary">تصنيفك المفضل</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[26px]">public</span>
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                            <div className="flex flex-col">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">هالة الطاقة</span>
                                <span className="font-headline-md text-headline-md text-on-surface font-extrabold">{activeAura.nameEn}</span>
                                <span className="font-label-sm text-label-sm text-primary-container">{activeAura.name}</span>
                            </div>
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                                style={{ background: activeAura.gradient }}
                            >
                                <span className="material-symbols-outlined text-[26px]">bolt</span>
                            </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between shadow-md border border-white/[0.04]">
                            <div className="flex flex-col">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">اللقب المجتمعي</span>
                                <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold line-clamp-1">{formData.otakuTitle || "صقر شوهوكو"}</span>
                                <span className="font-label-sm text-label-sm text-secondary">رتبة فخرية</span>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[26px]">military_tech</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 2. Interactive Navigation Tabs */}
            <section className="max-w-7xl mx-auto px-gutter-lg mt-space-lg">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-space-sm mb-space-lg overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab("customize")}
                        className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === "customize"
                                ? "bg-primary-container text-on-primary-container shadow"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        <span>تخصيص وتعديل الملف</span>
                        {isDirty && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("watchlist")}
                        className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === "watchlist"
                                ? "bg-primary-container text-on-primary-container shadow"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        <span>قائمتي والمفضلة ({watchlistAnimes.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("badges")}
                        className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === "badges"
                                ? "bg-primary-container text-on-primary-container shadow"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">military_tech</span>
                        <span>الأوسمة والإنجازات</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex items-center gap-2 px-space-md py-space-sm rounded-xl font-cairo font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === "history"
                                ? "bg-primary-container text-on-primary-container shadow"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        <span>سجل المشاهدة</span>
                    </button>
                </div>

                {/* Tab 1: Full Customization & Editing Suite */}
                {activeTab === "customize" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                        {/* Main Customization Cards Column */}
                        <div className="lg:col-span-8 space-y-space-xl">
                            {/* 1. Avatar & Aura Glow */}
                            <AvatarCustomizerCard
                                currentAvatar={formData.avatar}
                                currentAura={formData.auraColor}
                                userName={formData.username}
                                onChangeAvatar={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
                                onChangeAura={(auraId) => setFormData((prev) => ({ ...prev, auraColor: auraId }))}
                            />

                            {/* 2. Banner Art */}
                            <BannerCustomizerCard
                                currentBanner={formData.bannerImage}
                                onChangeBanner={(bannerUrl) => setFormData((prev) => ({ ...prev, bannerImage: bannerUrl }))}
                            />

                            {/* 3. Account Details & Honorary Title */}
                            <AccountDetailsCard
                                username={formData.username}
                                email={formData.email}
                                phoneNumber={formData.phoneNumber}
                                gender={formData.gender}
                                birthDate={formData.birthDate}
                                bio={formData.bio}
                                otakuTitle={formData.otakuTitle}
                                onChangeField={(field, val) => setFormData((prev) => ({ ...prev, [field]: val }))}
                            />

                            {/* 4. Streaming Preferences */}
                            <StreamingPreferencesCard
                                preferences={formData.preferences}
                                onChangePreference={(key, val) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        preferences: { ...prev.preferences, [key]: val }
                                    }))
                                }
                            />

                            {/* 5. Security & Password Update */}
                            <SecurityPasswordCard
                                currentPassword={formData.currentPassword}
                                newPassword={formData.newPassword}
                                confirmPassword={formData.confirmPassword}
                                onChangeField={(field, val) => setFormData((prev) => ({ ...prev, [field]: val }))}
                            />
                        </div>

                        {/* Real-time Simulator Preview Sticky Column */}
                        <div className="lg:col-span-4">
                            <ProfilePreviewSimulator
                                avatar={formData.avatar}
                                auraColor={formData.auraColor}
                                bannerImage={formData.bannerImage}
                                username={formData.username}
                                email={formData.email}
                                otakuTitle={formData.otakuTitle}
                                bio={formData.bio}
                                role={user.role}
                            />
                        </div>
                    </div>
                )}

                {/* Tab 2: Watchlist */}
                {activeTab === "watchlist" && (
                    <div>
                        {watchlistAnimes.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-space-md">
                                {watchlistAnimes.map((anime) => (
                                    <AnimeCard key={anime.id} anime={anime} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-5xl text-on-surface-variant">favorite_border</span>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">قائمتك المفضلة فارغة حالياً</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                                    تصفح المكتبة وأضف الأعمال المفضلة إليك بالضغط على زر المفضلة لتظهر هنا دائماً.
                                </p>
                                <Link
                                    href="/animes"
                                    className="mt-2 px-6 py-3 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                                >
                                    استكشف مكتبة الأنمي
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Badges & Achievements */}
                {activeTab === "badges" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-gutter">
                        {[
                            { title: "عاشق الصقور", desc: "أكملت مشاهدة موسم كامل من سلام دانك", icon: "sports_basketball", color: "text-amber-400" },
                            { title: "جيل الطيبين", desc: "شاهدت 5 أعمال سبيستونية كلاسيكية", icon: "stars", color: "text-secondary" },
                            { title: "مشاهد ماراثوني", desc: "شاهدت أكثر من 5 ساعات متواصلة", icon: "timer", color: "text-primary" },
                            { title: "عضو مؤسس", desc: "انضممت لمنصة ANIME DAZE في انطلاقتها الأولى", icon: "verified", color: "text-emerald-400" },
                            { title: "محقق الغموض", desc: "شاهدت 10 حلقات من المحقق كونان", icon: "search", color: "text-cyan-400" },
                            { title: "صياد النجوم", desc: "أضفت 10 أعمال إلى قائمتك المفضلة", icon: "bookmark", color: "text-purple-400" },
                        ].map((b, idx) => (
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
                )}

                {/* Tab 4: Watch History */}
                {activeTab === "history" && (
                    <div className="bg-surface-container-low rounded-2xl border border-white/[0.06] p-space-xl text-center space-y-3">
                        <span className="material-symbols-outlined text-5xl text-primary-container">smart_display</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">سجل المشاهدات الأخير</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">
                            يتم تسجيل الحلقات التي شاهدتها وتقدمك في المشاهدة بدقة لمتابعة العرض من حيث توقفت.
                        </p>
                        <div className="pt-3">
                            <Link
                                href="/animes"
                                className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold transition-all text-on-surface"
                            >
                                متابعة المشاهدة الآن
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* 3. Floating Sticky Save Bar (Appears when unsaved modifications exist) */}
            {isDirty && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-surface-container-high/95 backdrop-blur-xl border border-primary-container/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>لديك تغييرات غير محفوظة في ملف الأوتاكو!</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={saving}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer"
                        >
                            تراجع
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSave()}
                            disabled={saving}
                            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            {saving ? (
                                <>
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    <span>جاري الحفظ...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">save</span>
                                    <span>حفظ التعديلات</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
