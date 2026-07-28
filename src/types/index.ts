export type NavigationTab = 
  | 'dashboard'
  | 'projects'
  | 'characters'
  | 'templates'
  | 'exports'
  | 'settings';

export type ProductionGenre = 
  | 'Sci-Fi Cyberpunk'
  | 'Psychological Thriller'
  | 'Epic Fantasy'
  | 'Neo-Noir Crime'
  | 'Dark Comedy'
  | 'Historical Drama'
  | 'Action Cinematic'
  | 'Horror Mystery';

export type ProjectFormat = 
  | 'Feature Film'
  | 'TV Episode (60m)'
  | 'TV Episode (30m)'
  | 'Cinematic Short'
  | 'Concept Trailer'
  | 'Commercial / Spot';

export interface Character {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Cameo';
  archetype: string;
  bio: string;
  traits: string[];
  voiceStyle: string;
  visualPromptAnchor: string;
  avatarUrl: string;
  relationships: { characterId: string; relation: string }[];
  episodesCount: number;
}

export interface Shot {
  id: string;
  shotNumber: number;
  shotType: 'Extreme Wide Shot' | 'Wide Shot' | 'Medium Shot' | 'Close Up' | 'Extreme Close Up' | 'Over The Shoulder' | 'POV';
  cameraMovement: 'Static' | 'Dolly In' | 'Tracking Pan' | 'Crane Up' | 'Handheld Shake' | 'FPV Drone Sweep' | 'Orbit 360';
  description: string;
  lightingTone: string;
  aiRenderPrompt: string;
  imagePreviewUrl?: string;
  durationSeconds: number;
  audioCues: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  heading: string; // e.g. INT. CYBERLAB - NIGHT
  summary: string;
  charactersInScene: string[];
  scriptText: string;
  shots: Shot[];
  vfxNotes: string;
}

export interface Episode {
  id: string;
  projectId?: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  logline?: string;
  synopsis?: string;
  targetDurationMinutes: number;
  genre?: ProductionGenre | string;
  format?: ProjectFormat | string;
  status?: 'Drafting' | 'Scene Breakdown' | 'Storyboarding' | 'Ready for Export' | 'In Production' | 'Completed';
  createdDate?: string;
  updatedDate?: string;
  scenes?: Scene[] | any[];
  estimatedCredits?: number;
  sceneBreakdown?: any[];
  voiceScript?: string;
  videoPrompts?: string[];
  imagePrompts?: string[];
  musicPrompts?: string[];
  soundEffectsPrompts?: string[];
  subtitlesSrt?: string;
}

export interface Project {
  id: string;
  title: string;
  logline: string;
  genre: ProductionGenre | string;
  format: ProjectFormat | string;
  coverImageUrl?: string;
  posterUrl?: string;
  episodes: Episode[];
  characters?: Character[];
  createdDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'Pre-Production' | 'Active Writing' | 'Post-Production' | 'Archived' | 'Completed' | 'In Production';
  budgetTier?: 'Indie' | 'Mid-Budget' | 'Blockbuster';
  language?: string;
  platform?: string;
  aspectRatio?: string;
}

export interface CinematicPrompt {
  id: string;
  title: string;
  category: 'Director Style' | 'Lighting & Mood' | 'Camera Angles' | 'VFX & Particles' | 'Color Grade' | 'Audio & Ambience';
  promptText: string;
  tags: string[];
  directorStyle?: 'Christopher Nolan' | 'Denis Villeneuve' | 'Wong Kar-wai' | 'David Fincher' | 'Guillermo del Toro' | 'Ridley Scott';
  likesCount: number;
  isCustom?: boolean;
}

export interface CreditTransaction {
  id: string;
  timestamp: string;
  feature: 'AI Script Generation' | 'Scene Visual Render' | 'Character Audio Synth' | 'Full Episode Polish' | 'Export Bible';
  creditsUsed: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  plan: 'Creator' | 'Studio Pro' | 'Enterprise OS';
  creditsRemaining: number;
  totalCreditsUsed: number;
  monthlyQuota: number;
  avatarUrl: string;
  studioName: string;
}

export interface AIModelConfig {
  selectedTextModel: string;
  selectedImageModel: string;
  defaultAspectRatio: '16:9' | '9:16' | '2.39:1' | '4:3';
  temperature: number;
  autoSaveIntervalMs: number;
  exportFormatDefault: 'PDF' | 'FDX' | 'JSON' | 'CSV';
}

export type RenderJobStatus =
  | 'Queued'
  | 'Preparing'
  | 'Generating Story'
  | 'Generating Screenplay'
  | 'Generating Characters'
  | 'Generating Images'
  | 'Generating Videos'
  | 'Generating Audio'
  | 'Exporting'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

export type PipelineStageKey =
  | 'idea'
  | 'story'
  | 'screenplay'
  | 'characterBible'
  | 'sceneBreakdown'
  | 'shotList'
  | 'cameraPlan'
  | 'lightingPlan'
  | 'imagePrompts'
  | 'videoPrompts'
  | 'voicePackage'
  | 'musicPackage'
  | 'sfxPackage'
  | 'subtitles'
  | 'seoPackage'
  | 'exportPackage';

export interface RenderJobLog {
  timestamp: string;
  stage: PipelineStageKey | 'system';
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  provider?: string;
  tokenCount?: number;
}

export interface RenderJob {
  jobId: string;
  projectId: string;
  episodeId: string;
  userId: string;
  title: string;
  currentStageKey: PipelineStageKey;
  currentStageName: string;
  progressPercent: number;
  startedTime: string;
  estimatedTimeMs: number;
  completedTime?: string;
  retryCount: number;
  maxRetries: number;
  priority: 'High' | 'Normal' | 'Low';
  status: RenderJobStatus;
  provider: string; // e.g. "Gemini 3.6 Flash + Veo + Imagen 3"
  logs: RenderJobLog[];
  errorMessage?: string;
  generatedArtifacts?: {
    episodeTitle?: string;
    synopsis?: string;
    scenesCount?: number;
    charactersCount?: number;
    videoPromptsCount?: number;
    imagePromptsCount?: number;
    voiceScriptReady?: boolean;
    srtReady?: boolean;
    seoReady?: boolean;
    downloadUrl?: string;
  };
}

export interface MediaAsset {
  id: string;
  projectId: string;
  title: string;
  category: 'Image' | 'Video' | 'Audio' | 'Music' | 'Subtitle' | 'Thumbnail' | 'Poster' | 'Export';
  url: string;
  previewUrl?: string;
  fileSizeMb: number;
  format: string;
  createdAt: string;
  tags: string[];
  promptUsed?: string;
  providerUsed?: string;
}

export interface ProjectVersion {
  versionId: string;
  versionNumber: number;
  projectId: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  changesSummary: string[];
  episodeDataSnapshot: any;
}

export interface ProjectRenderMetrics {
  storageUsedMb: number;
  totalRenderTimeMins: number;
  totalCreditsUsed: number;
  apiCallsCount: number;
  completedJobsCount: number;
  failedJobsCount: number;
  averageRenderTimeSecs: number;
}

