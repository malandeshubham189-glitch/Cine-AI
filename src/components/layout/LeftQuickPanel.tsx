import React, { useState } from 'react';
import {
  Film,
  Users,
  Folder,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { Project, Character } from '../../types';

interface LeftQuickPanelProps {
  projects: Project[];
  activeProject?: Project | null;
  onSelectProject: (project: Project) => void;
  characters?: Character[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LeftQuickPanel: React.FC<LeftQuickPanelProps> = ({
  projects,
  activeProject,
  onSelectProject,
  characters = [],
  isOpen,
  onToggle,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'characters' | 'assets'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 bg-slate-950 border-r border-slate-800 shrink-0">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
          title="Expand Left Navigation Panel"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-slate-950/95 border-r border-slate-800/90 flex flex-col h-full overflow-hidden text-slate-200">
      {/* Panel Top Header */}
      <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Studio Workspace</span>
        </div>

        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950 px-2 py-1 text-xs">
        <button
          onClick={() => setActiveSubTab('projects')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeSubTab === 'projects' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>
        <button
          onClick={() => setActiveSubTab('characters')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeSubTab === 'characters' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Cast</span>
        </button>
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeSubTab === 'assets' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Assets</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder={`Filter ${activeSubTab}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">
        {activeSubTab === 'projects' && (
          <div className="flex flex-col gap-2">
            {filteredProjects.map(p => {
              const isActive = activeProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate max-w-[180px]">{p.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] font-mono text-emerald-400">
                      {p.genre}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{p.logline}</p>
                </button>
              );
            })}
          </div>
        )}

        {activeSubTab === 'characters' && (
          <div className="flex flex-col gap-2">
            {characters.map(c => (
              <div key={c.id} className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{c.name}</span>
                    <span className="text-[10px] text-emerald-400">{c.role}</span>
                  </div>
                </div>
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'assets' && (
          <div className="flex flex-col gap-2 font-mono text-xs">
            {['KeyArt_8K.png', 'Screenplay_Master.pdf', 'Audio_Voice_Act1.mp3', 'Subtitles_En.srt'].map((ast, i) => (
              <div key={i} className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="truncate text-[11px]">{ast}</span>
                <span className="text-[9px] text-emerald-400">Ready</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
