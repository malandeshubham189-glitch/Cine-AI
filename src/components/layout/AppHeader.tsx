import React, { useState } from 'react';
import { Film, Search, Bell, ChevronDown, Check, Settings, LogOut, Crown, Keyboard } from 'lucide-react';
import { Project, UserProfile, NavigationTab } from '../../types';

interface AppHeaderProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (proj: Project) => void;
  user: UserProfile;
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenShortcuts?: () => void;
  onOpenCreditModal: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  user,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenShortcuts,
  onOpenAuth,
  onLogout
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Project Switcher */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setIsProjectDropdownOpen(!isProjectDropdownOpen);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all text-xs font-medium shadow-sm cursor-pointer"
          >
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-semibold max-w-[140px] sm:max-w-[200px] truncate text-white">
              {activeProject?.title || 'Select Production'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-fadeIn">
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active Productions
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setIsProjectDropdownOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer
                    ${p.id === activeProject?.id ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'}
                  `}
                >
                  <div className="truncate">
                    <p className="font-semibold text-slate-100 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400">{p.genre} • {p.episodes?.length || 0} Episodes</p>
                  </div>
                  {p.id === activeProject?.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 3.6 Flash Active</span>
        </div>
      </div>

      {/* Right: Search, Keyboard Shortcuts, Subscription Badge, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-slate-200 transition-colors text-xs cursor-pointer"
          title="Open AI Command Palette (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Search & AI Commands...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-mono font-bold">⌘K</kbd>
        </button>

        {/* Keyboard Shortcuts Trigger Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4 text-slate-400 hover:text-emerald-400" />
          </button>
        )}

        {/* Subscription Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Creator Pro</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          title="Global Notification Center"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsProjectDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-800/80 group focus:outline-none cursor-pointer"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">{user.studioName}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn flex flex-col gap-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-0.5">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Creator Pro Plan</span>
                  </div>
                </div>
              </div>

              <div className="my-1 border-t border-slate-800/80" />

              <button
                onClick={() => {
                  onNavigate('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>Studio Settings</span>
              </button>

              {onOpenAuth && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-colors text-left cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Firebase Sign In / Auth</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
