import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Camera,
  Sparkles,
  Sun,
  Moon,
  Copy,
  Check,
  Compass,
  Zap,
  Volume2,
  Clock,
  MapPin,
  Sliders,
  Maximize2
} from 'lucide-react';
import { generateShotVisualAI } from '../../../services/api';

interface StoryboardViewerProps {
  generatedPackage: any;
  onUpdatePackage?: (updatedPackage: any) => void;
}

export const StoryboardViewer: React.FC<StoryboardViewerProps> = ({
  generatedPackage,
  onUpdatePackage
}) => {
  const [renderingShotId, setRenderingShotId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'night'>('all');
  const [copiedShotId, setCopiedShotId] = useState<string | null>(null);

  const scenes = generatedPackage?.scenes || [
    {
      id: 'sc-1',
      sceneNumber: 1,
      heading: 'INT. CYBERNETIC ARCHIVE - NIGHT',
      summary: 'Dr. Kael penetrates the vault core under neon strobe flashes.',
      location: 'Sub-level 4 Vault Core',
      charactersInScene: ['Dr. Kael', 'AI Synthetic Maya'],
      shots: [
        {
          id: 'st-1',
          shotNumber: 1,
          cameraAngle: 'Low Angle 45°',
          lens: '35mm Anamorphic Prime',
          cameraMovement: 'Slow Tracking Pan Right',
          lighting: 'Cyan & Violet High Contrast',
          mood: 'Tense / Mysterious',
          dialogue: 'KAEL: "The encryption isn\'t organic... it\'s learning."',
          durationSeconds: 6,
          location: 'Vault Entrance Port',
          aiRenderPrompt: 'Low angle shot of cybernetic hacker, neon lit servers, anamorphic lens flare, cinematic 8k',
          imagePreviewUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60'
        },
        {
          id: 'st-2',
          shotNumber: 2,
          cameraAngle: 'Extreme Close-Up',
          lens: '85mm Macro Cine Lens',
          cameraMovement: 'Static Whip Focus',
          lighting: 'Harsh Rim Light',
          mood: 'Suspenseful',
          dialogue: 'MAYA: "Access granted. 30 seconds before thermal purge."',
          durationSeconds: 4,
          location: 'Terminal Interface',
          aiRenderPrompt: 'Extreme close up of cybernetic ocular implant focusing, matrix code reflection in pupil'
        }
      ]
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      heading: 'EXT. NEO-TOKYO BOULEVARD - DAY',
      summary: 'Kael escapes into the overcrowded rainy marketplace.',
      location: 'District 9 Rain Market',
      charactersInScene: ['Dr. Kael', 'Street Vendor'],
      shots: [
        {
          id: 'st-3',
          shotNumber: 1,
          cameraAngle: 'High Overhead Crane',
          lens: '24mm Ultra Wide Angle',
          cameraMovement: 'Crane Down & Push In',
          lighting: 'Diffused Overcast Sunlight',
          mood: 'Urgent / Chaos',
          dialogue: '(Ambient Marketplace Commotion & Siren Echoes)',
          durationSeconds: 8,
          location: 'Crowded Alleyway',
          aiRenderPrompt: 'High angle drone shot of rain slicked cyber city market, holographic neon signs, dense crowd'
        }
      ]
    }
  ];

  const handleCopyPrompt = (promptText: string, shotId: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedShotId(shotId);
    setTimeout(() => setCopiedShotId(null), 2000);
  };

  const handleRenderVisual = async (sceneId: string, shotId: string, promptText: string) => {
    setRenderingShotId(shotId);
    const res = await generateShotVisualAI({ promptText, aspectRatio: '16:9' });
    setRenderingShotId(null);

    if (res.success && res.imageUrl && onUpdatePackage && generatedPackage) {
      const updatedScenes = scenes.map((sc: any) => {
        if (sc.id === sceneId || sc.sceneNumber.toString() === sceneId) {
          const updatedShots = (sc.shots || []).map((s: any) =>
            s.id === shotId ? { ...s, imagePreviewUrl: res.imageUrl } : s
          );
          return { ...sc, shots: updatedShots };
        }
        return sc;
      });

      onUpdatePackage({ ...generatedPackage, scenes: updatedScenes });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-cyan-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Camera className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Cinematic Storyboard Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Shot-by-shot production storyboard with lens specs, camera movement, lighting mood, line cue, location, and AI visual rendering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Scenes
          </button>
          <button
            onClick={() => setFilterMode('night')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'night' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            Night Shots
          </button>
          <button
            onClick={() => setFilterMode('day')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'day' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Day Shots
          </button>
        </div>
      </GlassCard>

      {/* Storyboard Scene Stream */}
      <div className="flex flex-col gap-8">
        {scenes.map((scene: any) => {
          const isNight = scene.heading.includes('NIGHT');
          if (filterMode === 'night' && !isNight) return null;
          if (filterMode === 'day' && isNight) return null;

          return (
            <div key={scene.id || scene.sceneNumber} className="flex flex-col gap-4">
              {/* Scene Header Strip */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs">
                    SCENE #{scene.sceneNumber}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-sm font-bold text-white font-mono">{scene.heading}</h2>
                    <p className="text-xs text-slate-400">{scene.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {scene.location || 'Main Location Set'}
                  </span>
                </div>
              </div>

              {/* Storyboard Shots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {(scene.shots || []).map((shot: any) => (
                  <GlassCard key={shot.id} className="p-5 flex flex-col gap-4 border-slate-800 hover:border-cyan-500/30 transition-all shadow-xl">
                    {/* Shot Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
                          SHOT #{shot.shotNumber}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{shot.cameraAngle || 'Eye-Level'}</span>
                      </div>
                      <Badge variant="cyan">{shot.lens || '35mm Cine Prime'}</Badge>
                    </div>

                    {/* Image Thumbnail Box */}
                    <div className="relative w-full h-52 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden group shadow-inner">
                      {shot.imagePreviewUrl ? (
                        <img src={shot.imagePreviewUrl} alt="Shot visual keyframe" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2 bg-gradient-to-br from-slate-950 to-slate-900">
                          <Camera className="w-8 h-8 text-cyan-500/40 animate-pulse" />
                          <span className="text-xs text-slate-400 font-mono">Keyframe Render Ready</span>
                          <span className="text-[10px] text-slate-500 max-w-xs">{shot.aiRenderPrompt}</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2">
                        <Button
                          onClick={() => handleRenderVisual(scene.id || scene.sceneNumber, shot.id, shot.aiRenderPrompt)}
                          isLoading={renderingShotId === shot.id}
                          variant="emerald"
                          size="sm"
                          icon={<Sparkles className="w-3.5 h-3.5" />}
                        >
                          {shot.imagePreviewUrl ? 'Re-render Shot Frame' : 'Generate Visual Keyframe'}
                        </Button>
                      </div>
                    </div>

                    {/* V8 Shot Specification Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase">Movement</span>
                        <span className="text-slate-200">{shot.cameraMovement || 'Dolly Track'}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase">Lighting</span>
                        <span className="text-slate-200">{shot.lighting || shot.lightingTone || 'Chiaroscuro'}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase">Mood</span>
                        <span className="text-cyan-400 font-bold">{shot.mood || 'High Tension'}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-bold block text-[9px] uppercase">Duration & Location</span>
                        <span className="text-emerald-400 font-bold">{shot.durationSeconds || 5}s • {shot.location || scene.location || 'Set'}</span>
                      </div>
                    </div>

                    {/* Dialogue Line Box */}
                    {shot.dialogue && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Line Cue / Dialogue:</span>
                        <p className="text-xs text-slate-200 italic font-serif leading-relaxed">{shot.dialogue}</p>
                      </div>
                    )}

                    {/* Copy AI Prompt Bar */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">AI Generation Prompt</span>
                        <p className="text-[10px] text-slate-400 truncate font-mono">{shot.aiRenderPrompt}</p>
                      </div>

                      <button
                        onClick={() => handleCopyPrompt(shot.aiRenderPrompt, shot.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                      >
                        {copiedShotId === shot.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedShotId === shot.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
