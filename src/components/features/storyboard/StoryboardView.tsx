import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Film, Camera, Sparkles, Play, Layers } from 'lucide-react';
import { Episode, Shot } from '../../../types';
import { generateShotVisualAI } from '../../../services/api';

interface StoryboardViewProps {
  activeEpisode: Episode;
  onUpdateEpisode: (updatedEp: Episode) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  activeEpisode,
  onUpdateEpisode
}) => {
  const [renderingShotId, setRenderingShotId] = useState<string | null>(null);

  const scenes = activeEpisode?.scenes || [];
  const allShots: { shot: Shot; sceneNumber: number; sceneHeading: string }[] = [];

  scenes.forEach(sc => {
    (sc.shots || []).forEach(st => {
      allShots.push({ shot: st, sceneNumber: sc.sceneNumber, sceneHeading: sc.heading });
    });
  });

  const handleRenderVisual = async (shotItem: typeof allShots[0]) => {
    setRenderingShotId(shotItem.shot.id);

    const res = await generateShotVisualAI({
      promptText: shotItem.shot.aiRenderPrompt,
      aspectRatio: '16:9'
    });

    setRenderingShotId(null);

    if (res.success && res.imageUrl) {
      const updatedScenes = scenes.map(sc => {
        if (sc.sceneNumber === shotItem.sceneNumber) {
          const updatedShots = sc.shots.map(s => s.id === shotItem.shot.id ? { ...s, imagePreviewUrl: res.imageUrl } : s);
          return { ...sc, shots: updatedShots };
        }
        return sc;
      });

      onUpdateEpisode({ ...activeEpisode, scenes: updatedScenes });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-cyan-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Film className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Visual Storyboard & Shot Sequence</h1>
          </div>
          <p className="text-xs text-slate-400">
            Sequence, preview, and generate visual keyframes for {activeEpisode?.title || 'Active Episode'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan">{allShots.length} Sequence Shots</Badge>
        </div>
      </GlassCard>

      {allShots.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <Camera className="w-10 h-10 text-slate-600" />
          <h3 className="text-base font-bold text-slate-300">No Shots Breakdown Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Generate or add camera shots inside the AI Studio to visualize your episode keyframes here.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allShots.map((item, idx) => (
            <GlassCard key={item.shot.id} className="p-5 flex flex-col justify-between gap-4 border-slate-800">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    SCENE {item.sceneNumber} • SHOT #{item.shot.shotNumber}
                  </span>
                  <Badge variant="cyan">{item.shot.cameraMovement}</Badge>
                </div>

                {/* Image Preview Box */}
                <div className="relative w-full h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group">
                  {item.shot.imagePreviewUrl ? (
                    <img src={item.shot.imagePreviewUrl} alt="Shot frame" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2">
                      <Film className="w-8 h-8 text-slate-700" />
                      <span className="text-[11px] text-slate-500 font-mono">No Storyboard Visual</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <Button
                      onClick={() => handleRenderVisual(item)}
                      isLoading={renderingShotId === item.shot.id}
                      variant="secondary"
                      size="sm"
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      {item.shot.imagePreviewUrl ? 'Re-render Frame' : 'Generate Frame'}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-200">{item.shot.shotType}</span>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.shot.description}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="text-slate-500 font-semibold">Lighting: </span>
                {item.shot.lightingTone}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
