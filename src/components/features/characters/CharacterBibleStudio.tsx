import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Sparkles,
  Mic,
  Shirt,
  Heart,
  Smile,
  Plus,
  Trash2,
  Edit,
  Upload,
  Check,
  Copy,
  Sliders
} from 'lucide-react';
import { Character } from '../../../types';

interface CharacterBibleStudioProps {
  characters?: Character[];
  onUpdateCharacters?: (updated: Character[]) => void;
}

export const CharacterBibleStudio: React.FC<CharacterBibleStudioProps> = ({
  characters = [],
  onUpdateCharacters
}) => {
  const defaultCharacters: (Character & {
    age?: string;
    wardrobe?: string;
    consistencyLock?: boolean;
    negativePrompt?: string;
    referenceImages?: string[];
  })[] = characters.length > 0
    ? characters.map(c => ({
        ...c,
        age: (c as any).age || '34 years old',
        wardrobe: (c as any).wardrobe || 'Tactical high-collar duster jacket, cybernetic mesh suit with neon cyan conduits',
        consistencyLock: (c as any).consistencyLock ?? true,
        negativePrompt: (c as any).negativePrompt || 'blur, low quality, duplicate faces, cartoonish proportions, extra limbs',
        referenceImages: (c as any).referenceImages || [c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60']
      }))
    : [
        {
          id: 'char-1',
          name: 'Dr. Kaelen Vance',
          role: 'Protagonist',
          archetype: 'Weathered Cyberneticist',
          age: '42 years old',
          bio: 'Former chief neural engineer for Omnicorp, Vance defected after discovering the neural wipe protocol.',
          traits: ['Relentless', 'Analytical', 'Haunted by guilt', 'Tactical'],
          voiceStyle: 'Deep gravelly baritone, calm under extreme pressure, faint Scandinavian accent',
          visualPromptAnchor: '42 year old male neural engineer, sharp jawline, silver-streaked hair, intense dark brown eyes, subtle cybernetic temple implant, 35mm portrait lighting',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
          wardrobe: 'High-collar reinforced obsidian trench coat, dark tactical turtleneck, exposed neural interface cuff on right wrist',
          consistencyLock: true,
          negativePrompt: 'blurry, cartoon, 3d render, anime, smooth skin, deformed face, missing eye',
          referenceImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60'],
          relationships: [{ characterId: 'char-2', relation: 'Former Neural Assistant / AI Companion' }],
          episodesCount: 12
        },
        {
          id: 'char-2',
          name: 'Maya-7',
          role: 'Supporting',
          archetype: 'Sentient Holographic AI',
          age: 'Ageless (Appearance ~ 26)',
          bio: 'A rogue artificial intelligence projection trapped in Kaelen’s portable deck unit.',
          traits: ['Enigmatic', 'Hyper-intelligent', 'Dry humor', 'Protective'],
          voiceStyle: 'Clear melodious alto, precise pacing, soft reverberating metallic delay',
          visualPromptAnchor: 'Female holographic entity with translucent shimmering cyan skin, illuminated geometric tattoos, luminescent blue eyes',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
          wardrobe: 'Fluid light-fiber cloak that ripples with code matrices',
          consistencyLock: true,
          negativePrompt: 'opaque skin, muddy colors, ugly features, broken fingers',
          referenceImages: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60'],
          relationships: [{ characterId: 'char-1', relation: 'Protective Partner' }],
          episodesCount: 12
        }
      ];

  const [charList, setCharList] = useState(defaultCharacters);
  const [selectedCharId, setSelectedCharId] = useState<string>(charList[0]?.id || 'char-1');
  const [copiedAnchorId, setCopiedAnchorId] = useState<string | null>(null);

  const activeChar = charList.find(c => c.id === selectedCharId) || charList[0];

  const handleToggleLock = (id: string) => {
    setCharList(prev => prev.map(c => c.id === id ? { ...c, consistencyLock: !c.consistencyLock } : c));
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnchorId(id);
    setTimeout(() => setCopiedAnchorId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Users className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Master Character Bible Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Define character visual anchors, wardrobe, voice profiles, facial consistency locks, and negative prompts for Midjourney v6 & Imagen 3 rendering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber">{charList.length} Active Cast Members</Badge>
        </div>
      </GlassCard>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character List */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Ensemble Cast</span>
          <div className="flex flex-col gap-2">
            {charList.map(char => {
              const isSelected = char.id === activeChar.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-xl shadow-amber-950/30 scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate">{char.name}</span>
                      <span className="text-[11px] text-amber-400/90 font-medium">{char.role} • {char.archetype}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {char.consistencyLock ? (
                      <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono flex items-center gap-1" title="Facial Consistency Locked">
                        <Lock className="w-3 h-3" />
                        <span className="hidden sm:inline">Locked</span>
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-slate-800 text-slate-500 text-[10px] font-mono" title="Unlocked">
                        <Unlock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Character Master Card */}
        {activeChar && (
          <div className="lg:col-span-8 flex flex-col gap-6">
            <GlassCard className="p-6 flex flex-col gap-6 border-slate-800">
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={activeChar.avatarUrl}
                    alt={activeChar.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-2xl"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white font-heading">{activeChar.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs">
                        {activeChar.role}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{activeChar.archetype} • {activeChar.age}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleLock(activeChar.id)}
                  className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeChar.consistencyLock
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{activeChar.consistencyLock ? 'Consistency Lock Active' : 'Lock Consistency'}</span>
                </button>
              </div>

              {/* Bio & Traits */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Psychological Profile & Bio</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  {activeChar.bio}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeChar.traits.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                      • {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Anchor Prompt & Negative Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Visual Prompt Anchor
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(activeChar.visualPromptAnchor, activeChar.id)}
                      className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                    >
                      {copiedAnchorId === activeChar.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAnchorId === activeChar.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {activeChar.visualPromptAnchor}
                  </p>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Negative Render Filter
                  </span>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    {activeChar.negativePrompt}
                  </p>
                </div>
              </div>

              {/* Voice & Wardrobe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" />
                    Voice Performance Direction
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeChar.voiceStyle}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5" />
                    Wardrobe & Costume Details
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeChar.wardrobe}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
