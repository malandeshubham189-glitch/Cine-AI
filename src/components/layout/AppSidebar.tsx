import React from 'react';
import { 
  Sparkles, 
  FolderKanban, 
  Users, 
  BookOpen, 
  Download, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface AppSidebarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewEpisodeClick: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onNewEpisodeClick
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: Sparkles, badge: 'Studio' },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderKanban },
    { id: 'characters' as NavigationTab, label: 'Characters', icon: Users },
    { id: 'templates' as NavigationTab, label: 'Templates', icon: BookOpen },
    { id: 'exports' as NavigationTab, label: 'Exports', icon: Download },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`
        sticky top-0 z-30 h-screen bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80
        flex flex-col justify-between transition-all duration-300 shrink-0
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Top: Logo & Nav items */}
      <div className="flex flex-col gap-4 p-3">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-3 border-b border-slate-800/80">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-amber-400 p-[1px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-tight text-white">CineAI OS</span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider">CREATOR v2.4</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden md:block"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button */}
        {!isCollapsed ? (
          <button
            onClick={onNewEpisodeClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 hover:brightness-110 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Generate New Episode</span>
          </button>
        ) : (
          <button
            onClick={onNewEpisodeClick}
            className="w-10 h-10 mx-auto rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            title="Generate New Episode"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        )}

        {/* Navigation List */}
        <nav className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-slate-800/90 text-white font-semibold border border-emerald-500/30 shadow-md shadow-emerald-950/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Studio Tier */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">Aetheria Pictures</span>
              <span className="text-[10px] text-slate-400">Studio Pro Plan</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
