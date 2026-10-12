"use client";

import Link from "next/link";
import { Episode } from "@/types";
import { AnimeCastData } from "./watch-stitch-data";

interface WatchEpisodeDetailsProps {
  episode: Episode & {
    anime?: { id?: string; title: string; description?: string };
  };
  castData: AnimeCastData;
}

export default function WatchEpisodeDetails({
  episode,
  castData
}: WatchEpisodeDetailsProps) {
  const storyDescription = episode.description || 
    `تبدأ أحداث هذه الحلقة باشتداد الصراع والمنافسة، حيث يواجه الأبطال تحديات استثنائية تختبر عزيمتهم وروابط الصداقة التي تجمعهم. مع تصاعد وتيرة الأحداث والموسيقى التصويرية الملحمية، تتكشف أسرار جديدة تضع الفريق أمام خيارات حاسمة في طريقهم نحو القمة.`;

  return (
    <div className="w-full bg-surface-container p-space-md sm:p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-white/[0.06]">
      {/* Header & Rating */}
      <div className="flex items-center justify-between pb-space-xs border-b border-white/[0.04]">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-primary-container">info</span>
          <span>تفاصيل الحلقة وملخص القصة</span>
        </h3>

        <div className="flex items-center gap-1 text-secondary font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-[18px]">star</span>
          <span>9.4 / 10 (تصويت 18,420 متابع)</span>
        </div>
      </div>

      {/* Story Summary Paragraph */}
      <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
        {storyDescription}
      </p>

      {/* Voice Acting & Cast Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
        {/* Arabic Dubbing Cast */}
        <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-white/5">
          <span className="font-label-md text-label-md text-secondary flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            طاقم الدبلجة العربية المعتمد (الجيل الذهبي):
          </span>
          <p className="font-body-md text-body-md text-on-surface leading-normal">
            {castData.arabicDub.map((member, i) => (
              <span key={i}>
                <span className="font-semibold text-on-surface">{member.actor}</span>
                <span className="text-on-surface-variant text-xs"> ({member.role})</span>
                {member.isMemorial && (
                  <span className="text-secondary text-[11px] font-bold"> [رحمه الله / تكريم الأرشيف]</span>
                )}
                {i < castData.arabicDub.length - 1 && " • "}
              </span>
            ))}
          </p>
        </div>

        {/* Japanese Original Voice Cast */}
        <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-white/5">
          <span className="font-label-md text-label-md text-primary flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[16px]">mic</span>
            مؤدو الأصوات اليابانيين الأصليين (Seiyuu):
          </span>
          <p className="font-body-md text-body-md text-on-surface leading-normal font-sans">
            {castData.japaneseSeiyuu.map((member, i) => (
              <span key={i}>
                <span className="font-semibold">{member.actor}</span>
                <span className="text-on-surface-variant text-xs"> ({member.role})</span>
                {i < castData.japaneseSeiyuu.length - 1 && " • "}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Tags & Quick Planet Link */}
      <div className="flex items-center gap-space-xs flex-wrap pt-space-xs border-t border-white/[0.04]">
        <span className="font-label-sm text-label-sm text-outline-variant font-bold">التصنيفات:</span>
        {castData.tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface hover:text-primary font-body-sm text-body-sm border border-white/5 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}

        {/* Planet Badge */}
        <Link
          href={castData.planet.href}
          className="px-space-sm py-1 rounded bg-primary-container/20 text-primary-container font-label-md text-label-md flex items-center gap-1 hover:bg-primary-container hover:text-on-primary-container transition-all border border-primary-container/30"
        >
          <span className="material-symbols-outlined text-[16px]">public</span>
          <span>{castData.planet.name}</span>
        </Link>
      </div>
    </div>
  );
}
