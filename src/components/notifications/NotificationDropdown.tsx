"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
    Bell, 
    CheckCheck, 
    Trash2, 
    Sparkles, 
    Play, 
    Crown, 
    Radio, 
    Tv, 
    Check, 
    ArrowLeft, 
    X,
    Filter,
    BellRing
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { SiteNotification } from "@/types/notification.types";

export default function NotificationDropdown() {
    const { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        removeNotification, 
        clearAll,
        showModalNotification,
        sendTestNotification
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.isRead;
        return true;
    });

    const handleItemClick = (notif: SiteNotification) => {
        markAsRead(notif.id);
        // Also trigger bottom-left modal for closer inspection if desired
        showModalNotification(notif);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef} dir="rtl">
            {/* Bell Icon Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px] ${
                    isOpen 
                        ? "bg-[#2a292e] text-white border-[#dc2626]/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                        : "bg-[#1b1b1f] hover:bg-[#1f1f23] text-[#94a3b8] hover:text-[#e4e1e7] border-white/[0.06]"
                }`}
                title="التنبيهات والإشعارات"
                aria-label="التنبيهات"
                aria-expanded={isOpen}
            >
                <Bell size={17} className={unreadCount > 0 ? "text-[#ffb4ab]" : ""} />
                
                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#dc2626] text-white rounded-full text-[10px] font-black flex items-center justify-center font-cairo ring-2 ring-[#131317] animate-pulse shadow-md shadow-red-950">
                        {unreadCount > 9 ? "+9" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Floating Window */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-[340px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] rounded-[26px] bg-[#14141a]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab]">
                                <BellRing size={16} />
                            </div>
                            <div>
                                <h3 className="font-cairo font-black text-sm text-white leading-tight">
                                    التنبيهات والإشعارات
                                </h3>
                                <span className="font-tajawal text-[11px] text-[#94a3b8]">
                                    {unreadCount > 0 ? `لديك ${unreadCount} تنبيهات غير مقروءة` : "جميع التنبيهات مقروءة"}
                                </span>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-[11px] font-cairo font-bold text-[#ffb95f] hover:text-white transition-colors cursor-pointer"
                                title="تحديد جميع التنبيهات كمقروءة"
                            >
                                <CheckCheck size={14} />
                                <span>مقروء للكل</span>
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="px-4 py-2 bg-black/30 border-b border-white/[0.04] flex items-center justify-between text-xs font-cairo">
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                                    filter === "all" 
                                        ? "bg-white/10 text-white" 
                                        : "text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                الكل ({notifications.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter("unread")}
                                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-[11px] ${
                                    filter === "unread" 
                                        ? "bg-[#dc2626]/20 text-[#ffb4ab] border border-[#dc2626]/30" 
                                        : "text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                غير مقروءة ({unreadCount})
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={sendTestNotification}
                            className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-[#ffb95f] transition-colors cursor-pointer"
                            title="إرسال إشعار فوري تجريبي"
                        >
                            <Sparkles size={11} className="text-[#ffb95f]" />
                            <span>إشعار تجريبي</span>
                        </button>
                    </div>

                    {/* Notification Items List */}
                    <div className="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-white/[0.04]">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center space-y-2.5">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#94a3b8] mx-auto">
                                    <CheckCheck size={22} className="text-emerald-400" />
                                </div>
                                <p className="font-cairo font-bold text-xs text-white">
                                    {filter === "unread" ? "لا توجد تنبيهات جديدة غير مقروءة" : "لا توجد إشعارات حالياً"}
                                </p>
                                <p className="font-tajawal text-[11px] text-[#94a3b8]">
                                    أنت مطلع على أحدث الحلقات وسيرفرات البث والعروض الحصرية!
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((notif) => {
                                const isVip = notif.type === "vip";
                                const isEpisode = notif.type === "episode";
                                const isServer = notif.type === "server";

                                return (
                                    <div
                                        key={notif.id}
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
                                                onClick={() => handleItemClick(notif)}
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
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                                isVip 
                                                    ? "bg-[#ffb95f]/10 border-[#ffb95f]/30 text-[#ffb95f]" 
                                                    : isServer 
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                    : "bg-[#dc2626]/10 border-[#dc2626]/30 text-[#ffb4ab]"
                                            }`}>
                                                {isVip && <Crown size={16} />}
                                                {isEpisode && <Tv size={16} />}
                                                {isServer && <Radio size={16} />}
                                            </div>
                                        )}

                                        {/* Text Info */}
                                        <div className="flex-1 min-w-0" onClick={() => handleItemClick(notif)}>
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-cairo font-bold border ${
                                                    isVip
                                                        ? "bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30"
                                                        : isServer
                                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                        : "bg-[#dc2626]/15 text-[#ffb4ab] border-[#dc2626]/30"
                                                }`}>
                                                    {notif.badgeText || "تنبيه"}
                                                </span>
                                                <span className="text-[10px] font-tajawal text-[#94a3b8]">
                                                    {notif.timestamp}
                                                </span>
                                            </div>

                                            <h4 className={`font-cairo font-bold text-xs cursor-pointer line-clamp-1 ${
                                                !notif.isRead ? "text-white" : "text-[#e4e1e7]"
                                            }`}>
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
                                                    removeNotification(notif.id);
                                                }}
                                                className="p-1 rounded-lg text-[#94a3b8] hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                title="حذف هذا الإشعار"
                                            >
                                                <Trash2 size={13} />
                                            </button>

                                            {notif.link && (
                                                <Link
                                                    href={notif.link}
                                                    onClick={() => {
                                                        markAsRead(notif.id);
                                                        setIsOpen(false);
                                                    }}
                                                    className="text-[10px] font-cairo font-bold text-[#ffb95f] hover:underline flex items-center gap-0.5"
                                                >
                                                    <span>فتح</span>
                                                    <ArrowLeft size={10} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Actions */}
                    {notifications.length > 0 && (
                        <div className="p-3 bg-black/40 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-cairo">
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-red-400/80 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <Trash2 size={12} />
                                <span>مسح جميع الإشعارات</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const first = notifications[0];
                                    if (first) showModalNotification(first);
                                    setIsOpen(false);
                                }}
                                className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                            >
                                عرض كنافذة عائمة
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
