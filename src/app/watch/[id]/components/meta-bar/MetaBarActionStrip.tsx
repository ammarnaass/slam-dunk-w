"use client";

import Link from "next/link";
import { ServerItem } from "./meta-bar.types";

interface MetaBarActionStripProps {
  currentServer?: ServerItem;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  isReported: boolean;
  onReport: () => void;
}

export function MetaBarActionStrip({
  currentServer,
  isFavorited,
  onToggleFavorite,
  onShare,
  isReported,
  onReport,
}: MetaBarActionStripProps) {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant border-t border-white/[0.04]">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Favorite */}
        <button
          onClick={onToggleFavorite}
          className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
            isFavorited
              ? "bg-primary-container/20 text-primary border-primary-container/40"
              : "bg-surface-container-high hover:text-primary-container border-transparent"
          }`}
          id="favorite-btn"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isFavorited ? "favorite" : "favorite_border"}
          </span>
          <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">
            {isFavorited ? "في المفضلة" : "أضف للمفضلة"}
          </span>
        </button>

        {/* Direct MEGA / External Stream launcher */}
        {currentServer?.url && (
          <a
            href={currentServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container/20 hover:bg-primary-container text-primary hover:text-on-primary-container transition-all border border-primary-container/30 text-xs sm:text-sm font-bold"
            id="mega-direct-btn"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>مشاهدة عبر تطبيق MEGA المباشر</span>
          </a>
        )}

        {/* VIP Download */}
        <Link
          href="/pricing"
          className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:text-secondary transition-all text-on-surface-variant border border-transparent"
          id="vip-download-btn"
        >
          <span className="material-symbols-outlined text-secondary text-[18px]">workspace_premium</span>
          <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">تنزيل VIP (4K)</span>
        </Link>

        {/* Share */}
        <button
          onClick={onShare}
          className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:text-on-surface transition-all cursor-pointer border border-transparent"
          id="share-btn"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">مشاركة</span>
        </button>
      </div>

      {/* Broken link reporting */}
      <button
        onClick={onReport}
        className={`min-h-[44px] flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
          isReported
            ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
            : "bg-surface-container-low hover:bg-error-container hover:text-on-error-container text-on-surface-variant border-transparent"
        }`}
        id="report-link-btn"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isReported ? "check_circle" : "report_problem"}
        </span>
        <span className="font-label-md text-label-md text-xs sm:text-sm">
          {isReported ? "تم الإبلاغ بنجاح" : "الإبلاغ عن سيرفر معطّل"}
        </span>
      </button>
    </div>
  );
}
