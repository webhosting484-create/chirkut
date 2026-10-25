import React, { useState, useEffect } from 'react';
import { X, Bell, Check, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notifications';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  lang: 'bn' | 'en';
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, userId, lang }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToNotifications(userId, setNotifications);
    return () => unsubscribe();
  }, [isOpen, userId]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(userId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'friend_request': return '👋';
      case 'friend_accepted': return '✅';
      case 'mention': return '@';
      case 'system': return '🔔';
      default: return '📩';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md h-full bg-[#181310] border-l border-[#3D3228] p-6 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C231B] mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-lg text-[#FAF3EB]">
              {lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB] transition-colors"
              title={lang === 'bn' ? 'সব পড়া হয়েছে' : 'Mark all as read'}
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-xs font-serif text-[#8C7A6B]">
              <Bell className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
              <span>{lang === 'bn' ? 'কোনো নোটিফিকেশন নেই।' : 'No notifications yet.'}</span>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  notification.isRead
                    ? 'bg-[#201915] border-[#2D231B]'
                    : 'bg-[#251E19] border-[#C5A880]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-serif text-[#FAF3EB] font-medium">
                      {notification.title}
                    </p>
                    <p className="text-xs font-serif text-[#C8BCB0] mt-1">
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-serif text-[#786657] mt-1">
                      {notification.createdAt}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
