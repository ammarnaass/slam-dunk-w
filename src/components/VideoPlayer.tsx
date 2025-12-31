"use client";

import { useState, useEffect } from "react";
import { Episode } from "@/types";
import { Play, Server, AlertCircle, Loader2 } from "lucide-react";

interface VideoPlayerProps {
    episode: Episode;
}

export default function VideoPlayer({ episode }: VideoPlayerProps) {
    const servers = episode.servers || [];
    const [activeServer, setActiveServer] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [activeServer, episode.id]);

    const getEmbedUrl = (server: { name: string; url: string }) => {
        const url = server.url;
        const name = server.name.toLowerCase();

        // Mega
        if (url.includes("mega.nz/file/")) {
            const match = url.match(/mega\.nz\/file\/([^#]+)#(.+)/);
            if (match) return `https://mega.nz/embed/${match[1]}!${match[2]}`;
        }

        // 4shared
        if (url.includes("4shared.com")) {
            // Standard 4shared link to embed conversion
            // e.g. https://www.4shared.com/video/ID/NAME.html -> https://www.4shared.com/web/embed/file/ID
            const match = url.match(/4shared\.com\/(?:video|file|rar|zip|mp3)\/([^/]+)/);
            if (match) return `https://www.4shared.com/web/embed/file/${match[1]}`;
        }

        // Upload4 / Uploda (Assuming standard embed pattern if available)
        // If it's a direct iframe link, return it. If it's a page link, try to guess or just return.
        if (url.includes("uploda4") || url.includes("upload4")) {
            return url; // Many of these sites provide specific embed links
        }

        return url;
    };

    if (servers.length === 0 && !episode.video_url && !episode.mega_link) {
        return (
            <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-800 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium">عذراً، لا تتوفر مصادر مشاهدة لهذه الحلقة حالياً</p>
            </div>
        );
    }

    const currentServer = servers[activeServer] || (episode.video_url ? { name: "Direct", url: episode.video_url } : { name: "Mega", url: episode.mega_link || "" });
    const embedUrl = getEmbedUrl(currentServer);

    return (
        <div className="flex flex-col gap-4">
            {/* Player Container */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                    </div>
                )}

                {currentServer.name.toLowerCase() === "direct" || currentServer.url.endsWith(".mp4") ? (
                    <video
                        key={currentServer.url}
                        className="w-full h-full"
                        controls
                        poster={episode.thumbnail || undefined}
                    >
                        <source src={currentServer.url} type="video/mp4" />
                        المتصفح لا يدعم تشغيل الفيديو.
                    </video>
                ) : (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={episode.title}
                    />
                )}
            </div>

            {/* Source Selector */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-600/10 rounded-lg">
                        <Server className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-white font-bold">اختر مصدر المشاهدة</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {servers.map((server, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveServer(index)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeServer === index
                                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20"
                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <Play size={14} className={activeServer === index ? "fill-white" : ""} />
                            {server.name} {server.quality ? `(${server.quality})` : ""}
                        </button>
                    ))}

                    {/* Fallback legacy links if not in servers array */}
                    {servers.length === 0 && (episode.video_url || episode.mega_link) && (
                        <button
                            className="bg-red-600 border-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg"
                        >
                            <Play size={14} className="inline ml-2" />
                            المصدر الافتراضي
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
