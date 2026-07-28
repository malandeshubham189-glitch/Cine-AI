import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Users,
  UserCheck,
  Shield,
  Crown,
  PenTool,
  Wand2,
  Film,
  Mic,
  CheckCircle2,
  Clock,
  Plus,
  Mail,
  MoreVertical
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Director' | 'Writer' | 'Prompt Engineer' | 'Editor' | 'Voice Artist';
  avatarUrl: string;
  status: 'Active' | 'Reviewing' | 'Offline';
  task: string;
  assignedBeats: string;
}

export const TeamWorkspace: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'm1',
      name: 'SHUBHAM MALANDE',
      role: 'Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
      status: 'Active',
      task: 'Finalizing Act 3 Director Cut & Gemini Prompts',
      assignedBeats: 'Act 1 - Act 4 Master Script'
    },
    {
      id: 'm2',
      name: 'Sarah Connor',
      role: 'Writer',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
      status: 'Active',
      task: 'Polishing Dr. Kael Vance dialogue subtext',
      assignedBeats: 'Scene 2 & Scene 4 Monologue'
    },
    {
      id: 'm3',
      name: 'Alex Vance',
      role: 'Prompt Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
      status: 'Reviewing',
      task: 'Optimizing 35mm Midjourney camera seeds',
      assignedBeats: 'Keyframe Shot Generator'
    },
    {
      id: 'm4',
      name: 'Elena Rostova',
      role: 'Editor',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60',
      status: 'Active',
      task: 'Timeline Assembly & Non-Linear Cut',
      assignedBeats: 'Timeline Sequencer'
    },
    {
      id: 'm5',
      name: 'David Mercer',
      role: 'Voice Artist',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60',
      status: 'Offline',
      task: 'Recorded ElevenLabs AI Synthetic Master Voice',
      assignedBeats: 'Voiceover Dub Track'
    }
  ]);

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'Director': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'Writer': return <PenTool className="w-4 h-4 text-cyan-400" />;
      case 'Prompt Engineer': return <Wand2 className="w-4 h-4 text-emerald-400" />;
      case 'Editor': return <Film className="w-4 h-4 text-purple-400" />;
      case 'Voice Artist': return <Mic className="w-4 h-4 text-rose-400" />;
    }
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Reviewing': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-cyan-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Users className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Team Workspace & Collaboration</h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage roles (Director, Writer, Prompt Engineer, Editor, Voice Artist) and track real-time task progress across the crew.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan">{members.length} Crew Members Active</Badge>
        </div>
      </GlassCard>

      {/* Crew Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(m => (
          <GlassCard key={m.id} className="p-5 flex flex-col gap-4 border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={m.avatarUrl} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md" />
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white font-heading">{m.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                    {getRoleIcon(m.role)}
                    <span>{m.role}</span>
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase font-mono ${getStatusBadge(m.status)}`}>
                {m.status}
              </span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Active Task</span>
                <p className="text-slate-200 font-medium leading-relaxed mt-0.5">{m.task}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="text-slate-500">ASSIGNED SCOPE:</span>
                <span className="text-cyan-300 font-bold">{m.assignedBeats}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
