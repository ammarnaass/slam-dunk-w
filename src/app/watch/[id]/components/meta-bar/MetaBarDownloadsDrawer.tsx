"use client";

import { ServerItem } from "./meta-bar.types";

interface MetaBarDownloadsDrawerProps {
  currentServer: ServerItem;
}

export function MetaBarDownloadsDrawer({ currentServer }: MetaBarDownloadsDrawerProps) {
  const downloadUrl1080 =
    currentServer.downloadUrl || currentServer.directUrl || currentServer.url;
  const downloadUrl720 = currentServer.downloadUrl || currentServer.url;
  const downloadUrl480 = currentServer.downloadUrl || currentServer.url;

  return (
    <div className="w-full bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-secondary/20 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
          اختر جودة وسيرفر التحميل المباشر:
        </span>
        <span className="text-[11px] text-on-surface-variant">تحميل فوري دون إعلانات منبثقة</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* 1080p FHD */}
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-primary">
            <span>⚡ خارقة 1080p FHD</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">الأعلى جودة</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">سيرفر ميجا / دروب بوكس السحابي</p>
          <a
            href={downloadUrl1080}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-primary-container text-on-primary-container text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>تحميل الجودة الخارقة</span>
          </a>
        </div>

        {/* 720p HD */}
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-secondary">
            <span>⚡ عالية 720p HD</span>
            <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">متوازنة</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">سيرفر فورشيرد / جوجل درايف</p>
          <a
            href={downloadUrl720}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-secondary text-on-secondary text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>تحميل الجودة العالية</span>
          </a>
        </div>

        {/* 480p SD */}
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-on-surface">
            <span>⚡ متوسطة 480p SD</span>
            <span className="text-[10px] bg-white/10 text-on-surface-variant px-1.5 py-0.5 rounded">حجم اقتصادي</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">سيرفر ميديا فاير السريع</p>
          <a
            href={downloadUrl480}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-surface-container-highest text-on-surface text-xs font-bold hover:bg-white/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>تحميل 480p سريع</span>
          </a>
        </div>
      </div>
    </div>
  );
}
