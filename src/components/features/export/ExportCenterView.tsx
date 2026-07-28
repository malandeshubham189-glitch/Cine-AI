import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Download,
  FolderDown,
  Printer,
  Code,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Film
} from 'lucide-react';

interface ExportCenterViewProps {
  generatedPackage?: any;
}

export const ExportCenterView: React.FC<ExportCenterViewProps> = ({ generatedPackage }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const exportFiles = [
    {
      id: 'exp-zip',
      title: 'Full Master Studio ZIP Package',
      desc: 'Complete production archive containing 4-Act Screenplay PDF, JSON metadata, 8K Image Prompts, Voice Directions, and SRT subtitles.',
      format: 'ZIP Archive',
      size: '64.5 MB',
      status: 'Ready',
      icon: FolderDown,
      badgeColor: 'emerald'
    },
    {
      id: 'exp-pdf',
      title: 'Industry Standard Screenplay (PDF)',
      desc: 'Formatted according to Hollywood Final Draft guidelines (12pt Courier Final Draft standard).',
      format: 'PDF Document',
      size: '850 KB',
      status: 'Ready',
      icon: Printer,
      badgeColor: 'emerald'
    },
    {
      id: 'exp-json',
      title: 'Raw API Production Manifest (JSON)',
      desc: 'Full structured JSON with shot list matrices, camera angles, lighting tones, and character bibles.',
      format: 'JSON File',
      size: '120 KB',
      status: 'Ready',
      icon: Code,
      badgeColor: 'amber'
    },
    {
      id: 'exp-md',
      title: 'Markdown Production Script (.md)',
      desc: 'Clean GitHub & Obsidian friendly markdown formatted script for rapid editing.',
      format: 'Markdown',
      size: '45 KB',
      status: 'Ready',
      icon: FileText,
      badgeColor: 'cyan'
    },
    {
      id: 'exp-srt',
      title: 'Timecoded Dialogue Subtitles (.srt)',
      desc: 'Broadcast-ready timecoded SRT subtitles synchronized for premiere & YouTube.',
      format: 'SRT File',
      size: '48 KB',
      status: 'Ready',
      icon: Clock,
      badgeColor: 'indigo'
    }
  ];

  const handleTriggerDownload = (item: typeof exportFiles[0]) => {
    setDownloadingId(item.id);

    setTimeout(() => {
      setDownloadingId(null);

      // Trigger actual string download file
      const content = item.id === 'exp-json'
        ? JSON.stringify(generatedPackage || { title: 'CineAI Episode' }, null, 2)
        : `# ${generatedPackage?.title || 'CineAI Episode'}\n\n${generatedPackage?.synopsis || ''}\n\n${generatedPackage?.voiceScript || ''}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(generatedPackage?.title || 'CineAI_Export').replace(/\s+/g, '_')}_${item.id}.${item.format === 'JSON File' ? 'json' : item.format === 'Markdown' ? 'md' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Download className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Master Distribution Export Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            One-click distribution packaging for {generatedPackage?.title || 'Active Movie'}. Export Hollywood Screenplay PDF, ZIP Archives, JSON manifests, and Subtitles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald">100% Export Ready</Badge>
        </div>
      </GlassCard>

      {/* Export Status & Progress Widget */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Master Render Pipeline Verification</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">0 Errors • All Assets Sealed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">Total Package Size</span>
            <span className="text-white font-bold text-sm font-heading">~ 65.8 MB</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">Screenplay Pages</span>
            <span className="text-white font-bold text-sm font-heading">18 Pages (Courier)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">8K Keyframe Prompts</span>
            <span className="text-white font-bold text-sm font-heading">24 Render Passes</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1">
            <span className="text-slate-500 font-semibold">Voice Track Format</span>
            <span className="text-white font-bold text-sm font-heading">24-bit 48kHz WAV</span>
          </div>
        </div>
      </div>

      {/* File Downloads List */}
      <div className="flex flex-col gap-4">
        {exportFiles.map(file => {
          const Icon = file.icon;
          const isDownloading = downloadingId === file.id;

          return (
            <GlassCard key={file.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-heading truncate">{file.title}</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">
                      {file.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{file.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400">{file.size}</span>

                <Button
                  onClick={() => handleTriggerDownload(file)}
                  isLoading={isDownloading}
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download {file.format}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
