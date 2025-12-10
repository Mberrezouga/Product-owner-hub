import React from 'react';
import { Bell, AlertCircle, DollarSign, Calendar, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useData } from '../context/DataContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useData();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'deadline':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'budget':
        return <DollarSign className="h-4 w-4 text-red-600" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-teal-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-teal-600" />
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No notifications</p>
            <p className="text-slate-400 text-xs mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-teal-50/30' : ''
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-900">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-teal-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notification.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
