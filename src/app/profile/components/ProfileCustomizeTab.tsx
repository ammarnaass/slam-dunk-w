"use client";

import React from "react";
import { ProfileFormData } from "../hooks/useProfileState";
import AvatarCustomizerCard from "./AvatarCustomizerCard";
import BannerCustomizerCard from "./BannerCustomizerCard";
import AccountDetailsCard from "./AccountDetailsCard";
import SubscriptionCard from "./SubscriptionCard";
import StreamingPreferencesCard from "./StreamingPreferencesCard";
import SecurityPasswordCard from "./SecurityPasswordCard";
import ProfilePreviewSimulator from "./ProfilePreviewSimulator";

interface ProfileCustomizeTabProps {
    formData: ProfileFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    userRole: string;
    isVip: boolean;
}

export default function ProfileCustomizeTab({
    formData,
    setFormData,
    userRole,
    isVip
}: ProfileCustomizeTabProps) {
    return (
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
                    role={userRole}
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
                    role={userRole}
                />
            </div>
        </div>
    );
}
