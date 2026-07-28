import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              pointer-events-auto p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border shadow-2xl flex items-start gap-3 text-xs
              ${toast.type === 'success' ? 'border-emerald-500/40 text-emerald-300' : ''}
              ${toast.type === 'info' ? 'border-cyan-500/40 text-cyan-300' : ''}
              ${toast.type === 'warning' ? 'border-amber-500/40 text-amber-300' : ''}
              ${toast.type === 'error' ? 'border-rose-500/40 text-rose-300' : ''}
              ${!toast.type ? 'border-emerald-500/40 text-emerald-300' : ''}
            `}
          >
            <div className="p-1.5 rounded-xl bg-slate-950 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {(!toast.type) && <Sparkles className="w-4 h-4 text-emerald-400" />}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <h4 className="font-bold text-white text-xs">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] text-slate-300 leading-relaxed truncate">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
