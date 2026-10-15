"use client";

import Link from "next/link";
import { Play, Crown, Tv, Radio, Trash2, ArrowLeft } from "lucide-react";
import { SiteNotification } from "@/types/notification.types";

interface NotificationItemRowProps {
    notif: SiteNotification;
    onItemClick: (notif: SiteNotification) => void;
    onRemove: (id: string) => void;
    onLinkClick: (id: string) => void;
}

export function NotificationItemRow({
    notif,
    onItemClick,
    onRemove,
    onLinkClick,
}: NotificationItemRowProps) {
    const isVip = notif.type === "vip";
    const isEpisode = notif.type === "episode";
    const isServer = notif.type === "server";

    return (
        <div
            className={`p-3.5 sm:p-4 transition-all hover:bg-white/[0.03] flex items-start gap-3 relative group ${
                !notif.isRead ? "bg-[#dc2626]/[0.03]" : ""
            }`}
        >
            {/* Unread Glowing Dot */}
            {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#dc2626] shrink-0 mt-2 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            )}

            {/* Thumbnail or Icon Circle */}
            {notif.imageUrl ? (
                <div
                    onClick={() => onItemClick(notif)}
                    className="w-12 h-12 rounded-xl overflow-hidden bg-[#1f1f26] border border-white/10 shrink-0 cursor-pointer relative"
                >
                    <img
                        src={notif.imageUrl}
                        alt={notif.title}
                        className="w-full h-full object-cover"
                    />
                    {isEpisode && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                            <Play size={12} fill="white" />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isVip
                            ? "bg-[#ffb95f]/10 border-[#ffb95f]/30 text-[#ffb95f]"
                            : isServer
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-[#dc2626]/10 border-[#dc2626]/30 text-[#ffb4ab]"
                    }`}
                >
                    {isVip && <Crown size={16} />}
                    {isEpisode && <Tv size={16} />}
                    {isServer && <Radio size={16} />}
                </div>
            )}

            {/* Text Info */}
            <div className="flex-1 min-w-0" onClick={() => onItemClick(notif)}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-cairo font-bold border ${
                            isVip
                                ? "bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30"
                                : isServer
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-[#dc2626]/15 text-[#ffb4ab] border-[#dc2626]/30"
                        }`}
                    >
                        {notif.badgeText || "تنبيه"}
                    </span>
                    <span className="text-[10px] font-tajawal text-[#94a3b8]">
                        {notif.timestamp}
                    </span>
                </div>

                <h4
                    className={`font-cairo font-bold text-xs cursor-pointer line-clamp-1 ${
                        !notif.isRead ? "text-white" : "text-[#e4e1e7]"
                    }`}
                >
                    {notif.title}
                </h4>

                <p className="font-tajawal text-[11px] text-[#94a3b8] line-clamp-2 mt-0.5 leading-relaxed">
                    {notif.message}
                </p>
            </div>

            {/* Action buttons (Delete & Quick Open) */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 self-center">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notif.id);
                    }}
                    className="p-1 rounded-lg text-[#94a3b8] hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="حذف هذا الإشعار"
                >
                    <Trash2 size={13} />
                </button>

                {notif.link && (
                    <Link
                        href={notif.link}
                        onClick={() => onLinkClick(notif.id)}
                        className="text-[10px] font-cairo font-bold text-[#ffb95f] hover:underline flex items-center gap-0.5"
                    >
                        <span>فتح</span>
                        <ArrowLeft size={10} />
                    </Link>
                )}
            </div>
        </div>
    );
}
