import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Sparkles, Clapperboard, Wand2, Clock, Film } from 'lucide-react';
import { Project, Episode, ProductionGenre, ProjectFormat } from '../../../types';
import { generateEpisodeAI } from '../../../services/api';

interface EpisodeGeneratorWizardProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onEpisodeCreated: (episode: Episode) => void;
}

export const EpisodeGeneratorWizard: React.FC<EpisodeGeneratorWizardProps> = ({
  isOpen,
  onClose,
  project,
  onEpisodeCreated
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [logline, setLogline] = useState('');
  const [genre, setGenre] = useState<ProductionGenre>(project?.genre || 'Sci-Fi Cyberpunk');
  const [format, setFormat] = useState<ProjectFormat>(project?.format || 'TV Episode (60m)');
  const [duration, setDuration] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    const nextEpisodeNumber = (project?.episodes?.length || 0) + 1;
    const res = await generateEpisodeAI({
      title: title || `Episode ${100 + nextEpisodeNumber}: Resonance`,
      logline: logline || 'A high-stakes encounter unfolds as corporate enforcers track down a subterranean frequency.',
      genre,
      format,
      targetDurationMinutes: duration,
      characters: project?.characters || []
    });

    setIsGenerating(false);

    if (res.success && res.data) {
      const generatedEp: Episode = {
        id: `ep-${Date.now()}`,
        projectId: project.id,
        seasonNumber: 1,
        episodeNumber: nextEpisodeNumber,
        title: res.data.title || title || `Episode ${100 + nextEpisodeNumber}`,
        logline: res.data.logline || logline,
        targetDurationMinutes: duration,
        genre,
        format,
        status: 'Ready for Export',
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        scenes: (res.data.scenes || []) as any,
        estimatedCredits: res.data.estimatedCredits || 1200
      };

      onEpisodeCreated(generatedEp);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CineAI Episode Generator" subtitle="Architect full multi-scene script breakdowns using Gemini 3.6 Flash">
      <div className="flex flex-col gap-5">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Episode Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Episode 103: Quantum Fracture"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Episode Premise / Logline</label>
              <textarea
                rows={3}
                value={logline}
                onChange={(e) => setLogline(e.target.value)}
                placeholder="Describe the central conflict, character goal, and dramatic twist..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as ProductionGenre)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Sci-Fi Cyberpunk">Sci-Fi Cyberpunk</option>
                  <option value="Psychological Thriller">Psychological Thriller</option>
                  <option value="Epic Fantasy">Epic Fantasy</option>
                  <option value="Neo-Noir Crime">Neo-Noir Crime</option>
                  <option value="Dark Comedy">Dark Comedy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Target Duration (Mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <Button onClick={() => setStep(2)} variant="primary" className="mt-2" icon={<Wand2 className="w-4 h-4" />}>
              Configure AI Settings & Cast
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-400">Attached Character Cast:</span>
              <div className="flex flex-wrap gap-2">
                {project?.characters?.map(c => (
                  <span key={c.id} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    {c.name} ({c.role})
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between">
              <span>Estimated AI Credit Cost:</span>
              <span className="font-bold text-emerald-400">1,200 Credits</span>
            </div>

            <div className="flex items-center justify-between gap-3 mt-2">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Generate Script & Shot Breakdown
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
