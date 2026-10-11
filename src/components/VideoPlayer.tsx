"use client";

import { useState, useEffect } from "react";
import { Episode } from "@/types";

interface VideoPlayerProps {
    episode: Episode & {
        anime?: { title: string };
    };
    onLightsToggle?: () => void;
}

export default function VideoPlayer({ episode, onLightsToggle }: VideoPlayerProps) {
    const servers = episode.servers || [];
    const [activeServer, setActiveServer] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [reported, setReported] = useState(false);
    const [audioTrack, setAudioTrack] = useState<"arabic" | "japanese">("arabic");
    const [quality, setQuality] = useState("1080p");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 350);
        return () => clearTimeout(timer);
    }, [activeServer, episode.id]);

    const getEmbedUrl = (server: { name: string; url: string }) => {
        const url = server.url;
        if (url.includes("mega.nz/file/")) {
            const match = url.match(/mega\.nz\/file\/([^#]+)#(.+)/);
            if (match) return `https://mega.nz/embed/${match[1]}!${match[2]}`;
        }
        if (url.includes("4shared.com")) {
            const match = url.match(/4shared\.com\/(?:video|file|rar|zip|mp3)\/([^/]+)/);
            if (match) return `https://www.4shared.com/web/embed/file/${match[1]}`;
        }
        return url;
    };

    const currentServer = servers[activeServer] || (
        episode.video_url 
            ? { name: "سيرفر البث السحابي (FHD)", url: episode.video_url } 
            : { name: "سيرفر ميجا السريع", url: episode.mega_link || "" }
    );

    const embedUrl = getEmbedUrl(currentServer);

    const handleReport = () => {
        setReported(true);
        setTimeout(() => setReported(false), 3000);
    };

    return (
        <div className="flex flex-col gap-space-md w-full">
            {/* 16:9 Cinematic Video Player Container */}
            <div className="relative w-full aspect-video bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.85)] border border-white/[0.08] group select-none">
                
                {/* Top Overlay Badges */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent p-space-md flex items-center justify-between pointer-events-none z-20">
                    <div className="flex items-center gap-space-xs pointer-events-auto flex-wrap">
                        <span className="px-space-sm py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm tracking-widest uppercase font-extrabold shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                            {quality}
                        </span>
                        <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-on-surface font-label-sm text-label-sm backdrop-blur-md">
                            صوت محيطي 5.1
                        </span>
                        <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-secondary font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px]">translate</span>
                            {audioTrack === "arabic" ? "دبلجة مركز الزهرة" : "ياباني أصلي + ترجمة"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                        <span className="font-headline-sm text-headline-sm tracking-widest font-extrabold text-on-surface">
                            ANIME<span className="text-primary-container">DAZE</span>
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-30 bg-surface-container-lowest/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
                        <span className="font-tajawal text-xs text-primary font-bold">جاري تجهيز سيرفر البث المباشر...</span>
                    </div>
                )}

                {/* Video / Embed Player */}
                {currentServer.url && (currentServer.name.toLowerCase().includes("direct") || currentServer.url.endsWith(".mp4")) ? (
                    <video
                        key={currentServer.url}
                        className="w-full h-full object-contain"
                        controls
                        poster={episode.thumbnail || undefined}
                    >
                        <source src={currentServer.url} type="video/mp4" />
                        المتصفح لا يدعم تشغيل هذا الفيديو.
                    </video>
                ) : embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={episode.title}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest">
                        <span className="material-symbols-outlined text-5xl text-primary-container mb-2">video_camera_back</span>
                        <h3 className="font-headline-sm text-on-surface font-bold">عذراً، سيرفر البث قيد المعالجة</h3>
                        <p className="font-body-sm text-on-surface-variant max-w-sm mt-1">
                            فريق العمل يرفع النسخة بجودة 4K حالياً، يرجى المحاولة بعد قليل أو التبديل لسيرفر بديل أدناه.
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Player Bar (Audio, Quality, Servers, Lights) */}
            <div className="bg-surface-container-low rounded-2xl p-space-md border border-white/[0.06] flex flex-wrap items-center justify-between gap-space-md">
                
                {/* Audio & Quality Switcher */}
                <div className="flex items-center gap-space-md flex-wrap">
                    {/* Audio Selector */}
                    <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
                        <button
                            onClick={() => setAudioTrack("arabic")}
                            className={`px-3 py-1 rounded-lg text-xs font-cairo font-bold transition-all cursor-pointer ${
                                audioTrack === "arabic" 
                                    ? "bg-secondary-container text-on-secondary shadow" 
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            🇸🇦 دبلجة عربية
                        </button>
                        <button
                            onClick={() => setAudioTrack("japanese")}
                            className={`px-3 py-1 rounded-lg text-xs font-cairo font-bold transition-all cursor-pointer ${
                                audioTrack === "japanese" 
                                    ? "bg-primary-container text-on-primary-container shadow" 
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            🇯🇵 ياباني مترجم
                        </button>
                    </div>

                    {/* Quality Selector */}
                    <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
                        {["1080p", "720p", "4K"].map((q) => (
                            <button
                                key={q}
                                onClick={() => setQuality(q)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                    quality === q 
                                        ? "bg-surface-container-high text-primary border border-primary-container/40" 
                                        : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Servers Switcher */}
                <div className="flex items-center gap-space-sm flex-wrap">
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[16px] text-primary-container">dns</span>
                        السيرفرات:
                    </span>
                    {servers.length > 0 ? (
                        servers.map((srv, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveServer(idx)}
                                className={`px-3 py-1 rounded-xl text-xs font-cairo font-bold transition-all cursor-pointer border ${
                                    activeServer === idx
                                        ? "bg-primary-container text-on-primary-container border-primary-container shadow"
                                        : "bg-surface-container text-on-surface-variant hover:text-on-surface border-white/5"
                                }`}
                            >
                                {srv.name || `سيرفر ${idx + 1}`}
                            </button>
                        ))
                    ) : (
                        <span className="px-3 py-1 rounded-xl text-xs bg-surface-container text-primary font-mono">
                            Direct Cloud Stream
                        </span>
                    )}

                    {/* Report Problem Button */}
                    <button
                        onClick={handleReport}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs ${
                            reported 
                                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-400" 
                                : "bg-surface-container border-white/5 text-on-surface-variant hover:text-error"
                        }`}
                        title="إبلاغ عن عطل في السيرفر"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {reported ? "check_circle" : "flag"}
                        </span>
                        <span>{reported ? "تم الإبلاغ" : "إبلاغ"}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
