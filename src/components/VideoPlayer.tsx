"use client";

import { Episode } from "@/types";

interface VideoPlayerProps {
    episode: Episode;
}

export default function VideoPlayer({ episode }: VideoPlayerProps) {
    const hasDirectVideo = !!episode.video_url;

    // استخراج معرف الملف من رابط Mega لعمل embed
    const getMegaEmbedUrl = (megaLink: string) => {
        try {
            const match = megaLink.match(/mega\.nz\/file\/([^#]+)#(.+)/);
            if (match) {
                const fileId = match[1];
                const key = match[2];
                return `https://mega.nz/embed/${fileId}!${key}`;
            }
        } catch (e) {
            console.error("Error parsing Mega link:", e);
        }
        return null;
    };

    const embedUrl = getMegaEmbedUrl(episode.mega_link);

    // إذا كان هناك رابط فيديو مباشر
    if (hasDirectVideo) {
        return (
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-900">
                <video className="w-full h-full" controls poster={episode.thumbnail}>
                    <source src={episode.video_url} type="video/mp4" />
                    المتصفح لا يدعم تشغيل الفيديو.
                </video>
            </div>
        );
    }

    // عرض iframe مباشرة
    if (embedUrl) {
        return (
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-900">
                <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={episode.title}
                />
            </div>
        );
    }

    // في حالة عدم وجود رابط صالح
    return (
        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
            <p className="text-slate-400">لا يوجد رابط متاح لهذه الحلقة</p>
        </div>
    );
}
