import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Sparkles, CheckCircle2, Film, Coins, Bell, Trash2, CheckCheck, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  desc: string;
  type: 'ai' | 'render' | 'billing' | 'export';
  unread: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Episode Generation Completed',
      time: 'Just now',
      desc: 'Gemini 3.6 Flash engine synthesized 12 production steps including Screenplay, Scene Cards, and Character Bibles.',
      type: 'ai',
      unread: true
    },
    {
      id: 'n2',
      title: 'One-Click Export ZIP Package Ready',
      time: '15 mins ago',
      desc: 'Production assets, character Prompts, and TXT screenplay packaged for offline distribution.',
      type: 'export',
      unread: true
    },
    {
      id: 'n3',
      title: 'Cinematic Visual Render Ready',
      time: '1 hour ago',
      desc: 'Midjourney v6 and Imagen 3 Master Prompt parameters calibrated for 16:9 4K renders.',
      type: 'render',
      unread: false
    },
    {
      id: 'n4',
      title: 'Studio Pro Credits Refilled',
      time: 'Yesterday',
      desc: '+50,000 AI Production Credits active under Studio Pro Subscription.',
      type: 'billing',
      unread: false
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Notification Center" subtitle="Real-time studio alerts, pipeline status, and AI suggestions">
      <div className="flex flex-col gap-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Activity Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                title="Clear All Notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2 bg-slate-950/50 rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
              <span>No active notifications. You are all caught up!</span>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = n.type === 'ai' ? Sparkles : n.type === 'export' ? CheckCircle2 : n.type === 'render' ? Film : Coins;
              return (
                <div
                  key={n.id}
                  onClick={() => handleToggleRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${n.unread ? 'bg-slate-900 border-emerald-500/30 shadow-md shadow-emerald-950/20' : 'bg-slate-950/60 border-slate-800/80'}`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${n.unread ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold truncate ${n.unread ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
