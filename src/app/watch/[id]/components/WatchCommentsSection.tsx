"use client";

import { useState } from "react";
import { CommentItem, INITIAL_COMMENTS } from "./watch-stitch-data";

interface WatchCommentsSectionProps {
  onShowToast: (message: string, icon?: string) => void;
  onJumpToTime?: (timeStr: string) => void;
}

export default function WatchCommentsSection({
  onShowToast,
  onJumpToTime
}: WatchCommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [sortTab, setSortTab] = useState<"featured" | "newest">("featured");
  const [inputText, setInputText] = useState("");
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<string, number>>({});

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Check if user included a timestamp e.g. 12:45
    const timeMatch = inputText.match(/\b\d{1,2}:\d{2}\b/);
    const extractedTime = timeMatch ? timeMatch[0] : undefined;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: "أنت (دايزر مميز)",
      avatarLetter: "أ",
      avatarBg: "bg-primary-container text-on-primary-container",
      isVip: true,
      timeAgo: "الآن",
      isVerified: true,
      text: inputText.trim(),
      timestamp: extractedTime,
      hasSpoiler,
      likes: 1,
      dislikes: 0,
      repliesCount: 0
    };

    setComments([newComment, ...comments]);
    setInputText("");
    setHasSpoiler(false);
    onShowToast("تم نشر تعليقك بنجاح في مجتمع الدايزرز!", "chat");
  };

  const toggleRevealSpoiler = (id: string) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLike = (id: string) => {
    setLikedComments(prev => {
      const current = prev[id] || 0;
      const next = current === 1 ? 0 : 1;
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="w-full bg-surface-container p-space-md sm:p-space-lg rounded-xl shadow-md flex flex-col gap-space-lg border border-white/[0.06]">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-space-xs border-b border-white/[0.04]">
        <div className="flex items-center gap-space-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            نقاشات المشاهدين والآراء
          </h3>
          <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
            {comments.length + 1435} تعليق
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setSortTab("featured")}
            className={`px-space-sm py-1 rounded font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
              sortTab === "featured"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            الأبرز
          </button>
          <button
            onClick={() => setSortTab("newest")}
            className={`px-space-sm py-1 rounded font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
              sortTab === "newest"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            الأحدث
          </button>
        </div>
      </div>

      {/* Comment Creation Box */}
      <form onSubmit={handlePostComment} className="w-full bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm shadow-inner border border-white/5">
        <div className="flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary font-headline-sm text-headline-sm font-bold">
            ع
          </div>
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline p-space-md rounded-xl font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-all border border-white/5 resize-none"
              id="comment-input"
              placeholder="شارك رأيك في مجريات هذه الحلقة... يمكنك تضمين توقيت زمني مثل 12:45"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-space-xs flex-wrap gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasSpoiler}
              onChange={(e) => setHasSpoiler(e.target.checked)}
              className="accent-primary-container w-4 h-4 rounded cursor-pointer"
              id="spoiler-check"
            />
            <span className="font-body-sm text-body-sm text-error flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">visibility_off</span>
              يحتوي على حرق للأحداث (Spoiler)
            </span>
          </label>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_16px_rgba(220,38,38,0.4)] cursor-pointer font-bold"
            id="post-comment-btn"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>نشر التعليق</span>
          </button>
        </div>
      </form>

      {/* Comments List Feed */}
      <div className="flex flex-col gap-space-md" id="comments-list">
        {comments.map((comm) => {
          const isRevealed = revealedSpoilers[comm.id];
          const userLikeDelta = likedComments[comm.id] || 0;

          return (
            <div
              key={comm.id}
              className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-sm hover:bg-surface-container-high transition-colors border border-white/5"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className={`w-9 h-9 rounded-full ${comm.avatarBg || "bg-surface-container-highest"} flex items-center justify-center font-bold text-sm shrink-0`}>
                    {comm.avatarLetter}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {comm.author}
                      </span>
                      {comm.isVip && (
                        <span className="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary font-label-sm text-label-sm font-extrabold text-[10px]">
                          VIP DAZER
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-body-sm text-outline text-xs">
                      {comm.timeAgo} {comm.isVerified ? "• تم التحقق" : ""}
                    </span>
                  </div>
                </div>

                {/* Badges (Pinned / Spoiler) */}
                <div className="flex items-center gap-1.5">
                  {comm.isPinned && (
                    <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold bg-secondary-container/10 px-2 py-0.5 rounded-full border border-secondary-container/20">
                      <span className="material-symbols-outlined text-[14px]">push_pin</span>
                      <span>مثبت من المشرف</span>
                    </div>
                  )}

                  {comm.hasSpoiler && (
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      حرق للأحداث
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Body */}
              {comm.hasSpoiler && !isRevealed ? (
                <div
                  onClick={() => toggleRevealSpoiler(comm.id)}
                  className="relative pr-11 cursor-pointer py-2 rounded bg-surface-container-lowest/50"
                >
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed blur-sm select-none">
                    {comm.text}
                  </p>
                  <span className="absolute inset-0 flex items-center justify-center text-primary font-label-md text-label-md font-bold bg-black/40 rounded">
                    انقر هنا للكشف عن النص المحروق
                  </span>
                </div>
              ) : (
                <p className="font-body-md text-body-md text-on-surface leading-relaxed pr-11">
                  {comm.text}
                  {comm.timestamp && (
                    <button
                      onClick={() => {
                        onShowToast(`قفز المشغل إلى التوقيت ${comm.timestamp}`, "timer");
                        if (onJumpToTime && comm.timestamp) onJumpToTime(comm.timestamp);
                      }}
                      className="text-primary-container underline font-semibold mr-1 inline-flex items-center gap-0.5 hover:text-primary cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{comm.timestamp}</span>
                    </button>
                  )}
                </p>
              )}

              {/* Actions Footer */}
              <div className="flex items-center gap-space-md pr-11 text-on-surface-variant font-body-sm text-body-sm pt-1">
                <button
                  onClick={() => handleLike(comm.id)}
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    userLikeDelta === 1 ? "text-primary font-bold" : "hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {userLikeDelta === 1 ? "thumb_up" : "thumb_up_off_alt"}
                  </span>
                  <span>{comm.likes + userLikeDelta}</span>
                </button>

                <button
                  onClick={() => onShowToast("تم تسجيل عدم الإعجاب", "thumb_down")}
                  className="flex items-center gap-1 hover:text-error transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                </button>

                <button
                  onClick={() => onShowToast("خاصية الردود متاحة للأعضاء", "reply")}
                  className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">reply</span>
                  <span>رد ({comm.repliesCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Loader Simulation */}
      <div className="w-full flex flex-col items-center justify-center py-space-sm gap-space-xs text-on-surface-variant">
        <div className="w-7 h-7 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
        <span className="font-body-sm text-body-sm text-xs">
          جارٍ تحميل المزيد من آراء مجتمع الدايزرز...
        </span>
      </div>
    </div>
  );
}
