import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { BookOpen, Copy, Check, Sparkles, Filter, Wand2, ArrowRight, Zap } from 'lucide-react';
import { CinematicPrompt } from '../../../types';
import { optimizePromptAI } from '../../../services/api';

const PROMPT_CATEGORIES = [
  'All',
  'Action',
  'Crime',
  'Romance',
  'Comedy',
  'Sci-Fi',
  'Horror',
  'Fantasy',
  'Mythology',
  'Thriller'
];

interface PromptLibraryViewProps {
  prompts: CinematicPrompt[];
  onSavePrompt: (p: CinematicPrompt) => void;
  onUsePromptInEditor?: (promptText: string) => void;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({
  prompts,
  onSavePrompt,
  onUsePromptInEditor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Optimizer Modal state
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [rawIdea, setRawIdea] = useState('');
  const [directorStyle, setDirectorStyle] = useState('Denis Villeneuve');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<string | null>(null);

  const directors = ['Christopher Nolan', 'Denis Villeneuve', 'Wong Kar-wai', 'David Fincher', 'Guillermo del Toro', 'Ridley Scott'];

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (p: CinematicPrompt) => {
    navigator.clipboard.writeText(p.promptText);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (p: CinematicPrompt) => {
    if (onUsePromptInEditor) {
      onUsePromptInEditor(p.promptText);
    }
  };

  const handleRunOptimizer = async () => {
    if (!rawIdea) return;
    setIsOptimizing(true);
    setOptimizedResult(null);

    const res = await optimizePromptAI({
      rawConcept: rawIdea,
      directorStyle: directorStyle !== 'None' ? directorStyle : undefined,
      category: 'Director Style'
    });

    setIsOptimizing(false);

    if (res.success && res.optimizedPrompt) {
      setOptimizedResult(res.optimizedPrompt);
    }
  };

  const handleSaveOptimizedAsPrompt = () => {
    if (!optimizedResult) return;
    const newPrompt: CinematicPrompt = {
      id: `p-${Date.now()}`,
      title: `${directorStyle} Inspired Shot`,
      category: selectedCategory !== 'All' ? selectedCategory : 'Sci-Fi',
      promptText: optimizedResult,
      tags: ['Custom', 'AI Optimized', directorStyle],
      directorStyle: directorStyle as any,
      likesCount: 1,
      isCustom: true
    };
    onSavePrompt(newPrompt);
    setIsOptimizerOpen(false);
    setRawIdea('');
    setOptimizedResult(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 text-slate-100">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-amber-400">
            <BookOpen className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Cinematic Prompt Templates</h1>
          </div>
          <p className="text-xs text-slate-400">
            Categorized high-impact prompt anchors. One click fills the movie prompt editor.
          </p>
        </div>

        <Button onClick={() => setIsOptimizerOpen(true)} variant="accent" icon={<Wand2 className="w-4 h-4" />}>
          AI Prompt Optimizer
        </Button>
      </GlassCard>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
        {PROMPT_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer
              ${selectedCategory === cat 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Categorized Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((p) => (
          <GlassCard key={p.id} className="p-5 flex flex-col justify-between gap-4 border-slate-800 group hover:border-amber-500/30 transition-all">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Badge variant="gold">{p.category}</Badge>
                {p.directorStyle && (
                  <span className="text-[10px] text-amber-300 font-mono font-semibold">
                    {p.directorStyle}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-heading font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">{p.title}</h3>
              <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed select-all">
                {p.promptText}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleUsePrompt(p)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fill Prompt Editor</span>
              </button>

              <Button
                onClick={() => handleCopy(p)}
                variant="ghost"
                size="sm"
                icon={copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedId === p.id ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* AI Prompt Optimizer Modal */}
      <Modal isOpen={isOptimizerOpen} onClose={() => setIsOptimizerOpen(false)} title="AI Prompt Optimizer" subtitle="Transform raw concepts into masterwork cinematic render prompts">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Raw Scene Concept</label>
            <textarea
              rows={3}
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              placeholder="e.g., A detective in neo-Mumbai chasing a cybernetic smuggler under neon rain..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Target Director Style</label>
            <select
              value={directorStyle}
              onChange={(e) => setDirectorStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              {directors.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleRunOptimizer}
            isLoading={isOptimizing}
            variant="accent"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Optimize Prompt
          </Button>

          {optimizedResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col gap-3 mt-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Optimized Prompt Output:</span>
              <p className="text-xs font-mono text-slate-200 leading-relaxed select-all">{optimizedResult}</p>
              <div className="flex items-center gap-2">
                <Button onClick={handleSaveOptimizedAsPrompt} variant="primary" size="sm" icon={<Check className="w-3.5 h-3.5" />}>
                  Save to Prompt Library
                </Button>
                {onUsePromptInEditor && (
                  <Button
                    onClick={() => {
                      onUsePromptInEditor(optimizedResult);
                      setIsOptimizerOpen(false);
                    }}
                    variant="accent"
                    size="sm"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Fill Generator
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
