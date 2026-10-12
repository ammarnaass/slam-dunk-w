"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteNotification, NotificationContextType } from "@/types/notification.types";
import { DEFAULT_NOTIFICATIONS } from "@/lib/notification-presets";

const NOTIFICATIONS_STORAGE_KEY = "anime_daze_notifications_v1";
const MODAL_SHOWN_KEY = "anime_daze_modal_shown_time";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<SiteNotification[]>(DEFAULT_NOTIFICATIONS);
    const [activeModalNotification, setActiveModalNotification] = useState<SiteNotification | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNotifications(parsed);
                } else {
                    setNotifications(DEFAULT_NOTIFICATIONS);
                }
            } else {
                setNotifications(DEFAULT_NOTIFICATIONS);
            }
        } catch (e) {
            console.warn("Failed to load notifications from localStorage:", e);
            setNotifications(DEFAULT_NOTIFICATIONS);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // 2. Persist to localStorage whenever notifications change
    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        } catch (e) {
            console.warn("Failed to persist notifications:", e);
        }
    }, [notifications, isInitialized]);

    // 3. Auto-show the bottom-left floating modal for the top unread alert on first visit
    useEffect(() => {
        if (!isInitialized) return;

        const lastShown = localStorage.getItem(MODAL_SHOWN_KEY);
        const now = Date.now();
        // If not shown in the last 10 minutes, show the first unread notification
        const shouldShow = !lastShown || now - parseInt(lastShown, 10) > 10 * 60 * 1000;

        if (shouldShow) {
            const firstUnread = notifications.find(n => !n.isRead);
            if (firstUnread) {
                const timer = setTimeout(() => {
                    setActiveModalNotification(firstUnread);
                    localStorage.setItem(MODAL_SHOWN_KEY, now.toString());
                }, 2500); // 2.5s pleasant entrance delay
                return () => clearTimeout(timer);
            }
        }
    }, [isInitialized, notifications]);

    // Computed unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Mark single notification as read
    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setActiveModalNotification(current => (current?.id === id ? { ...current, isRead: true } : current));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setActiveModalNotification(current => current ? { ...current, isRead: true } : null);
    }, []);

    // Remove single notification
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setActiveModalNotification(current => current?.id === id ? null : current);
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        setActiveModalNotification(null);
    }, []);

    // Show modal notification
    const showModalNotification = useCallback((notification: SiteNotification) => {
        setActiveModalNotification(notification);
    }, []);

    // Close modal notification
    const closeModalNotification = useCallback(() => {
        setActiveModalNotification(null);
    }, []);

    // Send/Trigger a test notification
    const sendTestNotification = useCallback(() => {
        const testId = `notif-test-${Date.now()}`;
        const newNotif: SiteNotification = {
            id: testId,
            type: "episode",
            title: "تنبيه فوري: صدور حلقة حصرية جديدة 4K!",
            message: "تم تجهيز مشغل الفيديو السريع بدقة فائقة وبدون إعلانات. يمكنك بدء المشاهدة فوراً.",
            timestamp: "الآن",
            createdAt: Date.now(),
            isRead: false,
            link: "/animes",
            actionLabel: "مشاهدة الآن",
            imageUrl: "/hero-bg.jpg",
            badgeText: "بث فوري 4K",
            badgeColor: "crimson"
        };

        setNotifications(prev => [newNotif, ...prev]);
        setActiveModalNotification(newNotif);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                activeModalNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
                showModalNotification,
                closeModalNotification,
                sendTestNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
