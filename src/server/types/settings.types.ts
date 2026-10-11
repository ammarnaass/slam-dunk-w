export interface SiteIdentity {
    siteName: string;
    siteNameEn?: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl?: string;
    brandColor?: string;
    accentColor?: string;
}

export interface SiteSocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
    discord?: string;
}

export interface SiteMaintenance {
    maintenanceMode: boolean;
    maintenanceMessage?: string;
}

export interface SiteAdmobConfig {
    isEnabled: boolean;
    appId?: string;
    bannerId?: string;
    interstitialId?: string;
    rewardedId?: string;
}

export interface FullSiteSettings extends SiteIdentity, SiteMaintenance {
    currency?: string;
    socialLinks?: SiteSocialLinks;
    admob?: SiteAdmobConfig;
    apiApp?: Record<string, any>;
    sliderAnimeIds?: string[];
}

export interface UpdateSiteIdentityDto {
    siteName: string;
    siteNameEn?: string;
    siteDescription?: string;
    logoUrl: string;
    faviconUrl?: string;
    brandColor?: string;
    accentColor?: string;
}

export interface UpdateSiteSettingsDto extends Partial<UpdateSiteIdentityDto> {
    currency?: string;
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
    socialLinks?: SiteSocialLinks;
    admob?: Partial<SiteAdmobConfig>;
    apiApp?: Record<string, any>;
    sliderAnimeIds?: string[];
}
