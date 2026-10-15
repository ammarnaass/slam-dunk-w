"use client";

import { useNotificationDropdown } from "./hooks/useNotificationDropdown";
import {
    NotificationTriggerButton,
    NotificationDropdownHeader,
    NotificationFilterTabs,
    NotificationItemRow,
    NotificationEmptyState,
    NotificationDropdownFooter,
} from "./components";

export default function NotificationDropdown() {
    const {
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
    } = useNotificationDropdown();

    return (
        <div className="relative" ref={dropdownRef} dir="rtl">
            {/* Bell Icon Trigger */}
            <NotificationTriggerButton
                isOpen={isOpen}
                unreadCount={unreadCount}
                onToggle={() => setIsOpen((prev) => !prev)}
            />

            {/* Dropdown Floating Window */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-[340px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] rounded-[26px] bg-[#14141a]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    {/* Header */}
                    <NotificationDropdownHeader
                        unreadCount={unreadCount}
                        onMarkAllAsRead={markAllAsRead}
                    />

                    {/* Filter Tabs */}
                    <NotificationFilterTabs
                        filter={filter}
                        totalCount={notifications.length}
                        unreadCount={unreadCount}
                        onFilterChange={setFilter}
                        onSendTest={sendTestNotification}
                    />

                    {/* Notification Items List */}
                    <div className="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-white/[0.04]">
                        {filteredNotifications.length === 0 ? (
                            <NotificationEmptyState filter={filter} />
                        ) : (
                            filteredNotifications.map((notif) => (
                                <NotificationItemRow
                                    key={notif.id}
                                    notif={notif}
                                    onItemClick={handleItemClick}
                                    onRemove={removeNotification}
                                    onLinkClick={(id) => {
                                        markAsRead(id);
                                        setIsOpen(false);
                                    }}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer Actions */}
                    {notifications.length > 0 && (
                        <NotificationDropdownFooter
                            onClearAll={clearAll}
                            onOpenModalView={() => {
                                const first = notifications[0];
                                if (first) showModalNotification(first);
                                setIsOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
