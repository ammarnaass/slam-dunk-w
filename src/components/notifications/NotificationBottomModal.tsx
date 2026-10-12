"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
    X, 
    Play, 
    Sparkles, 
    Crown, 
    Radio, 
    Tv, 
    Check, 
    ArrowLeft,
    BellRing,
    ExternalLink
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const AUTO_DISMISS_DURATION = 9000; // 9 seconds

export default function NotificationBottomModal() {
    const { activeModalNotification, closeModalNotification, markAsRead } = useNotifications();
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const remainingTimeRef = useRef<number>(AUTO_DISMISS_DURATION);

    // Reset and start countdown timer when active notification changes
    useEffect(() => {
        if (!activeModalNotification) return;

        setProgress(100);
        remainingTimeRef.current = AUTO_DISMISS_DURATION;
        startTimeRef.current = Date.now();

        const step = 50; // update progress every 50ms
        timerRef.current = setInterval(() => {
            if (!isPaused) {
                remainingTimeRef.current -= step;
                const percentage = Math.max(0, (remainingTimeRef.current / AUTO_DISMISS_DURATION) * 100);
                setProgress(percentage);

                if (remainingTimeRef.current <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    closeModalNotification();
                }
            }
        }, step);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeModalNotification, isPaused, closeModalNotification]);

    if (!activeModalNotification) return null;

    const notif = activeModalNotification;

    const handleActionClick = () => {
        markAsRead(notif.id);
        closeModalNotification();
    };

    const handleDismiss = () => {
        markAsRead(notif.id);
        closeModalNotification();
    };

    // Color theme based on type
    const isVip = notif.type === "vip";
    const isEpisode = notif.type === "episode";
    const isServer = notif.type === "server";

    return (
        <aside
            aria-live="polite"
            role="status"
            dir="rtl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="fixed z-50 bottom-20 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-[410px] w-auto animate-in slide-in-from-bottom-6 fade-in duration-300 pointer-events-auto"
        >
            <div className="relative overflow-hidden rounded-[26px] bg-[#14141a]/95 backdrop-blur-2xl border border-white/[0.12] hover:border-white/[0.22] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 sm:p-5 transition-all group">
                
                {/* Background Ambient Glow */}
                <div 
                    className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${
                        isVip ? "bg-[#ffb95f]" : isServer ? "bg-emerald-500" : "bg-[#dc2626]"
                    }`} 
                />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                        {/* Glowing Pulse Dot */}
                        <span className="relative flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                isVip ? "bg-amber-400" : isServer ? "bg-emerald-400" : "bg-[#dc2626]"
                            }`} />
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                isVip ? "bg-amber-500" : isServer ? "bg-emerald-500" : "bg-[#dc2626]"
                            }`} />
                        </span>

                        {/* Badge Tag */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-cairo font-black flex items-center gap-1 border ${
                            isVip
                                ? "bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30"
                                : isServer
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-[#dc2626]/15 text-[#ffb4ab] border-[#dc2626]/30"
                        }`}>
                            {isVip && <Crown size={11} />}
                            {isEpisode && <Tv size={11} />}
                            {isServer && <Radio size={11} />}
                            <span>{notif.badgeText || "تنبيه فوري"}</span>
                        </span>

                        <span className="text-[10px] font-tajawal text-[#94a3b8]">
                            {notif.timestamp}
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="p-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#94a3b8] hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="إغلاق التنبيه"
                        aria-label="إغلاق التنبيه"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Body Content Row */}
                <div className="flex items-start gap-3.5 relative z-10">
                    {/* Thumbnail if available */}
                    {notif.imageUrl && (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#1f1f26] border border-white/10 shrink-0 shadow-md relative group-hover:scale-105 transition-transform">
                            <img
                                src={notif.imageUrl}
                                alt={notif.title}
                                className="w-full h-full object-cover"
                            />
                            {isEpisode && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                    <Play size={16} fill="white" className="text-white" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-cairo font-black text-xs sm:text-sm text-white leading-snug line-clamp-2">
                            {notif.title}
                        </h4>
                        <p className="font-tajawal text-[11px] sm:text-xs text-[#94a3b8] line-clamp-2 mt-1 leading-relaxed">
                            {notif.message}
                        </p>
                    </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3 relative z-10">
                    {notif.link ? (
                        <Link
                            href={notif.link}
                            onClick={handleActionClick}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-cairo font-black transition-all shadow-lg ${
                                isVip
                                    ? "bg-gradient-to-r from-[#ffb95f] to-[#ee9800] text-black shadow-amber-950/40 hover:brightness-110"
                                    : "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white shadow-red-950/50 hover:brightness-110"
                            }`}
                        >
                            <span>{notif.actionLabel || "استكشف الآن"}</span>
                            <ArrowLeft size={13} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-cairo font-bold transition-all"
                        >
                            <Check size={13} />
                            <span>تمت القراءة</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="px-3 py-2 rounded-xl text-[11px] font-tajawal text-[#94a3b8] hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                        إخفاء
                    </button>
                </div>

                {/* Animated Auto-Dismiss Progress Bar at the bottom */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/[0.06] overflow-hidden">
                    <div
                        className={`h-full transition-all duration-75 ${
                            isVip ? "bg-[#ffb95f]" : isServer ? "bg-emerald-400" : "bg-[#dc2626]"
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </aside>
    );
}
