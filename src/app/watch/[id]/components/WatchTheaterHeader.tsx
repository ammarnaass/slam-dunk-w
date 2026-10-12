"use client";

import Link from "next/link";

interface WatchTheaterHeaderProps {
  anime: {
    id: string;
    title: string;
  } | null;
  episode: {
    id: string;
    title: string;
    episodeNumber: number | string;
  };
  planetInfo?: {
    id: string;
    name: string;
    href: string;
  };
  lightsOff: boolean;
  onToggleLights: () => void;
}

export default function WatchTheaterHeader({
  anime,
  episode,
  planetInfo,
  lightsOff,
  onToggleLights
}: WatchTheaterHeaderProps) {
  return (
    <>
      {/* Lights Dimmer Backdrop when active */}
      {lightsOff && (
        <div 
          onClick={onToggleLights}
          className="fixed inset-0 bg-black/90 z-40 backdrop-blur-sm transition-opacity duration-500 flex flex-col items-center justify-start pt-6 cursor-pointer"
        >
          <div className="bg-surface-container-high/90 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl pointer-events-auto hover:bg-primary-container hover:text-on-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            <span className="font-label-md text-label-md">انقر في أي مكان لإعادة تشغيل الأنوار</span>
          </div>
        </div>
      )}

      {/* Ambient Glows */}
      <div className="absolute -top-24 right-1/4 w-[600px] h-[350px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-48 left-10 w-[400px] h-[300px] bg-secondary-container/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Breadcrumb & Top Utility Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm border-b border-white/[0.05] mb-space-md">
        <div className="flex items-center gap-space-xs flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>الرئيسية</span>
          </Link>
          <span className="text-outline-variant">/</span>
          {planetInfo ? (
            <>
              <Link href={planetInfo.href} className="hover:text-primary transition-colors">
                {planetInfo.name}
              </Link>
              <span className="text-outline-variant">/</span>
            </>
          ) : (
            <>
              <Link href="/planets" className="hover:text-primary transition-colors">
                الكواكب
              </Link>
              <span className="text-outline-variant">/</span>
            </>
          )}
          <Link 
            href={anime ? `/animes/${anime.id}` : "/animes"} 
            className="hover:text-primary transition-colors text-on-surface font-semibold"
          >
            {anime?.title || "أنمي كلاسيكي"}
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-primary-container font-headline-sm text-headline-sm font-bold">
            الحلقة {String(episode.episodeNumber).padStart(2, "0")}
          </span>
        </div>

        {/* Cloud Sync Pulse & Lights Toggle */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1 rounded-full shadow-inner border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-label-sm text-label-sm text-emerald-400">
              حفظ تلقائي متزامن (PUT /progress/ep-{episode.id})
            </span>
            <span className="text-outline-variant text-[10px] hidden sm:inline">| سحابي</span>
          </div>

          <button
            onClick={onToggleLights}
            className={`flex items-center gap-1.5 px-space-sm py-1 rounded-lg transition-all border ${
              lightsOff 
                ? "bg-secondary-container text-on-secondary border-secondary-container shadow-[0_0_12px_rgba(238,152,0,0.4)]"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface border-white/5"
            }`}
            title="إطفاء الأنوار لمشاهدة سينمائية غامرة"
          >
            <span className="material-symbols-outlined text-[18px]">
              {lightsOff ? "lightbulb_outline" : "lightbulb"}
            </span>
            <span className="font-label-md text-label-md">
              {lightsOff ? "تشغيل الأنوار" : "إطفاء الأنوار"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
