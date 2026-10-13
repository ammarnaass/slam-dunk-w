"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Play, Bookmark, BookmarkCheck } from "lucide-react";

export interface PlanetAnimeWork {
  id: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  rating?: string;
  episodes?: string;
  year?: string;
  badge?: string;
  badgeColor?: string;
  link?: string;
  desc?: string;
  genres?: string[];
}

interface PlanetAnimeGridProps {
  works: PlanetAnimeWork[];
  loading?: boolean;
}

export function PlanetAnimeGrid({ works, loading }: PlanetAnimeGridProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/watchlist")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.watchlist)) {
          const map: Record<string, boolean> = {};
          data.watchlist.forEach((id: string) => {
            map[id] = true;
          });
          setBookmarkedIds(map);
        }
      })
      .catch(() => {});
  }, []);

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !bookmarkedIds[id];
    setBookmarkedIds((prev) => ({
      ...prev,
      [id]: nextState,
    }));

    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId: id }),
      });
    } catch (err) {
      console.error("Watchlist toggle failed", err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pb-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#1f1f23] animate-pulse aspect-[2/3] border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-[#1f1f23]/60 border border-white/[0.06] mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center mx-auto mb-4 text-3xl">
          🪐
        </div>
        <h3 className="font-cairo text-lg font-bold text-white mb-2">
          لم يتم العثور على أعمال مطابقة
        </h3>
        <p className="font-tajawal text-xs text-[#ac8884] max-w-md mx-auto">
          جرب تغيير معايير البحث أو اختيار كوكب مداري آخر لاكتشاف المزيد من الأنميات.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        {works.map((work) => {
          const isSaved = !!bookmarkedIds[work.id];
          const watchHref =
            work.link ||
            (work.id === "slam-dunk"
              ? "/watch/slam-dunk-101"
              : `/animes/${work.id}`);

          return (
            <div
              key={work.id}
              className="group flex flex-col bg-[#1f1f23] rounded-2xl overflow-hidden shadow-xl border border-white/[0.06] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_-8px_rgba(220,38,38,0.35)] hover:border-[#dc2626]/40"
            >
              {/* Poster Thumbnail (2:3 aspect) */}
              <Link href={watchHref} className="relative w-full aspect-[2/3] overflow-hidden bg-[#2a292e] block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={work.coverImage || "/hero-bg.jpg"}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                  <span className="bg-[#dc2626] text-white px-2 py-0.5 rounded font-cairo font-black text-[10px] shadow-md">
                    {work.badge || "4K HDR"}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#0e0e12]/85 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[#ffb95f] border border-white/10">
                  <Star size={11} className="fill-[#ffb95f]" />
                  <span className="font-cairo font-bold text-[11px] text-[#e4e1e7]">
                    {work.rating || "9.5"}
                  </span>
                </div>

                {/* Episode Count Tag */}
                <div className="absolute bottom-2.5 right-2.5 bg-[#0e0e12]/85 backdrop-blur-sm px-2 py-0.5 rounded text-[#ac8884] font-tajawal text-[10px] border border-white/10">
                  {work.episodes || "كامل"}
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  {/* Genres / Tags */}
                  <div className="flex items-center gap-1.5 text-[#ac8884] font-tajawal text-[11px] mb-1">
                    <span>{work.subtitle || "أنمي دايز"}</span>
                    {work.year && (
                      <>
                        <span>•</span>
                        <span>{work.year}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={watchHref} className="block">
                    <h4 className="font-cairo text-sm sm:text-base text-[#e4e1e7] font-bold group-hover:text-[#ffb4ab] transition-colors line-clamp-1">
                      {work.title}
                    </h4>
                  </Link>

                  {/* Synopsis */}
                  {work.desc && (
                    <p className="font-tajawal text-xs text-[#ac8884] line-clamp-2 mt-1 leading-relaxed">
                      {work.desc}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={watchHref}
                    className="flex-1 bg-[#dc2626] hover:bg-[#ffb4ab] hover:text-[#690005] text-white py-1.5 px-3 rounded-xl font-cairo font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Play size={13} className="fill-current" />
                    <span>شاهد الآن</span>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(work.id, e)}
                    aria-label="أضف للمفضلة"
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isSaved
                        ? "bg-[#dc2626]/20 text-[#ffb4ab] border border-[#dc2626]/40"
                        : "bg-[#2a292e] text-[#ac8884] hover:text-white hover:bg-[#353439]"
                    }`}
                  >
                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
