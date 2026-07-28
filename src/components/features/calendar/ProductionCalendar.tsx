import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Film,
  Video,
  Mic,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Shooting' | 'Release' | 'Content' | 'Post-Production' | 'AI Render';
  date: string;
  time: string;
  assignee: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

interface ProductionCalendarProps {
  generatedPackage?: any;
}

export const ProductionCalendar: React.FC<ProductionCalendarProps> = ({ generatedPackage }) => {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: `Shooting Act 1: ${generatedPackage?.title || 'Neo-Tokyo Key Scene'}`,
      type: 'Shooting',
      date: '2026-08-02',
      time: '09:00 AM',
      assignee: 'SHUBHAM MALANDE (Director)',
      status: 'In Progress'
    },
    {
      id: 'e2',
      title: 'AI Anamorphic Keyframe Render Pass',
      type: 'AI Render',
      date: '2026-08-05',
      time: '02:00 PM',
      assignee: 'Lead Prompt Engineer',
      status: 'Scheduled'
    },
    {
      id: 'e3',
      title: 'ElevenLabs Voiceover Dubbing Session',
      type: 'Post-Production',
      date: '2026-08-10',
      time: '11:00 AM',
      assignee: 'Voice Artist',
      status: 'Scheduled'
    },
    {
      id: 'e4',
      title: 'Teaser Trailer YouTube & Social Premiere',
      type: 'Release',
      date: '2026-08-18',
      time: '06:00 PM',
      assignee: 'Marketing Editor',
      status: 'Scheduled'
    },
    {
      id: 'e5',
      title: 'Full Movie Theatrical / OTT Stream Launch',
      type: 'Release',
      date: '2026-08-28',
      time: '08:00 PM',
      assignee: 'Executive Producer',
      status: 'Scheduled'
    }
  ]);

  const [filterType, setFilterType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-08-15');

  const handleAddEvent = () => {
    if (!newTitle.trim()) return;
    const evt: CalendarEvent = {
      id: `e-${Date.now()}`,
      title: newTitle,
      type: 'Content',
      date: newDate,
      time: '10:00 AM',
      assignee: 'Director Copilot',
      status: 'Scheduled'
    };
    setEvents(prev => [...prev, evt]);
    setNewTitle('');
    setShowAddModal(false);
  };

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Shooting': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Release': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'AI Render': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Post-Production': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  const filteredEvents = events.filter(e => filterType === 'All' || e.type === filterType);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <CalendarIcon className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Production Calendar & Release Planner</h1>
          </div>
          <p className="text-xs text-slate-400">
            Schedule shooting days, AI render passes, voice dubbing sessions, and premiere release milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="emerald"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Milestone
          </Button>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {['All', 'Shooting', 'Release', 'AI Render', 'Post-Production', 'Content'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              filterType === t
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-lg'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Calendar Grid & Schedule Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Events Schedule Stream */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Production Timeline Milestones</span>

          {filteredEvents.map(evt => (
            <GlassCard key={evt.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-w-[64px] font-mono text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{evt.date.split('-')[1] === '08' ? 'AUG' : 'SEP'}</span>
                  <span className="text-lg font-bold text-emerald-400">{evt.date.split('-')[2]}</span>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase font-mono ${getEventBadge(evt.type)}`}>
                      {evt.type}
                    </span>
                    <span className="text-xs font-bold text-white font-heading truncate">{evt.title}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {evt.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {evt.assignee}
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0">
                <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {evt.status}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Right Column: Month Mini Calendar Grid */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <GlassCard className="p-5 flex flex-col gap-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white font-heading">{currentMonth}</span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-slate-500 font-bold">
              <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const dayStr = day < 10 ? `0${day}` : `${day}`;
                const hasEvent = events.some(e => e.date === `2026-08-${dayStr}`);
                return (
                  <div
                    key={day}
                    className={`p-2 rounded-xl transition-all ${
                      hasEvent
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                        : 'bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 border-emerald-500/30">
            <h3 className="text-base font-bold text-white font-heading">Add Production Milestone</h3>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Milestone Title..."
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setShowAddModal(false)} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleAddEvent} variant="emerald" size="sm">Save Milestone</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
