import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import {
  Film,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Clock,
  MapPin,
  Play
} from 'lucide-react';

export interface TimelineScene {
  sceneNumber: number;
  heading: string;
  synopsis?: string;
  visualDescription?: string;
  characters?: string[];
  mood?: string;
  lighting?: string;
  cameraShot?: string;
  estDuration?: string;
}

interface MovieTimelineEditorProps {
  generatedPackage: any;
  onUpdatePackage: (pkg: any) => void;
}

export const MovieTimelineEditor: React.FC<MovieTimelineEditorProps> = ({
  generatedPackage,
  onUpdatePackage
}) => {
  const scenes: TimelineScene[] = generatedPackage?.sceneBreakdown || generatedPackage?.scenes || [
    {
      sceneNumber: 1,
      heading: 'INT. CYBERNETIC ARCHIVE - NIGHT',
      synopsis: 'Dr. Kael penetrates the vault core under neon strobe flashes.',
      visualDescription: 'Volumetric blue fog with cyan reflections.',
      characters: ['Dr. Kael', 'AI Synthetic Maya'],
      mood: 'Tense / Suspenseful',
      estDuration: '1m 30s'
    },
    {
      sceneNumber: 2,
      heading: 'EXT. NEO-TOKYO BOULEVARD - DAY',
      synopsis: 'Kael escapes into the overcrowded rainy marketplace.',
      visualDescription: 'Drone sweep revealing towering cyber metropolis.',
      characters: ['Dr. Kael', 'Street Vendor'],
      mood: 'Urgent Chaos',
      estDuration: '2m 10s'
    }
  ];

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const newScenes = [...scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newScenes.length) return;

    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    const renumbered = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdatePackage({ ...generatedPackage, scenes: renumbered, sceneBreakdown: renumbered });
  };

  const handleDeleteScene = (index: number) => {
    const newScenes = scenes.filter((_, i) => i !== index).map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdatePackage({ ...generatedPackage, scenes: newScenes, sceneBreakdown: renumbered(newScenes) });
  };

  const handleDuplicateScene = (index: number) => {
    const original = scenes[index];
    const dup: TimelineScene = {
      ...original,
      sceneNumber: original.sceneNumber + 1,
      heading: `${original.heading} (COPY)`
    };

    const newScenes = [...scenes];
    newScenes.splice(index + 1, 0, dup);
    const renumberedList = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdatePackage({ ...generatedPackage, scenes: renumberedList, sceneBreakdown: renumberedList });
  };

  const handleInsertScene = (index: number) => {
    const newScene: TimelineScene = {
      sceneNumber: index + 2,
      heading: 'INT. NEW AI SCENE - DAY',
      synopsis: 'A newly inserted cinematic moment expanding narrative suspense.',
      visualDescription: 'Cinematic wide shot with moody volumetric light beams.',
      characters: ['Dr. Kaelen Vance'],
      mood: 'Suspenseful',
      lighting: 'Chiaroscuro',
      cameraShot: 'Wide Slow Dolly In',
      estDuration: '1m 15s'
    };

    const newScenes = [...scenes];
    newScenes.splice(index + 1, 0, newScene);
    const renumberedList = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdatePackage({ ...generatedPackage, scenes: renumberedList, sceneBreakdown: renumberedList });
  };

  function renumbered(list: TimelineScene[]) {
    return list.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Film className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Movie Timeline Editor</h1>
          </div>
          <p className="text-xs text-slate-400">
            Non-linear movie timeline. Reorder acts, insert new scenes, duplicate, or delete scenes with real-time package updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="emerald"
            size="sm"
            icon={Plus}
            onClick={() => handleInsertScene(scenes.length - 1)}
          >
            Insert Scene
          </Button>
        </div>
      </GlassCard>

      {/* Act Sequence Timeline Stream */}
      <div className="flex flex-col gap-4">
        {scenes.map((scene, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl hover:border-emerald-500/30 transition-all group"
          >
            {/* Left: Sequence Number & Details */}
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/30 shrink-0 font-mono">
                <span className="text-[10px] text-slate-500 font-bold uppercase">SCENE</span>
                <span className="text-lg font-bold text-emerald-400">#{scene.sceneNumber || idx + 1}</span>
              </div>

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">{scene.heading}</span>
                  {scene.estDuration && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {scene.estDuration}
                    </span>
                  )}
                  {scene.mood && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                      {scene.mood}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {scene.synopsis || scene.visualDescription}
                </p>

                {scene.characters && scene.characters.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                    <span className="text-slate-500">CAST:</span>
                    <span>{scene.characters.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reorder & Action Controls */}
            <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => handleMoveScene(idx, 'up')}
                disabled={idx === 0}
                className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Move Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleMoveScene(idx, 'down')}
                disabled={idx === scenes.length - 1}
                className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Move Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDuplicateScene(idx)}
                className="p-2 rounded-lg bg-slate-900 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                title="Duplicate Scene"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleInsertScene(idx)}
                className="p-2 rounded-lg bg-slate-900 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                title="Insert Scene Below"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteScene(idx)}
                className="p-2 rounded-lg bg-slate-900 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                title="Delete Scene"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
