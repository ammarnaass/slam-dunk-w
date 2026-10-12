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

export interface PromoFeatureItem {
    id: string;
    icon: string;
    text: string;
}

export interface PromoBannerConfig {
    isEnabled: boolean;
    badgeText: string;
    badgeIcon: string;
    title: string;
    description: string;
    features: PromoFeatureItem[];
    primaryButtonText: string;
    primaryButtonLink: string;
    primaryButtonIcon: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    imageUrl: string;
    imageCaption: string;
    appIconUrl?: string;
}

export interface FooterLinkItem {
    id: string;
    label: string;
    href: string;
    isVip?: boolean;
}

export interface FooterSocialItem {
    id: string;
    name: string;
    icon: string;
    url: string;
    isEnabled: boolean;
}

export interface FooterConfig {
    subtitle: string;
    description: string;
    socialLinks: FooterSocialItem[];
    exploreTitle: string;
    exploreLinks: FooterLinkItem[];
    helpTitle: string;
    helpLinks: FooterLinkItem[];
    appCardTitle: string;
    appCardDescription: string;
    appCardButtonText: string;
    appCardButtonIcon: string;
    isAppCardEnabled: boolean;
    copyrightText: string;
    serverStatusText: string;
    isStatusIndicatorActive: boolean;
}

export interface ApiAppConfig {
    isMaintenance: boolean;
    maintenanceTitle: string;
    maintenanceMessage: string;
    maintenanceEndTime?: string;
    devBypassKey: string;
    latestVersion: string;
    latestBuild: number;
    minSupportedVersion: string;
    minSupportedBuild: number;
    forceUpdate: boolean;
    updateUrl: string;
    directApkUrl: string;
    releaseNotes: string[];
    apiUrl: string;
    apiKey: string;
    defaultQuality: string;
    defaultServer: string;
    allowDownloads: boolean;
    interstitialInterval: number;
}

export interface FullSiteSettings extends SiteIdentity, SiteMaintenance {
    currency?: string;
    socialLinks?: SiteSocialLinks;
    admob?: SiteAdmobConfig;
    apiApp?: ApiAppConfig;
    sliderAnimeIds?: string[];
    promoBanner?: PromoBannerConfig;
    footer?: FooterConfig;
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
    apiApp?: Partial<ApiAppConfig>;
    sliderAnimeIds?: string[];
    promoBanner?: Partial<PromoBannerConfig>;
    footer?: Partial<FooterConfig>;
}
