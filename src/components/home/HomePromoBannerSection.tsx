import Link from "next/link";
import { AppDownloadButtons } from "@/components/AppDownloadButtons";

interface HomePromoBannerSectionProps {
    promoBanner: any;
    settings: any;
}

export function HomePromoBannerSection({ promoBanner, settings }: HomePromoBannerSectionProps) {
    if (!promoBanner || !promoBanner.isEnabled) return null;

    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-3xl bg-surface-container-low overflow-hidden p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/[0.06]">
                    {/* Ambient Red/Amber Gradients */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
                        {/* Content Side (8 Cols) */}
                        <div className="lg:col-span-8 space-y-space-md">
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                                    <span className="material-symbols-outlined text-sm">{promoBanner.badgeIcon || "install_mobile"}</span>
                                    {promoBanner.badgeText}
                                </div>
                                {promoBanner.appIconUrl && (
                                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 shrink-0 border border-white/20 shadow-md">
                                        <img src={promoBanner.appIconUrl} alt="App Icon" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold max-w-xl">
                                {promoBanner.title}
                            </h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                                {promoBanner.description}
                            </p>
                            
                            {/* Features Highlights Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                                {(promoBanner.features || []).map((feat: any, idx: number) => (
                                    <div key={feat.id || idx} className="p-space-sm rounded-xl bg-surface-container flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-xl ${idx % 2 === 0 ? "text-primary" : "text-secondary"}`}>
                                            {feat.icon}
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface">{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* App Store & Direct Download Suite */}
                            <div className="pt-space-sm space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#3DDC84] animate-ping" />
                                    <span className="text-xs font-bold font-cairo text-[#ffb4ab]">
                                        تحميل التطبيق الرسمي لأجهزة أندرويد و iOS والشاشات الذكية:
                                    </span>
                                </div>
                                <AppDownloadButtons
                                    googlePlayUrl={(promoBanner as any).googlePlayUrl || settings?.apiApp?.updateUrl}
                                    appStoreUrl={(promoBanner as any).appStoreUrl || (settings?.apiApp as any)?.appStoreUrl}
                                    directApkUrl={(promoBanner as any).directApkUrl || settings?.apiApp?.directApkUrl}
                                    externalUrl={(promoBanner as any).externalUrl || (settings?.apiApp as any)?.externalUrl}
                                    showPwa={true}
                                    layout="row"
                                />
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-space-md">
                                <Link
                                    href={promoBanner.primaryButtonLink || "/pricing"}
                                    className="flex items-center gap-space-sm px-space-lg py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md border border-white/10"
                                >
                                    <span className="material-symbols-outlined text-lg text-secondary">{promoBanner.primaryButtonIcon || "diamond"}</span>
                                    <span>{promoBanner.primaryButtonText}</span>
                                </Link>
                                <Link
                                    href={promoBanner.secondaryButtonLink || "/animes"}
                                    className="flex items-center gap-space-sm px-space-lg py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md border border-white/10"
                                >
                                    <span>{promoBanner.secondaryButtonText}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Graphic Promo Side (4 Cols) */}
                        <div className="lg:col-span-4 hidden lg:flex justify-center">
                            <div className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-highest border border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={promoBanner.imageUrl || "/hero-bg.jpg"}
                                    alt={promoBanner.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                                {promoBanner.imageCaption && (
                                    <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-surface-container/90 backdrop-blur-md text-center">
                                        <span className="font-headline-sm text-xs font-bold text-secondary">
                                            {promoBanner.imageCaption}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
