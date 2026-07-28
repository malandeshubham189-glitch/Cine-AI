import { Character, Episode } from '../types';

export async function generateStoryAPI(params: {
  prompt: string;
  language: string;
  genre: string;
  episodeLength: string;
  aspectRatio: string;
  platform: string;
  outputOptions: Record<string, boolean>;
}): Promise<{ success: boolean; data?: any; error?: string; errorType?: string }> {
  try {
    const res = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error', errorType: 'NETWORK_ERROR' };
  }
}

export async function generateCompleteStudioEpisode(params: {
  prompt: string;
  language: string;
  genre: string;
  episodeLength: string;
  aspectRatio: string;
  platform: string;
  outputOptions: Record<string, boolean>;
}): Promise<{ success: boolean; data?: any; error?: string; errorType?: string }> {
  return generateStoryAPI(params);
}

export async function generateImageAPI(params: {
  promptText: string;
  provider?: string;
  aspectRatio?: string;
  characterId?: string;
  sceneNumber?: number;
}): Promise<{ success: boolean; imageUrl?: string; provider?: string; error?: string; errorType?: string }> {
  try {
    const res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error', errorType: 'NETWORK_ERROR' };
  }
}

export async function generateVideoAPI(params: {
  prompt: string;
  provider?: string;
  cameraMovement?: string;
  lens?: string;
  durationSeconds?: number;
  sceneNumber?: number;
}): Promise<{ success: boolean; job?: any; error?: string; errorType?: string }> {
  try {
    const res = await fetch('/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error', errorType: 'NETWORK_ERROR' };
  }
}

export async function generateVoiceAPI(params: {
  dialogueText: string;
  voiceId?: string;
  emotion?: string;
  speaker?: string;
  provider?: string;
}): Promise<{ success: boolean; audioUrl?: string; speaker?: string; provider?: string; error?: string; errorType?: string }> {
  try {
    const res = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error', errorType: 'NETWORK_ERROR' };
  }
}

export async function exportPackageAPI(params: {
  episodeData: any;
  exportFormat: 'JSON' | 'Markdown' | 'SRT' | 'TXT' | 'ZIP' | 'PDF';
}): Promise<{ success: boolean; filename?: string; mimeType?: string; content?: string; downloadUrl?: string; error?: string }> {
  try {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Export service error' };
  }
}


export async function generateEpisodeAI(params: {
  title: string;
  logline: string;
  genre: string;
  format: string;
  targetDurationMinutes: number;
  characters?: Character[];
}): Promise<{ success: boolean; data?: Partial<Episode>; error?: string }> {
  try {
    const res = await fetch('/api/ai/generate-episode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function runSceneAssistant(params: {
  actionType: string;
  scriptText: string;
  sceneHeading?: string;
  instruction?: string;
  genre?: string;
}): Promise<{ success: boolean; enhancedScript?: string; notes?: string; error?: string }> {
  try {
    const res = await fetch('/api/ai/scene-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function generateCharacterBioAI(params: {
  name: string;
  role: string;
  concept: string;
  genre: string;
}): Promise<{ success: boolean; character?: Character; error?: string }> {
  try {
    const res = await fetch('/api/ai/character-bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function optimizePromptAI(params: {
  rawConcept: string;
  directorStyle?: string;
  category?: string;
}): Promise<{ success: boolean; optimizedPrompt?: string; tags?: string[]; error?: string }> {
  try {
    const res = await fetch('/api/ai/optimize-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function generateShotVisualAI(params: {
  promptText: string;
  aspectRatio?: string;
}): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const res = await fetch('/api/ai/generate-shot-visual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}
