"use client";

interface MetaBarServerTabsProps {
  serverCategoryTab: "direct" | "embed" | "download";
  onSelectCategoryTab: (tab: "direct" | "embed" | "download") => void;
  showDownloadsDrawer: boolean;
  onToggleDownloadsDrawer: () => void;
  directServersCount: number;
  embedServersCount: number;
  downloadServersCount: number;
  activeQuality: string;
  onSelectQuality: (q: string) => void;
}

const QUALITIES = ["1080p", "720p", "480p", "Auto"];

export function MetaBarServerTabs({
  serverCategoryTab,
  onSelectCategoryTab,
  showDownloadsDrawer,
  onToggleDownloadsDrawer,
  directServersCount,
  embedServersCount,
  downloadServersCount,
  activeQuality,
  onSelectQuality,
}: MetaBarServerTabsProps) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/[0.06] pb-2.5">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onSelectCategoryTab("direct")}
          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            serverCategoryTab === "direct" && !showDownloadsDrawer
              ? "bg-primary-container text-on-primary-container shadow-sm"
              : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          <span>سيرفرات فائقة السرعة ({directServersCount})</span>
        </button>

        <button
          onClick={() => onSelectCategoryTab("embed")}
          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            serverCategoryTab === "embed" && !showDownloadsDrawer
              ? "bg-primary-container text-on-primary-container shadow-sm"
              : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tv</span>
          <span>سيرفرات التضمين والاحتياط ({embedServersCount})</span>
        </button>

        <button
          onClick={onToggleDownloadsDrawer}
          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            showDownloadsDrawer
              ? "bg-secondary-container text-on-secondary-container shadow-sm"
              : "bg-surface-container-high text-secondary hover:brightness-110"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>روابط التحميل المباشر ({downloadServersCount})</span>
        </button>
      </div>

      {/* Resolution Selector */}
      <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-white/5">
        {QUALITIES.map((q) => (
          <button
            key={q}
            onClick={() => onSelectQuality(q)}
            className={`min-h-[32px] px-2 rounded font-label-sm text-label-sm font-bold transition-all text-xs ${
              activeQuality === q
                ? "bg-primary-container text-on-primary-container shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
