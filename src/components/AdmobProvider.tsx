"use client";

import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { Settings } from '@/types';

interface AdmobProviderProps {
    children: React.ReactNode;
}

export default function AdmobProvider({ children }: AdmobProviderProps) {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        // Only run on native platforms
        if (!Capacitor.isNativePlatform()) return;

        const initAds = async () => {
            try {
                // Fetch settings to check if ads are enabled
                const res = await fetch('/api/settings');
                if (!res.ok) return;
                const data: Settings = await res.json();
                setSettings(data);

                if (!data.admob?.isEnabled) return;

                // Initialize AdMob
                await AdMob.initialize();

                // Show Banner Ad if ID is provided
                if (data.admob.bannerId) {
                    await AdMob.showBanner({
                        adId: data.admob.bannerId,
                        adSize: BannerAdSize.ADAPTIVE_BANNER,
                        position: BannerAdPosition.BOTTOM_CENTER,
                        margin: 0,
                    });
                }

                // Prepare Interstitial if ID is provided
                if (data.admob.interstitialId) {
                    await AdMob.prepareInterstitial({
                        adId: data.admob.interstitialId,
                    });
                }
            } catch (error) {
                console.error('AdMob initialization failed', error);
            }
        };

        initAds();
    }, []);

    // Helper to show interstitial ad (can be called from other components via context if needed, 
    // but for now we'll trigger it on certain actions or just have it ready)
    const showInterstitial = async () => {
        if (!Capacitor.isNativePlatform() || !settings?.admob?.isEnabled || !settings?.admob?.interstitialId) return;
        try {
            await AdMob.showInterstitial();
        } catch (error) {
            console.error('Failed to show interstitial', error);
        }
    };

    return (
        <>
            {children}
        </>
    );
}
