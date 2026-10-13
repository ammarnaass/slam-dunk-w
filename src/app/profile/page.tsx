"use client";

import { useEffect, useState, useMemo } from "react";
import { Anime } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { UserProfileData, StreamingPreferences } from "@/server/types/profile.types";
import { DEFAULT_PREFERENCES, AURA_GLOW_OPTIONS } from "@/lib/profile-presets";

// Profile Modular Components
import AvatarCustomizerCard from "./components/AvatarCustomizerCard";
import BannerCustomizerCard from "./components/BannerCustomizerCard";
import AccountDetailsCard from "./components/AccountDetailsCard";
import StreamingPreferencesCard from "./components/StreamingPreferencesCard";
import SecurityPasswordCard from "./components/SecurityPasswordCard";
import ProfilePreviewSimulator from "./components/ProfilePreviewSimulator";
import SubscriptionCard from "./components/SubscriptionCard";
import ProfileHeroSection from "./components/ProfileHeroSection";
import WatchlistTab from "./components/WatchlistTab";
import BadgesTab from "./components/BadgesTab";
import WatchHistoryTab from "./components/WatchHistoryTab";

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
    const handleSave = async () => {
        if (!user) return;

        // Password validation if attempting change
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                triggerToast("error", "كلمة المرور الجديدة يجب ألا تقل عن 6 خانات");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                triggerToast("error", "كلمتا المرور غير متطابقتين");
                return;
            }
        }

        try {
            setSaving(true);
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    avatar: formData.avatar,
                    bannerImage: formData.bannerImage,
                    auraColor: formData.auraColor,
                    otakuTitle: formData.otakuTitle,
                    bio: formData.bio,
                    gender: formData.gender,
                    phoneNumber: formData.phoneNumber,
                    birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                    preferences: formData.preferences,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined
                })
            });

            if (res.ok) {
                const updatedUser: UserProfileData = await res.json();
                setUser(updatedUser);
                setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
                triggerToast("success", "تم حفظ كافة تعديلات ملفك الشخصي بنجاح 🌟");
            } else {
                const errorData = await res.json();
                triggerToast("error", errorData.error || "فشل حفظ التعديلات");
            }
        } catch (error) {
            console.error("Save profile error:", error);
            triggerToast("error", "حدث خطأ غير متوقع أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin" />
                <span className="font-cairo text-sm text-on-surface-variant">جاري إعداد هوية الأوتاكو...</span>
            </div>
        );
    }

    if (!user) return null;

    const activeAura = AURA_GLOW_OPTIONS.find((a) => a.id === formData.auraColor) || AURA_GLOW_OPTIONS[0];
    const isVip = user.role === "VIP" || user.role === "ADMIN";

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface pb-32">
            {/* Global Toast Alert */}
            {toast.text && (
                <div
                    className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                        toast.type === "success"
                            ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                            : "bg-red-950/90 border-red-500/40 text-red-200"
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">
                        {toast.type === "success" ? "check_circle" : "error"}
                    </span>
                    <span className="font-cairo text-xs font-bold">{toast.text}</span>
                </div>
            )}

            {/* 1. Profile Hero & Identity Section */}
            <ProfileHeroSection
                formData={formData}
                user={user}
                activeAura={activeAura}
                isVip={isVip}
                watchlistCount={watchlistAnimes.length}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={logout}
            />

            {/* 2. Interactive Navigation Tabs */}
            <section className="max-w-7xl mx-auto px-gutter-lg mt-space-lg">
                <div className="flex items-center gap-2 border-b border-white/[0.06] pb-space-sm mb-space-lg overflow-x-auto scrollbar-none">
                    <button
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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

                            {/* 4. VIP Subscription Status Card */}
                            <SubscriptionCard
                                role={user.role}
                                isVip={isVip}
                            />

                            {/* 5. Streaming Preferences */}
                            <StreamingPreferencesCard
                                preferences={formData.preferences}
                                onChangePreference={(key, val) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        preferences: { ...prev.preferences, [key]: val }
                                    }))
                                }
                            />

                            {/* 6. Security & Password Update */}
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
                    <WatchlistTab watchlistAnimes={watchlistAnimes} />
                )}

                {/* Tab 3: Badges & Achievements */}
                {activeTab === "badges" && (
                    <BadgesTab />
                )}

                {/* Tab 4: Watch History */}
                {activeTab === "history" && (
                    <WatchHistoryTab />
                )}
            </section>

            {/* 3. Floating Sticky Save Bar */}
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
