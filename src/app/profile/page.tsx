"use client";

import { useProfileState } from "./hooks/useProfileState";
import ProfileHeroSection from "./components/ProfileHeroSection";
import ProfileNavigationTabs from "./components/ProfileNavigationTabs";
import ProfileCustomizeTab from "./components/ProfileCustomizeTab";
import WatchlistTab from "./components/WatchlistTab";
import BadgesTab from "./components/BadgesTab";
import WatchHistoryTab from "./components/WatchHistoryTab";
import ProfileFloatingSaveBar from "./components/ProfileFloatingSaveBar";

export default function ProfilePage() {
    const {
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
        activeAura,
        isVip,
        logout
    } = useProfileState();

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin" />
                <span className="font-cairo text-sm text-on-surface-variant">جاري إعداد هوية الأوتاكو...</span>
            </div>
        );
    }

    if (!user) return null;

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

            {/* 2. Interactive Navigation Tabs & Content */}
            <section className="max-w-7xl mx-auto px-gutter-lg mt-space-lg">
                <ProfileNavigationTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    watchlistCount={watchlistAnimes.length}
                    isDirty={isDirty}
                />

                {activeTab === "customize" && (
                    <ProfileCustomizeTab
                        formData={formData}
                        setFormData={setFormData}
                        userRole={user.role}
                        isVip={isVip}
                    />
                )}

                {activeTab === "watchlist" && (
                    <WatchlistTab watchlistAnimes={watchlistAnimes} />
                )}

                {activeTab === "badges" && (
                    <BadgesTab />
                )}

                {activeTab === "history" && (
                    <WatchHistoryTab />
                )}
            </section>

            {/* 3. Floating Sticky Save Bar */}
            {isDirty && (
                <ProfileFloatingSaveBar
                    saving={saving}
                    onReset={handleReset}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
