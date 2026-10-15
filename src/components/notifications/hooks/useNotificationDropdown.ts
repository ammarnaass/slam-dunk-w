"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { SiteNotification } from "@/types/notification.types";

export function useNotificationDropdown() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        showModalNotification,
        sendTestNotification,
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
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "unread") return !n.isRead;
        return true;
    });

    const handleItemClick = (notif: SiteNotification) => {
        markAsRead(notif.id);
        // Also trigger bottom-left modal for closer inspection if desired
        showModalNotification(notif);
        setIsOpen(false);
    };

    return {
        dropdownRef,
        isOpen,
        setIsOpen,
        filter,
        setFilter,
        notifications,
        unreadCount,
        filteredNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        showModalNotification,
        sendTestNotification,
        handleItemClick,
    };
}
