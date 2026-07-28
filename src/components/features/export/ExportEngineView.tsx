import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Download, FileText, FileCode, Table, Check } from 'lucide-react';
import { Episode, Project } from '../../../types';
import { generateFDX, generateShotListCSV, downloadFile } from '../../../lib/utils';

interface ExportEngineViewProps {
  activeEpisode: Episode;
  project: Project;
}

export const ExportEngineView: React.FC<ExportEngineViewProps> = ({
  activeEpisode,
  project
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleExportFDX = () => {
    if (!activeEpisode) return;
    const fdxXml = generateFDX(activeEpisode);
    downloadFile(`${activeEpisode.title.replace(/\s+/g, '_')}.fdx`, fdxXml, 'application/xml');
    triggerSuccess('FDX XML Screenplay');
  };

  const handleExportCSV = () => {
    if (!activeEpisode) return;
    const shots = activeEpisode.scenes.flatMap(s => s.shots || []);
    const csv = generateShotListCSV(shots);
    downloadFile(`${activeEpisode.title.replace(/\s+/g, '_')}_ShotList.csv`, csv, 'text/csv');
    triggerSuccess('Shot List CSV');
  };

  const handleExportBibleJSON = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    downloadFile(`${project.title.replace(/\s+/g, '_')}_ProductionBible.json`, jsonStr, 'application/json');
    triggerSuccess('Production Bible JSON');
  };

  const triggerSuccess = (fmt: string) => {
    setDownloadedFormat(fmt);
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-purple-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-purple-400">
            <Download className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Production Export Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            Export Industry-Standard Final Draft XML, Screenplays, Shot Lists, and Studio Production Bibles.
          </p>
        </div>

        {downloadedFormat && (
          <Badge variant="emerald" icon={<Check className="w-3.5 h-3.5" />}>
            Exported {downloadedFormat} Successfully
          </Badge>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Export 1: Final Draft FDX */}
        <GlassCard className="p-6 flex flex-col justify-between gap-5 border-slate-800">
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-heading font-bold text-white">Final Draft Screenplay (.FDX)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industry standard XML document fully compatible with Final Draft 12+, Fade In, and Highland 2.
            </p>
          </div>

          <Button onClick={handleExportFDX} variant="primary" icon={<Download className="w-4 h-4" />}>
            Export FDX XML
          </Button>
        </GlassCard>

        {/* Export 2: Shot List CSV */}
        <GlassCard className="p-6 flex flex-col justify-between gap-5 border-slate-800">
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Table className="w-6 h-6" />
            </div>
            <h3 className="text-base font-heading font-bold text-white">Camera Shot List (.CSV)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete camera movement, lighting tone, and AI render prompt breakdown for camera operators and DP.
            </p>
          </div>

          <Button onClick={handleExportCSV} variant="secondary" icon={<Download className="w-4 h-4" />}>
            Export Shot List CSV
          </Button>
        </GlassCard>

        {/* Export 3: Studio Production Bible JSON */}
        <GlassCard className="p-6 flex flex-col justify-between gap-5 border-slate-800">
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-heading font-bold text-white">Studio Production Bible (.JSON)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete production package containing all episodes, characters, prompts, and scene breakdowns.
            </p>
          </div>

          <Button onClick={handleExportBibleJSON} variant="accent" icon={<Download className="w-4 h-4" />}>
            Export Full Bible JSON
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};
