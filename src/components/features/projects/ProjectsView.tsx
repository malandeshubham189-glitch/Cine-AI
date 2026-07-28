import React, { useState } from 'react';
import { Film, Clapperboard, Play, Plus, Search, Layers, Calendar, ArrowUpRight, Copy, Trash2, Clock, Globe, Tv, Sparkles, FolderKanban } from 'lucide-react';
import { Project, Episode } from '../../../types';
import { GlassCard } from '../../ui/GlassCard';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (proj: Project) => void;
  onSelectEpisode: (ep: Episode) => void;
  onNavigateToStudio: () => void;
  onDuplicateProject?: (proj: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onSelectEpisode,
  onNavigateToStudio,
  onDuplicateProject,
  onDeleteProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.language || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.logline?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = genreFilter === 'All' || p.genre === genreFilter;

    return matchesSearch && matchesGenre;
  });

  // Recent 10 projects sorted by last modified / creation date
  const recent10Projects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-20 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-emerald-400" />
            <span>Project Management System & Recent Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete Creator Workspace. Every generated movie creates an automated Project Card.
          </p>
        </div>

        <Button
          onClick={onNavigateToStudio}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
        >
          Generate New Movie
        </Button>
      </div>

      {/* 🌟 RECENT PROJECTS SECTION (LATEST 10 PROJECTS) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-heading font-bold">Recent Projects (Latest 10)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono font-semibold">
            {recent10Projects.length} Projects Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent10Projects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            const episodeLength = proj.episodes?.[0]?.targetDurationMinutes ? `${proj.episodes[0].targetDurationMinutes} mins` : '3-5 min Reel';
            const status = proj.status || 'Completed';

            return (
              <GlassCard
                key={proj.id}
                className={`p-5 flex flex-col justify-between gap-4 border transition-all duration-300 relative group ${
                  isSelected ? 'border-emerald-500/50 bg-slate-900/90 shadow-xl' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Poster / Thumbnail Header */}
                <div className="relative w-full h-36 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  {proj.posterUrl ? (
                    <img src={proj.posterUrl} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <Film className="w-8 h-8 text-emerald-400/80" />
                      <span className="text-[11px] font-bold text-slate-300 font-heading line-clamp-1">{proj.title}</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    {status}
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold">
                    {proj.genre}
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-heading font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.logline || 'Complete AI Movie Production Package generated via CineAI CreatorOS.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{proj.language || 'English'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Tv className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{proj.platform || 'YouTube Shorts'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{episodeLength}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{proj.createdAt ? proj.createdAt.substring(0, 10) : '2026-07-27'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onNavigateToStudio();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open</span>
                  </button>

                  <button
                    onClick={() => onDuplicateProject && onDuplicateProject(proj)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject && onDeleteProject(proj.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 🔍 ALL PROJECTS FILTER & GRID */}
      <div className="flex flex-col gap-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Film className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-heading font-bold">All Studio Movie Projects</h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Project Name, Genre..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            const episodeLength = proj.episodes?.[0]?.targetDurationMinutes ? `${proj.episodes[0].targetDurationMinutes} mins` : '3-5 min Reel';

            return (
              <GlassCard
                key={proj.id}
                className={`p-5 flex flex-col justify-between gap-4 border transition-all duration-300 ${
                  isSelected ? 'border-emerald-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="emerald">{proj.genre}</Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {proj.episodes?.length || 1} Episodes
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-white mt-1 line-clamp-1">{proj.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{proj.logline}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-1">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">LANGUAGE</span>
                      <span className="text-slate-200 font-bold">{proj.language || 'English'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">PLATFORM</span>
                      <span className="text-slate-200 font-bold">{proj.platform || 'YouTube Shorts'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">EPISODE LENGTH</span>
                      <span className="text-slate-200 font-bold">{episodeLength}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">STATUS</span>
                      <span className="text-emerald-400 font-bold">{proj.status || 'Completed'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onNavigateToStudio();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open Project</span>
                  </button>

                  <button
                    onClick={() => onDuplicateProject && onDuplicateProject(proj)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject && onDeleteProject(proj.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
