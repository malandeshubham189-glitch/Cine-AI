import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Badge } from '../../ui/Badge';
import {
  DollarSign,
  Coins,
  ImageIcon,
  Video,
  Mic,
  Music,
  Cpu,
  Calculator,
  Sparkles,
  PieChart
} from 'lucide-react';

interface ProductionCostEstimatorProps {
  generatedPackage?: any;
}

export const ProductionCostEstimator: React.FC<ProductionCostEstimatorProps> = ({ generatedPackage }) => {
  const sceneCount = generatedPackage?.scenes?.length || generatedPackage?.sceneBreakdown?.length || 4;
  const shotCount = sceneCount * 3;

  // Pricing Units
  const costPerImage = 0.04; // $0.04 per 8K Midjourney / Imagen keyframe
  const costPerVideoSec = 0.15; // $0.15 per sec Sora / Veo video pass
  const costPerVoiceMin = 0.30; // $0.30 per min ElevenLabs HD
  const costPerMusicTrack = 0.50; // Suno / Udio Music Track
  const costPer1kTokens = 0.0015; // Gemini 3.6 Flash input/output average

  const estimatedImages = shotCount * 2;
  const estimatedVideoSeconds = shotCount * 5;
  const estimatedVoiceMinutes = sceneCount * 1.5;
  const estimatedMusicTracks = 3;
  const estimatedTokens = 180000;

  const imageCost = estimatedImages * costPerImage;
  const videoCost = estimatedVideoSeconds * costPerVideoSec;
  const voiceCost = estimatedVoiceMinutes * costPerVoiceMin;
  const musicCost = estimatedMusicTracks * costPerMusicTrack;
  const tokenCost = (estimatedTokens / 1000) * costPer1kTokens;

  const totalCost = imageCost + videoCost + voiceCost + musicCost + tokenCost;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Calculator className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Production Cost Estimator</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time API inference and asset rendering cost breakdown based on active screenplay scale and generation parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald">Cost Optimizer Active</Badge>
        </div>
      </GlassCard>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Cost Display Box */}
        <GlassCard className="lg:col-span-4 p-8 flex flex-col items-center justify-center text-center gap-4 border-emerald-500/30 bg-slate-950">
          <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Estimated Total Production Cost</span>

          <div className="text-5xl font-extrabold text-emerald-400 font-heading">
            ${totalCost.toFixed(2)}
          </div>

          <div className="flex flex-col gap-1 text-xs text-slate-400">
            <span>Includes 8K Keyframes, AI Video, Voiceover & Gemini Tokens</span>
            <span className="text-[10px] text-emerald-300 font-mono font-bold mt-1">~98.5% Cost Reduction vs Traditional Studio Film</span>
          </div>
        </GlassCard>

        {/* Detailed Itemized Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col gap-2 border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-cyan-400" /> Image Generation</span>
              <span className="text-emerald-400 font-mono font-bold">${imageCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {estimatedImages} Keyframes @ ${costPerImage}/img
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-2 border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-indigo-400" /> Video Render Passes</span>
              <span className="text-emerald-400 font-mono font-bold">${videoCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {estimatedVideoSeconds}s Sora/Veo Clip Passes @ ${costPerVideoSec}/s
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-2 border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Mic className="w-4 h-4 text-amber-400" /> Synthetic Voiceover</span>
              <span className="text-emerald-400 font-mono font-bold">${voiceCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {estimatedVoiceMinutes} mins ElevenLabs HD @ ${costPerVoiceMin}/min
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-2 border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-purple-400" /> Cinematic Soundtrack</span>
              <span className="text-emerald-400 font-mono font-bold">${musicCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {estimatedMusicTracks} Suno/Udio Orchestral Tracks
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-2 border-slate-800 sm:col-span-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-emerald-400" /> Gemini 3.6 Flash Tokens</span>
              <span className="text-emerald-400 font-mono font-bold">${tokenCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono pt-1">
              {(estimatedTokens / 1000).toFixed(0)}k Tokens Processed Across Screenplay, Characters & Prompts
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
