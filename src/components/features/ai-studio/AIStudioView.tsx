import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { 
  Sparkles, 
  Film, 
  Clapperboard,
  Wand2, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Layers, 
  Camera, 
  Volume2, 
  Check, 
  ChevronRight,
  Download,
  Bot
} from 'lucide-react';
import { Project, Episode, Scene, Shot } from '../../../types';
import { runSceneAssistant, generateShotVisualAI } from '../../../services/api';

interface AIStudioViewProps {
  project: Project;
  activeEpisode: Episode;
  onUpdateEpisode: (updatedEp: Episode) => void;
  onOpenGeneratorWizard: () => void;
  onNavigate: (tab: any) => void;
}

export const AIStudioView: React.FC<AIStudioViewProps> = ({
  project,
  activeEpisode,
  onUpdateEpisode,
  onOpenGeneratorWizard,
  onNavigate
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'script' | 'shots' | 'vfx'>('script');
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiAssistantInstruction, setAiAssistantInstruction] = useState('');
  const [aiNotes, setAiNotes] = useState<string | null>(null);
  const [renderingShotId, setRenderingShotId] = useState<string | null>(null);

  const scenes = activeEpisode?.scenes || [];
  const currentScene: Scene | undefined = scenes[selectedSceneIndex];

  // Helper to save modified current scene
  const handleUpdateCurrentScene = (updatedFields: Partial<Scene>) => {
    if (!currentScene) return;
    const newScenes = [...scenes];
    newScenes[selectedSceneIndex] = { ...currentScene, ...updatedFields };
    onUpdateEpisode({ ...activeEpisode, scenes: newScenes, updatedDate: new Date().toISOString().split('T')[0] });
  };

  // Add new scene manually
  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const newScene: Scene = {
      id: `sc-new-${Date.now()}`,
      sceneNumber: newSceneNumber,
      heading: `INT. NEW LOCATION - NIGHT`,
      summary: 'Brief outline of scene action...',
      charactersInScene: [],
      scriptText: `INT. NEW LOCATION - NIGHT\n\nAction description here...\n\nCHARACTER NAME\nDialogue line here...`,
      vfxNotes: 'Visual effects notes...',
      shots: []
    };
    onUpdateEpisode({ ...activeEpisode, scenes: [...scenes, newScene] });
    setSelectedSceneIndex(scenes.length);
  };

  // Run AI Assistant (Polish / Audit / Rewrite)
  const handleRunAIAssistant = async (actionType: string) => {
    if (!currentScene) return;
    setIsAiRunning(true);
    setAiNotes(null);

    const res = await runSceneAssistant({
      actionType,
      scriptText: currentScene.scriptText,
      sceneHeading: currentScene.heading,
      instruction: aiAssistantInstruction || 'Polish dialogue rhythm, sharpen atmospheric action verbs, and intensify tension.',
      genre: activeEpisode.genre
    });

    setIsAiRunning(false);

    if (res.success && res.enhancedScript) {
      handleUpdateCurrentScene({ scriptText: res.enhancedScript });
      if (res.notes) setAiNotes(res.notes);
    }
  };

  // Add Shot to Current Scene
  const handleAddShot = () => {
    if (!currentScene) return;
    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      shotNumber: (currentScene.shots?.length || 0) + 1,
      shotType: 'Medium Shot',
      cameraMovement: 'Tracking Pan',
      description: 'Camera moves past subjects as dramatic lighting spills across background.',
      lightingTone: 'Cinematic warm rim with deep cool background shadows.',
      aiRenderPrompt: `Cinematic frame, ${currentScene.heading}, photorealistic 35mm grain, 8k.`,
      durationSeconds: 5,
      audioCues: 'Ambient room hum and footsteps.'
    };
    handleUpdateCurrentScene({ shots: [...(currentScene.shots || []), newShot] });
  };

  // Render Shot Visual Preview via Gemini Image API
  const handleRenderShotVisual = async (shot: Shot) => {
    setRenderingShotId(shot.id);
    const res = await generateShotVisualAI({ promptText: shot.aiRenderPrompt, aspectRatio: '16:9' });
    setRenderingShotId(null);

    if (res.success && res.imageUrl && currentScene) {
      const updatedShots = currentScene.shots.map(s => s.id === shot.id ? { ...s, imagePreviewUrl: res.imageUrl } : s);
      handleUpdateCurrentScene({ shots: updatedShots });
    }
  };

  if (!activeEpisode) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Clapperboard className="w-12 h-12 text-emerald-400 opacity-60" />
        <h2 className="text-xl font-heading font-bold text-white">No Episode Selected</h2>
        <p className="text-xs text-slate-400 max-w-md">
          Select or generate an episode from the project dashboard to launch the AI Screenplay & Shot Studio.
        </p>
        <Button onClick={onOpenGeneratorWizard} variant="primary" icon={<Wand2 className="w-4 h-4" />}>
          Generate Episode with AI
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Bar: Episode Meta & Controls */}
      <GlassCard className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              S{activeEpisode.seasonNumber}E{activeEpisode.episodeNumber}
            </span>
            <h1 className="text-xl font-heading font-bold text-white">{activeEpisode.title}</h1>
            <Badge variant="emerald">{activeEpisode.status}</Badge>
          </div>
          <p className="text-xs text-slate-400">{activeEpisode.logline}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={onOpenGeneratorWizard} variant="outline" size="sm" icon={<Wand2 className="w-4 h-4 text-emerald-400" />}>
            Generate New Episode
          </Button>
          <Button onClick={() => onNavigate('export-engine')} variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export Script
          </Button>
        </div>
      </GlassCard>

      {/* Main Studio Workspace: Left Scene Navigator, Middle Script Editor, Right AI Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Scene List Navigator (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <GlassCard className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-heading font-bold text-slate-200">Scene Breakdown</span>
              <button 
                onClick={handleAddScene}
                className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                title="Add New Scene"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {scenes.map((sc, idx) => (
                <div
                  key={sc.id}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`
                    p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col gap-1
                    ${selectedSceneIndex === idx 
                      ? 'bg-slate-800/90 border-emerald-500/40 text-white shadow-md' 
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-emerald-400">SCENE {sc.sceneNumber}</span>
                    <span className="text-[10px] text-slate-500">{sc.shots?.length || 0} Shots</span>
                  </div>
                  <p className="font-semibold text-slate-200 truncate">{sc.heading}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Col 2: Main Screenplay & Shot Editor (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {currentScene ? (
            <GlassCard className="p-6 flex flex-col gap-5 border-slate-800">
              {/* Studio Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'script' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Screenplay Text
                  </button>
                  <button
                    onClick={() => setActiveTab('shots')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'shots' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Shot List ({currentScene.shots?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('vfx')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'vfx' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    VFX & Sound Notes
                  </button>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">Auto-saved</span>
              </div>

              {/* Heading Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scene Heading</label>
                <input
                  type="text"
                  value={currentScene.heading}
                  onChange={(e) => handleUpdateCurrentScene({ heading: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Tab 1: Screenplay View */}
              {activeTab === 'script' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hollywood Screenplay Text</label>
                  <textarea
                    rows={14}
                    value={currentScene.scriptText}
                    onChange={(e) => handleUpdateCurrentScene({ scriptText: e.target.value })}
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs screenplay-font text-slate-100 leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-y"
                    placeholder="EXT. LOCATION - TIME..."
                  />
                </div>
              )}

              {/* Tab 2: Shot Breakdown List */}
              {activeTab === 'shots' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Camera Shots & AI Prompts</span>
                    <Button onClick={handleAddShot} variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                      Add Shot
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {currentScene.shots?.map((st, sIdx) => (
                      <div key={st.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-cyan-400 font-mono">SHOT #{st.shotNumber}</span>
                            <span className="text-xs font-semibold text-slate-200">{st.shotType}</span>
                            <Badge variant="cyan">{st.cameraMovement}</Badge>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{st.durationSeconds}s</span>
                        </div>

                        <p className="text-xs text-slate-300">{st.description}</p>

                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
                          <span className="text-slate-500 font-semibold">Render Prompt: </span>
                          {st.aiRenderPrompt}
                        </div>

                        {st.imagePreviewUrl ? (
                          <div className="relative rounded-lg overflow-hidden border border-slate-800 h-36">
                            <img src={st.imagePreviewUrl} alt="Shot render" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-emerald-400 font-mono">
                              Rendered by Gemini
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRenderShotVisual(st)}
                            isLoading={renderingShotId === st.id}
                            variant="secondary"
                            size="sm"
                            icon={<Camera className="w-3.5 h-3.5" />}
                          >
                            Render Storyboard Frame
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: VFX & Sound Notes */}
              {activeTab === 'vfx' && (
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visual Effects & Audio Supervision</label>
                  <textarea
                    rows={8}
                    value={currentScene.vfxNotes}
                    onChange={(e) => handleUpdateCurrentScene({ vfxNotes: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              )}
            </GlassCard>
          ) : (
            <div className="p-12 text-center text-slate-500">No scene selected.</div>
          )}
        </div>

        {/* Col 3: AI Script Doctor & Assistant (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <GlassCard accentBorder="purple" className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-heading font-bold text-white">AI Script Doctor</h3>
                <p className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Prompt Instruction</label>
              <textarea
                rows={3}
                value={aiAssistantInstruction}
                onChange={(e) => setAiAssistantInstruction(e.target.value)}
                placeholder="e.g., Make dialogue sharper, add more subtext, intensify sci-fi atmosphere..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleRunAIAssistant('Polish Dialogue & Pacing')}
                isLoading={isAiRunning}
                variant="primary"
                size="sm"
                icon={<Wand2 className="w-3.5 h-3.5" />}
              >
                Polish Scene Dialogue
              </Button>

              <Button
                onClick={() => handleRunAIAssistant('Elevate Cinematic Tension')}
                isLoading={isAiRunning}
                variant="secondary"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Elevate Action & Tension
              </Button>
            </div>

            {aiNotes && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs text-slate-300 flex flex-col gap-1">
                <span className="font-bold text-purple-300 text-[10px] uppercase tracking-wider">Script Doctor Critique:</span>
                <p className="leading-relaxed text-[11px] text-slate-400">{aiNotes}</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
