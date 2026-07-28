import { Episode, Project, Shot } from '../types';

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function generateFDX(episode: Episode): string {
  const scenesXml = episode.scenes.map(s => `
    <Paragraph Type="Scene Heading">
      <Text>${s.heading}</Text>
    </Paragraph>
    <Paragraph Type="Action">
      <Text>${s.summary}</Text>
    </Paragraph>
    ${s.scriptText ? `<Paragraph Type="Action"><Text>${s.scriptText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Text></Paragraph>` : ''}
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<FinalDraft DocumentType="Script" Template="No" Version="3">
  <Content>
    <Paragraph Type="Title Page">
      <Text>${episode.title.toUpperCase()}</Text>
    </Paragraph>
    <Paragraph Type="Action">
      <Text>Season ${episode.seasonNumber} Episode ${episode.episodeNumber}</Text>
    </Paragraph>
    <Paragraph Type="Action">
      <Text>Logline: ${episode.logline}</Text>
    </Paragraph>
    ${scenesXml}
  </Content>
</FinalDraft>`;
}

export function generateShotListCSV(shots: Shot[]): string {
  const headers = ['Shot #', 'Shot Type', 'Camera Movement', 'Description', 'Lighting Tone', 'Duration (s)', 'AI Render Prompt', 'Audio Cues'];
  const rows = shots.map(s => [
    s.shotNumber,
    `"${s.shotType}"`,
    `"${s.cameraMovement}"`,
    `"${s.description.replace(/"/g, '""')}"`,
    `"${s.lightingTone.replace(/"/g, '""')}"`,
    s.durationSeconds,
    `"${s.aiRenderPrompt.replace(/"/g, '""')}"`,
    `"${s.audioCues.replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
