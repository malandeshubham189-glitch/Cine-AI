import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Users, Plus, Sparkles, Mic, Wand2, ArrowRight } from 'lucide-react';
import { Character } from '../../../types';
import { generateCharacterBioAI } from '../../../services/api';

interface CharacterLibraryViewProps {
  characters: Character[];
  onSaveCharacter: (char: Character) => void;
}

export const CharacterLibraryView: React.FC<CharacterLibraryViewProps> = ({
  characters,
  onSaveCharacter
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Protagonist' | 'Antagonist' | 'Supporting' | 'Cameo'>('Protagonist');
  const [concept, setConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const handleGenerateCharacter = async () => {
    setIsGenerating(true);
    const res = await generateCharacterBioAI({
      name: name || 'Valerie Vance',
      role,
      concept: concept || 'High-level network architect fighting corporate hegemony',
      genre: 'Sci-Fi Cyberpunk'
    });
    setIsGenerating(false);

    if (res.success && res.character) {
      const newChar: Character = {
        id: `char-${Date.now()}`,
        name: res.character.name || name || 'Valerie Vance',
        role: res.character.role || role,
        archetype: res.character.archetype || 'Network Architect',
        bio: res.character.bio || 'Synthesized character biography...',
        traits: res.character.traits || ['Resilient', 'Strategic', 'Guarded'],
        voiceStyle: res.character.voiceStyle || 'Low, deliberate cadence.',
        visualPromptAnchor: res.character.visualPromptAnchor || 'Cinematic portrait 35mm.',
        avatarUrl: `https://images.unsplash.com/photo-${1500648767791 + (characters.length * 1000)}?auto=format&fit=crop&w=300&q=80`,
        relationships: [],
        episodesCount: 1
      };

      onSaveCharacter(newChar);
      setIsModalOpen(false);
      setName('');
      setConcept('');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-cyan-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Users className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Character Bible & Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Architect, manage, and anchor AI visual avatars and voice profiles across production episodes.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="secondary" icon={<Plus className="w-4 h-4" />}>
          Create Character with AI
        </Button>
      </GlassCard>

      {/* Grid of Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((c) => (
          <GlassCard
            key={c.id}
            hoverEffect
            onClick={() => setSelectedChar(c)}
            className="p-5 flex flex-col gap-4 border-slate-800 hover:border-cyan-500/40"
          >
            <div className="flex items-center gap-4">
              <img
                src={c.avatarUrl}
                alt={c.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-heading font-bold text-white">{c.name}</h3>
                  <Badge variant={c.role === 'Protagonist' ? 'emerald' : c.role === 'Antagonist' ? 'rose' : 'cyan'}>
                    {c.role}
                  </Badge>
                </div>
                <span className="text-xs text-cyan-300 font-mono">{c.archetype}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{c.bio}</p>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
              {c.traits?.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                  {t}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{c.voiceStyle}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Character Creator Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="AI Character Architect" subtitle="Generate bios, voice styles & visual anchors using Gemini 3.6 Flash">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Character Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Valerie Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Dramatic Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Protagonist">Protagonist</option>
                <option value="Antagonist">Antagonist</option>
                <option value="Supporting">Supporting</option>
                <option value="Cameo">Cameo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Concept & Flaws</label>
            <textarea
              rows={3}
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Describe character motivation, back-story, secret flaw..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          <Button
            onClick={handleGenerateCharacter}
            isLoading={isGenerating}
            variant="secondary"
            className="mt-2"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Synthesize Character Profile
          </Button>
        </div>
      </Modal>

      {/* Character Inspect Drawer Modal */}
      {selectedChar && (
        <Modal isOpen={!!selectedChar} onClose={() => setSelectedChar(null)} title={selectedChar.name} subtitle={selectedChar.archetype}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src={selectedChar.avatarUrl} alt={selectedChar.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-500" />
              <div>
                <Badge variant="cyan">{selectedChar.role}</Badge>
                <p className="text-xs text-slate-300 mt-2">{selectedChar.bio}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 text-xs">
              <span className="font-bold text-cyan-400">Visual Prompt Anchor:</span>
              <p className="font-mono text-[11px] text-slate-300 leading-relaxed">{selectedChar.visualPromptAnchor}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
