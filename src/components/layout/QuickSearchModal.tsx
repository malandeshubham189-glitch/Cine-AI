import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Search, Film, Users, BookOpen, ArrowRight, Zap, Command, Download, Sparkles, FolderDown, Clock, History } from 'lucide-react';
import { Project, Character, CinematicPrompt, NavigationTab } from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  characters: Character[];
  prompts: CinematicPrompt[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectProject?: (project: Project) => void;
}

const RECENT_SEARCHES_KEY = 'cineai_recent_searches_v10';

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  characters,
  prompts,
  onNavigate,
  onSelectProject
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'actions' | 'project' | 'character' | 'genre'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const q = query.toLowerCase().trim();

  // AI Command Actions
  const commandActions = [
    { title: 'Generate Complete Sci-Fi Episode', action: () => { onNavigate('dashboard'); onClose(); }, category: 'AI Command', icon: Sparkles },
    { title: 'Open Character Bible Engine', action: () => { onNavigate('characters'); onClose(); }, category: 'Workspace', icon: Users },
    { title: 'Explore Prompt Templates', action: () => { onNavigate('templates'); onClose(); }, category: 'Templates', icon: BookOpen },
    { title: 'Go to One-Click Export Center', action: () => { onNavigate('exports'); onClose(); }, category: 'Export', icon: FolderDown },
    { title: 'Open Studio Settings & API Config', action: () => { onNavigate('settings'); onClose(); }, category: 'Settings', icon: Zap }
  ].filter(act => !q || act.title.toLowerCase().includes(q) || act.category.toLowerCase().includes(q));

  // Search filter matching Project Name, Character, Genre
  const filteredProjects = projects.filter(p => {
    const nameMatch = p.title.toLowerCase().includes(q);
    const genreMatch = p.genre?.toLowerCase().includes(q);
    const langMatch = (p.language || 'English').toLowerCase().includes(q);
    
    if (filterType === 'project') return nameMatch;
    if (filterType === 'genre') return genreMatch;

    return nameMatch || genreMatch || langMatch || p.logline?.toLowerCase().includes(q);
  });

  const filteredCharacters = characters.filter(c => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const roleMatch = c.role?.toLowerCase().includes(q);
    return nameMatch || roleMatch;
  });

  const filteredPrompts = prompts.filter(p => {
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.promptText.toLowerCase().includes(q);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Command Palette & Search" subtitle="Search projects, characters, screenplays, prompts & quick studio actions (⌘K)">
      <div className="flex flex-col gap-4">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search characters, projects, prompts... (e.g., Cyberpunk, Elena, Export)"
            className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 shadow-inner"
            autoFocus
          />
          <kbd className="absolute right-3 top-3.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Recent Searches Chips */}
        {recentSearches.length > 0 && !query && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
              <History className="w-3 h-3 text-emerald-400" /> Recent:
            </span>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'actions', label: '⚡ Commands' },
            { id: 'project', label: '🎬 Projects' },
            { id: 'character', label: '👤 Characters' },
            { id: 'genre', label: '🎭 Genres' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id as any)}
              className={`
                px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors whitespace-nowrap cursor-pointer
                ${filterType === type.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          
          {/* Quick AI Commands */}
          {(filterType === 'all' || filterType === 'actions') && commandActions.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Command className="w-3 h-3 text-amber-400" />
                <span>AI Quick Commands ({commandActions.length})</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {commandActions.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        saveSearchTerm(cmd.title);
                        cmd.action();
                      }}
                      className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{cmd.title}</p>
                          <p className="text-[10px] text-slate-400">{cmd.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {(filterType === 'all' || filterType === 'project' || filterType === 'genre') && filteredProjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Projects ({filteredProjects.length})</span>
                <span className="text-emerald-400">Match by Name, Genre, Logline</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {filteredProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      saveSearchTerm(p.title);
                      if (onSelectProject) onSelectProject(p);
                      onNavigate('dashboard');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                        <Film className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{p.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-semibold">{p.genre}</span>
                          <span>•</span>
                          <span className="text-slate-300">{p.language || 'English'}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Characters Section */}
          {(filterType === 'all' || filterType === 'character') && filteredCharacters.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Characters ({filteredCharacters.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {filteredCharacters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      saveSearchTerm(c.name);
                      onNavigate('characters');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.role} • {c.archetype}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Section */}
          {filterType === 'all' && filteredPrompts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Prompts ({filteredPrompts.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {filteredPrompts.map(pr => (
                  <div
                    key={pr.id}
                    onClick={() => {
                      saveSearchTerm(pr.title);
                      onNavigate('templates');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{pr.title}</p>
                        <p className="text-[10px] text-slate-400">{pr.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {commandActions.length === 0 && filteredProjects.length === 0 && filteredCharacters.length === 0 && filteredPrompts.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-slate-600" />
              <span>No matching commands, projects, or characters found for "{query}".</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
