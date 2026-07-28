import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  History,
  RotateCcw,
  Check,
  Sparkles,
  GitCompare,
  Clock,
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';

export interface VersionSnapshot {
  id: string;
  versionNumber: number;
  timestamp: string;
  title: string;
  genre: string;
  synopsis: string;
  sceneCount: number;
  characterCount: number;
  promptText: string;
  packageData: any;
}

interface VersionHistoryStudioProps {
  currentPackage?: any;
  onRestoreVersion: (packageData: any) => void;
}

export const VersionHistoryStudio: React.FC<VersionHistoryStudioProps> = ({
  currentPackage,
  onRestoreVersion
}) => {
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([
    {
      id: 'v-3',
      versionNumber: 3,
      timestamp: 'Today, 14:35',
      title: currentPackage?.title || 'Neo-Tokyo Cyber Heist',
      genre: currentPackage?.genre || 'Sci-Fi Cyberpunk',
      synopsis: currentPackage?.synopsis || 'High voltage cyber heist with 4-Act screenplay structure and high suspense.',
      sceneCount: currentPackage?.scenes?.length || 4,
      characterCount: currentPackage?.characters?.length || 2,
      promptText: currentPackage?.prompt || 'Sci-Fi Cyberpunk Heist in Neo Tokyo',
      packageData: currentPackage
    },
    {
      id: 'v-2',
      versionNumber: 2,
      timestamp: 'Today, 14:15',
      title: 'Neo-Tokyo Neural Incident',
      genre: 'Sci-Fi Cyberpunk',
      synopsis: 'Earlier draft focused on Dr. Kael Vance neural memory conspiracy.',
      sceneCount: 3,
      characterCount: 2,
      promptText: 'Cyberpunk memory wipe conspiracy in Neo-Tokyo',
      packageData: {
        title: 'Neo-Tokyo Neural Incident',
        genre: 'Sci-Fi Cyberpunk',
        synopsis: 'Earlier draft focused on Dr. Kael Vance neural memory conspiracy.'
      }
    },
    {
      id: 'v-1',
      versionNumber: 1,
      timestamp: 'Today, 13:50',
      title: 'Untitled Cyber Initial Pitch',
      genre: 'Sci-Fi',
      synopsis: 'Initial rough AI pitch baseline.',
      sceneCount: 2,
      characterCount: 1,
      promptText: 'Futuristic detective story',
      packageData: {
        title: 'Untitled Cyber Initial Pitch',
        genre: 'Sci-Fi',
        synopsis: 'Initial rough AI pitch baseline.'
      }
    }
  ]);

  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [restoredId, setRestoredId] = useState<string | null>(null);

  const compareVersion = snapshots.find(s => s.id === compareVersionId);

  const handleRestore = (snapshot: VersionSnapshot) => {
    onRestoreVersion(snapshot.packageData);
    setRestoredId(snapshot.id);
    setTimeout(() => setRestoredId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-indigo-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <History className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Version History & Snapshots</h1>
          </div>
          <p className="text-xs text-slate-400">
            Every AI generation or Director Copilot edit creates an immutable snapshot. Restore any previous draft or compare changes side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan">{snapshots.length} Historical Snapshots</Badge>
        </div>
      </GlassCard>

      {/* Version Snapshots List */}
      <div className="flex flex-col gap-3">
        {snapshots.map(s => {
          const isLatest = s.versionNumber === snapshots[0].versionNumber;

          return (
            <GlassCard key={s.id} className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800 hover:border-indigo-500/40 transition-all ${isLatest ? 'bg-indigo-950/20 border-indigo-500/30' : ''}`}>
              <div className="flex items-start gap-4 min-w-0">
                <div className={`p-3 rounded-2xl border font-mono font-bold text-xs shrink-0 ${isLatest ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  v{s.versionNumber}.0
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-heading truncate">{s.title}</h3>
                    {isLatest && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                        Active Workspace
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{s.synopsis}</p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {s.timestamp}
                    </span>
                    <span>•</span>
                    <span>{s.sceneCount} Scenes</span>
                    <span>•</span>
                    <span>{s.characterCount} Characters</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  onClick={() => setCompareVersionId(s.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Compare Diff</span>
                </button>

                <Button
                  onClick={() => handleRestore(s)}
                  variant={isLatest ? 'secondary' : 'primary'}
                  size="sm"
                  icon={restoredId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
                >
                  {restoredId === s.id ? 'Restored!' : 'Restore Version'}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Compare Modal */}
      {compareVersion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-3xl w-full p-6 flex flex-col gap-6 border-indigo-500/30 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <GitCompare className="w-4 h-4" />
                <span>Side-by-Side Version Comparison (Active vs v{compareVersion.versionNumber}.0)</span>
              </div>
              <button onClick={() => setCompareVersionId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-emerald-400 font-bold uppercase">Active Version</span>
                <span className="text-white font-heading text-sm font-bold">{currentPackage?.title || 'Current Active'}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{currentPackage?.synopsis}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <span className="text-indigo-400 font-bold uppercase">v{compareVersion.versionNumber}.0 ({compareVersion.timestamp})</span>
                <span className="text-white font-heading text-sm font-bold">{compareVersion.title}</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{compareVersion.synopsis}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
              <Button onClick={() => setCompareVersionId(null)} variant="secondary" size="sm">
                Close Diff
              </Button>
              <Button onClick={() => { handleRestore(compareVersion); setCompareVersionId(null); }} variant="primary" size="sm">
                Restore v{compareVersion.versionNumber}.0
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
