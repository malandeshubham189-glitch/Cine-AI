import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Badge } from '../../ui/Badge';
import {
  Users,
  GitFork,
  Heart,
  Zap,
  ShieldAlert,
  Crown,
  UserCheck,
  Sparkles,
  Search
} from 'lucide-react';
import { Character } from '../../../types';

interface Relationship {
  fromId: string;
  toId: string;
  type: 'Hero' | 'Villain' | 'Friend' | 'Family' | 'Enemy' | 'Mentor';
  description: string;
}

interface CharacterRelationshipMapProps {
  characters?: Character[];
}

export const CharacterRelationshipMap: React.FC<CharacterRelationshipMapProps> = ({ characters = [] }) => {
  const defaultChars = characters.length > 0 ? characters : [
    {
      id: 'char-1',
      name: 'Dr. Kaelen Vance',
      role: 'Protagonist (Hero)',
      archetype: 'Rogue Cyberneticist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'char-2',
      name: 'Maya-7',
      role: 'Companion (Friend)',
      archetype: 'Sentient Holographic AI',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'char-3',
      name: 'Director Thorne',
      role: 'Antagonist (Villain)',
      archetype: 'Omnicorp Security Chief',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'char-4',
      name: 'Professor Vane',
      role: 'Mentor',
      archetype: 'Former Neural Lab Director',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60'
    }
  ];

  const [relationships, setRelationships] = useState<Relationship[]>([
    { fromId: 'char-1', toId: 'char-2', type: 'Friend', description: 'Bound by shared neural key protocols and mutual survival.' },
    { fromId: 'char-1', toId: 'char-3', type: 'Enemy', description: 'Thorne ordered Kaelen’s memory wipe after the Sector 9 leak.' },
    { fromId: 'char-1', toId: 'char-4', type: 'Mentor', description: 'Vane trained Kaelen in neural encryption prior to the defection.' },
    { fromId: 'char-3', toId: 'char-2', type: 'Villain', description: 'Seeks to destroy Maya-7 to eliminate evidence.' }
  ]);

  const [selectedCharId, setSelectedCharId] = useState<string>(defaultChars[0]?.id || 'char-1');
  const [filterType, setFilterType] = useState<string>('all');

  const getBadgeColor = (type: Relationship['type']) => {
    switch (type) {
      case 'Hero': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Villain': case 'Enemy': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Friend': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Mentor': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Family': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const selectedChar = defaultChars.find(c => c.id === selectedCharId) || defaultChars[0];
  const charRelationships = relationships.filter(r => r.fromId === selectedChar.id || r.toId === selectedChar.id);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-indigo-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <GitFork className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Character Relationship Matrix</h1>
          </div>
          <p className="text-xs text-slate-400">
            Visual graph mapping dynamic psychological bonds, rivalries, alliances, and narrative conflicts derived from screenplay beats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan">{defaultChars.length} Mapped Entities</Badge>
        </div>
      </GlassCard>

      {/* Interactive Network Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character Node Carousel */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Character Node</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {defaultChars.map(char => {
              const isSelected = char.id === selectedChar.id;
              const relCount = relationships.filter(r => r.fromId === char.id || r.toId === char.id).length;

              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-xl shadow-indigo-950/40 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate">{char.name}</span>
                      <span className="text-[11px] text-indigo-400 font-mono truncate">{char.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2">
                    <span>{char.archetype}</span>
                    <span className="text-emerald-400 font-bold">{relCount} Bonds</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Connection Graph Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {selectedChar && (
            <GlassCard className="p-6 flex flex-col gap-5 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedChar.avatarUrl}
                    alt={selectedChar.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white font-heading">{selectedChar.name}</h2>
                    <span className="text-xs text-indigo-400 font-mono">{selectedChar.role} • {selectedChar.archetype}</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                  {charRelationships.length} Active Connections
                </div>
              </div>

              {/* Relationship Cards Stream */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Psychological Connections & Bonds</span>
                {charRelationships.map((rel, idx) => {
                  const targetCharId = rel.fromId === selectedChar.id ? rel.toId : rel.fromId;
                  const targetChar = defaultChars.find(c => c.id === targetCharId);

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={targetChar?.avatarUrl}
                          alt={targetChar?.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-white">{targetChar?.name}</span>
                          <span className="text-[10px] text-slate-400">{targetChar?.role}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1 flex-1 sm:max-w-xs">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getBadgeColor(rel.type)}`}>
                          {rel.type} Bond
                        </span>
                        <p className="text-[11px] text-slate-300 text-left sm:text-right leading-tight">
                          {rel.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
