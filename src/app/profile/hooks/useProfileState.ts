"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Anime } from "@/types";
import { UserProfileData, StreamingPreferences } from "@/server/types/profile.types";
import { DEFAULT_PREFERENCES, AURA_GLOW_OPTIONS } from "@/lib/profile-presets";

export type ProfileTab = "customize" | "watchlist" | "badges" | "history";

export interface ProfileFormData {
    username: string;
    email: string;
    avatar: string;
    bannerImage: string;
    auraColor: string;
    otakuTitle: string;
    bio: string;
    gender: string;
    phoneNumber: string;
    birthDate: string;
    preferences: StreamingPreferences;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export function useProfileState() {
    const router = useRouter();
    const { logout } = useAuth();

    // Core Profile State
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [watchlistAnimes, setWatchlistAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ProfileTab>("customize");

    // Customization Form State
    const [formData, setFormData] = useState<ProfileFormData>({
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
    const triggerToast = useCallback((type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => {
            setToast({ type: "", text: "" });
        }, 4000);
    }, []);

    // Fetch User Profile
    const fetchProfile = useCallback(async () => {
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
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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

    const activeAura = useMemo(() => {
        return AURA_GLOW_OPTIONS.find((a) => a.id === formData.auraColor) || AURA_GLOW_OPTIONS[0];
    }, [formData.auraColor]);

    const isVip = user ? user.role === "VIP" || user.role === "ADMIN" : false;

    return {
        user,
        watchlistAnimes,
        loading,
        activeTab,
        setActiveTab,
        formData,
        setFormData,
        saving,
        toast,
        isDirty,
        handleReset,
        handleSave,
        triggerToast,
        activeAura,
        isVip,
        logout
    };
}
