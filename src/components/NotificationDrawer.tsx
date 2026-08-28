import React from 'react';
import { X, Bell, AlertTriangle, AlertOctagon, Calendar, Trophy, CheckCheck, Trash2, ShieldAlert } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { AlertType } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useExpense();

  if (!isOpen) return null;

  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'budget_exceeded':
        return <AlertOctagon className="w-4 h-4 text-rose-500" />;
      case 'budget_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'unusual_expense':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      case 'recurring_due':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'goal_reached':
      case 'streak_milestone':
        return <Trophy className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        id="notification-drawer"
        className="fixed inset-y-0 right-0 max-w-sm w-full bg-slate-900/85 backdrop-blur-2xl shadow-2xl border-l border-white/15 flex flex-col z-10 animate-in slide-in-from-right duration-200 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-400/20 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Smart Alerts & Notifications</h3>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={clearNotifications}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
              <Bell className="w-8 h-8 mb-2 stroke-1 text-slate-500" />
              <p className="text-sm font-medium text-slate-300">No notifications</p>
              <p className="text-xs text-slate-500 mt-0.5">Budget alerts and anomaly notifications appear here.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`pt-2.5 first:pt-0 p-2.5 rounded-xl transition-all cursor-pointer ${
                  notif.isRead
                    ? 'opacity-60 hover:opacity-100 bg-transparent'
                    : 'bg-sky-500/10 border border-sky-400/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-white truncate">
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)] shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
