import React from 'react';
import { Modal } from '../ui/Modal';
import { Command, Keyboard, Zap, Sparkles, FileText, Download, Search } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: '⌘ / Ctrl + K', desc: 'Open AI Command Palette & Global Search', icon: Command, category: 'Navigation' },
    { key: '?', desc: 'Show Keyboard Shortcuts Reference', icon: Keyboard, category: 'Navigation' },
    { key: '⌘ / Ctrl + N', desc: 'New Production Wizard / Episode Generator', icon: Zap, category: 'Creator' },
    { key: '⌘ / Ctrl + Enter', desc: 'Trigger AI Generation in Studio', icon: Sparkles, category: 'Creator' },
    { key: '⌘ / Ctrl + S', desc: 'Download Full Production JSON Package', icon: Download, category: 'Export' },
    { key: 'Esc', desc: 'Close Modals, Inspector & Fullscreen View', icon: FileText, category: 'System' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" subtitle="CineAI CreatorOS V10 Quick Commands">
      <div className="flex flex-col gap-4">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Speed Up Your Production Workflow</h4>
            <p className="text-[11px] text-slate-400">Use these hotkeys anywhere inside the operating system for instant access.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {shortcuts.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate">{s.desc}</p>
                    <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">{s.category}</span>
                  </div>
                </div>
                <kbd className="px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-emerald-400 text-[11px] font-mono font-bold shrink-0 shadow-sm">
                  {s.key}
                </kbd>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
