export type NotificationType = "episode" | "vip" | "server" | "system" | "pwa";

export interface SiteNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string; // وقت نسبي للعرض مثل "منذ 10 دقائق"
    createdAt: number; // وقت الإنشاء بالمللي ثانية للترتيب
    isRead: boolean;
    link?: string; // رابط التوجيه عند النقر
    actionLabel?: string; // نص زر الإجراء
    imageUrl?: string; // صورة مصغرة أو بوستر
    badgeText?: string; // شارة مميزة
    badgeColor?: "crimson" | "amber" | "emerald" | "sky";
}

export interface NotificationContextType {
    notifications: SiteNotification[];
    unreadCount: number;
    activeModalNotification: SiteNotification | null;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    showModalNotification: (notification: SiteNotification) => void;
    closeModalNotification: () => void;
    sendTestNotification: () => void;
}
