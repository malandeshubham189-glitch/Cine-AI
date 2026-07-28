import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  BookOpen,
  Image as ImageIcon,
  Video,
  Mic,
  Music,
  ShieldAlert,
  History,
  Save,
  RefreshCw,
  Crown
} from 'lucide-react';

interface PromptEngineeringStudioProps {
  generatedPackage?: any;
  onUpdatePackage?: (updatedPackage: any) => void;
}

export const PromptEngineeringStudio: React.FC<PromptEngineeringStudioProps> = ({
  generatedPackage,
  onUpdatePackage
}) => {
  const [activeTab, setActiveTab] = useState<'master' | 'image' | 'video' | 'voice' | 'music' | 'negative'>('master');

  const [prompts, setPrompts] = useState({
    master: generatedPackage?.characterConsistencyPrompt || generatedPackage?.synopsis || 'MASTER CINEMATIC PROMPT: Cyberpunk neo-noir thriller, 35mm anamorphic prime lens, high contrast volumetric neon lighting, 8k resolution master work.',
    image: generatedPackage?.imagePrompts?.[0] || '8K photorealistic cinematic shot, 35mm anamorphic lens, cybernetics, neon cyan highlights, wet asphalt reflections, volumetric fog, dark sci-fi thriller',
    video: generatedPackage?.videoPrompts?.[0] || 'Slow dolly zoom into cyberpunk protagonist eye lens, high motion vector stability, 60fps cinematic 4K render',
    voice: generatedPackage?.voiceScript || '[GRAVELLY BARITONE] Dr. Kaelen Vance: "They thought wiping our memories would stop us. They forgot muscle memory never fades."',
    music: generatedPackage?.musicPrompts?.[0] || 'Dark synthwave score, Hans Zimmer style pounding percussion, low brass drones, rising suspense arpeggios',
    negative: 'blurry, low resolution, bad lighting, disfigured faces, extra fingers, noisy grain, watermark, amateur 3d'
  });

  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [savedVersions, setSavedVersions] = useState<Array<{ id: string; category: string; text: string; time: string }>>([
    { id: 'v1', category: 'master', text: 'Master 8K Midjourney v6 Anamorphic Lens Prompt', time: '10 mins ago' }
  ]);

  const handleCopy = (text: string, tabKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleImproveWithAI = async () => {
    setIsImproving(true);
    const currentText = prompts[activeTab];

    try {
      const updatedText = `${currentText}, masterpiece, award-winning cinematography, ultra-detailed textures, studio lighting, --ar 16:9 --v 6.0 --style raw`;
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPrompts(prev => ({ ...prev, [activeTab]: updatedText }));

      setSavedVersions(prev => [
        {
          id: Date.now().toString(),
          category: activeTab,
          text: updatedText,
          time: 'Just now'
        },
        ...prev
      ]);
    } finally {
      setIsImproving(false);
    }
  };

  const handleSaveVersion = () => {
    setSavedVersions(prev => [
      {
        id: Date.now().toString(),
        category: activeTab,
        text: prompts[activeTab],
        time: 'Just now'
      },
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Wand2 className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Prompt Lab</h1>
          </div>
          <p className="text-xs text-slate-400">
            Centralized prompt editing studio for Master, Image, Video, Voice, Music, and Negative prompts with real-time AI optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="amber">AI Prompt Lab Active</Badge>
        </div>
      </GlassCard>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'master', label: 'Master Prompt', icon: Crown },
          { id: 'image', label: 'Image Prompt', icon: ImageIcon },
          { id: 'video', label: 'Video Prompt', icon: Video },
          { id: 'voice', label: 'Voice Prompt', icon: Mic },
          { id: 'music', label: 'Music Prompt', icon: Music },
          { id: 'negative', label: 'Negative Prompt', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border
                ${isActive
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor & Versions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Box */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <GlassCard className="p-6 flex flex-col gap-4 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Active {activeTab.toUpperCase()} Prompt
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveVersion}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Version</span>
                </button>

                <button
                  onClick={() => handleCopy(prompts[activeTab], activeTab)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTab === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === activeTab ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={prompts[activeTab]}
              onChange={e => setPrompts({ ...prompts, [activeTab]: e.target.value })}
              rows={8}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-500/50 transition-colors"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-500 font-mono">
                {prompts[activeTab].length} characters • Editable in real-time
              </span>

              <button
                onClick={handleImproveWithAI}
                disabled={isImproving}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {isImproving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                <span>Improve Prompt with AI</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Saved Prompt Versions Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" />
            Prompt Version Snapshots
          </span>

          <div className="flex flex-col gap-2">
            {savedVersions.map(ver => (
              <GlassCard key={ver.id} className="p-3.5 flex flex-col gap-2 border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-400 uppercase font-bold">{ver.category}</span>
                  <span className="text-slate-500">{ver.time}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono line-clamp-2">{ver.text}</p>
                <button
                  onClick={() => setPrompts({ ...prompts, [ver.category as any]: ver.text })}
                  className="text-[10px] text-amber-400 hover:underline font-bold self-end cursor-pointer"
                >
                  Restore Version →
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
