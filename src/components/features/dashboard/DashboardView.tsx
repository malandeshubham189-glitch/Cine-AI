import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Film, 
  Video, 
  Tv, 
  Globe, 
  Languages, 
  Sliders, 
  Check, 
  Copy, 
  Download, 
  FileText, 
  FileCode, 
  Share2, 
  Users, 
  Camera, 
  Volume2, 
  Music, 
  Eye, 
  Layers, 
  RefreshCw, 
  ArrowRight, 
  Clapperboard, 
  Zap, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Mic, 
  Image as ImageIcon, 
  Printer, 
  Play, 
  Trash2, 
  History, 
  Plus, 
  Wand2, 
  Tag, 
  Activity, 
  Sparkle,
  AlertTriangle,
  Key,
  WifiOff,
  Clock,
  Gauge,
  Edit3,
  Lock,
  Shield,
  Search,
  Pin,
  Maximize2,
  Minimize2,
  Code,
  FileSpreadsheet,
  Filter,
  Terminal,
  Archive,
  FolderDown,
  Heart,
  GitFork,
  Calendar,
  Award,
  Calculator,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Image
} from 'lucide-react';

const ROTATING_AI_TIPS = [
  "💡 Tip: 35mm anamorphic lens creates natural human perspective in dramatic close-up scenes.",
  "💡 Tip: Neon rim lighting and atmospheric fog produce iconic cyberpunk noir aesthetics.",
  "💡 Tip: Master Character Bibles lock facial consistency across Midjourney v6 & Imagen 3.",
  "💡 Tip: Specify emotion cues like (whispering softly) or (intense pause) for ElevenLabs voice acting.",
  "💡 Tip: Slow dolly zooms heighten psychological tension during climax reveal beats.",
  "💡 Tip: Synchronizing sound effect pulses with key frame cuts amplifies viewer engagement."
];
import { generateCompleteStudioEpisode } from '../../../services/api';
import { jobQueueManager } from '../../../services/jobQueueService';
import { Project, Episode, PipelineStageKey } from '../../../types';

import { LeftQuickPanel } from '../../layout/LeftQuickPanel';
import { AIDirectorCopilot } from '../copilot/AIDirectorCopilot';
import { AssetManagerView } from '../assets/AssetManagerView';
import { StoryboardViewer } from '../storyboard/StoryboardViewer';
import { CharacterBibleStudio } from '../characters/CharacterBibleStudio';
import { CharacterRelationshipMap } from '../characters/CharacterRelationshipMap';
import { MovieTimelineEditor } from '../timeline/MovieTimelineEditor';
import { PromptEngineeringStudio } from '../prompts/PromptEngineeringStudio';
import { ExportCenterView } from '../export/ExportCenterView';
import { VersionHistoryStudio } from '../versioning/VersionHistoryStudio';
import { PerformanceMonitorWidget } from '../performance/PerformanceMonitorWidget';
import { ProductionCalendar } from '../calendar/ProductionCalendar';
import { TeamWorkspace } from '../team/TeamWorkspace';
import { AIQualityScore } from '../analytics/AIQualityScore';
import { ProductionCostEstimator } from '../analytics/ProductionCostEstimator';

interface DashboardViewProps {
  project?: Project;
  onEpisodeGenerated?: (episode: Episode) => void;
  onNavigate?: (tab: string) => void;
  onNotify?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  prefilledPrompt?: string | null;
  onClearPrefilledPrompt?: () => void;
  onProjectGenerated?: (newProj: Project) => void;
}

export interface MasterCharacterProfile {
  id?: string;
  name: string;
  role?: string;
  masterPrompt?: string;
  negativePrompt?: string;
  appearanceLock?: string;
  voiceLock?: string;
  costumeLock?: string;
  age?: string;
  gender?: string;
  faceDescription?: string;
  hair?: string;
  eyes?: string;
  skinTone?: string;
  height?: string;
  bodyType?: string;
  costume?: string;
  accessories?: string;
  expressions?: string;
  appearance?: string;
  clothes?: string;
  personality: string;
  voice?: string;
  characterConsistencyPrompt?: string;
}

export interface SceneCard {
  sceneNumber: number;
  duration: string;
  location?: string;
  time?: string;
  heading?: string;
  summary?: string;
  sceneGoal?: string;
  visualPrompt: string;
  characterPrompt?: string;
  cameraAngle?: string;
  cameraMovement?: string;
  cameraPrompt?: string;
  lens?: string;
  lighting: string;
  environment?: string;
  dialogues: Array<{
    speaker: string;
    lines: string;
    emotion: string;
  }>;
  voiceEmotion: string;
  backgroundMusicPrompt?: string;
  musicPrompt?: string;
  soundEffectPrompt?: string;
  sfxPrompt?: string;
  negativePrompt: string;
}

export interface GeneratedPackage {
  id?: string;
  timestamp?: string;
  pinned?: boolean;
  title: string;
  synopsis: string;
  genre: string;
  mood?: string;
  targetAudience?: string;
  language: string;
  platform: string;
  aspectRatio: string;
  duration: string;
  storyStructure?: {
    beginning: string;
    conflict: string;
    climax: string;
    ending: string;
  };
  characters: MasterCharacterProfile[];
  scenes: SceneCard[];
  imagePrompts?: {
    imagen: string;
    flux: string;
    midjourney: string;
    sdxl: string;
  };
  videoPrompts?: Array<{
    sceneNumber: number;
    model: string;
    prompt: string;
  }>;
  voicePackage?: {
    voiceStyle: string;
    emotion: string;
    speakingSpeed: string;
    accent: string;
  };
  socialMediaPackage?: {
    youtubeTitle: string;
    seoDescription: string;
    instagramCaption: string;
    facebookCaption: string;
    hashtags: string[];
    thumbnailPrompt: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  hashtags?: string[];
  thumbnailPrompt?: string;
  lightingDirections?: string;
  subtitlesSrt: string;
}

const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Punjabi', 'Bhojpuri', 'Tamil', 'Telugu', 'Spanish', 'French'];
const GENRES = ['Action', 'Crime', 'Drama', 'Comedy', 'Romance', 'Sci-Fi', 'Fantasy', 'Mythology', 'Horror', 'Thriller'];
const DURATIONS = ['30 sec', '60 sec', '2 min', '5 min', '7 min', '10 min'];
const ASPECT_RATIOS = ['16:9 Cinema Landscape', '9:16 Shorts / Reels', '2.39:1 Anamorphic'];
const PLATFORMS = ['YouTube', 'Instagram Reels', 'Facebook Videos', 'YouTube Shorts', 'Multiple'];

const INITIAL_OUTPUT_OPTIONS = {
  story: true,
  screenplay: true,
  sceneBreakdown: true,
  characterBible: true,
  imagePrompts: true,
  cameraDirections: true,
  lighting: true,
  voiceDialogue: true,
  voiceEmotion: true,
  backgroundMusicPrompt: true,
  soundEffects: true,
  subtitleFile: true,
  thumbnailPrompt: true,
  seoTitle: true,
  seoDescription: true,
  hashtags: true
};

const EXAMPLE_PROMPTS = [
  "A fearless Mumbai journalist uncovers an underground AI crime network while protecting her family.",
  "An ancient Vedic warrior discovers a quantum gateway inside a forgotten Himalayan temple.",
  "A neon-lit cyberpunk detective investigates a synthetic memory heist in 2088 New Delhi.",
  "An intense psychological horror where a film editor notices eerie figures appearing in unedited footage."
];

const PROMPT_TEMPLATES_BY_CATEGORY: Record<string, string[]> = {
  Action: [
    "A rogue commando in neo-Tokyo must protect an exiled scientist carrying an EMP key.",
    "A high-octane highway chase across the Thar desert during a massive sandstorm."
  ],
  Crime: [
    "A fearless Mumbai journalist uncovers an underground AI crime network while protecting her family.",
    "An undercover detective infiltrating a syndicate operating inside an abandoned harbor warehouse."
  ],
  Romance: [
    "Two astronomers stationed on opposite poles of Mars communicate through laser signal transmissions.",
    "A street artist and a classical musician cross paths in rainy old Kyoto."
  ],
  Comedy: [
    "A botched time-travel heist sends two clumsy thieves into an ancient royal court banquet.",
    "An AI culinary robot attempts to run an authentic street food stall with chaotic results."
  ],
  'Sci-Fi': [
    "A neon-lit cyberpunk detective investigates a synthetic memory heist in 2088 New Delhi.",
    "A deep-space salvage crew discovers an alien biosignature echoing inside a dead star station."
  ],
  Horror: [
    "An intense psychological horror where a film editor notices eerie figures appearing in unedited footage.",
    "A night shift operator at a deep sea lighthouse hears whisper signals from underwater trenches."
  ],
  Fantasy: [
    "A young alchemist awakens a slumbering dragon underneath a floating crystal citadel.",
    "An enchanted forest guardian fights corrupted shadow spirits to preserve the World Tree."
  ],
  Mythology: [
    "An ancient Vedic warrior discovers a quantum gateway inside a forgotten Himalayan temple.",
    "A mythical sun deity descends into a mortal realm during a solar eclipse event."
  ],
  Thriller: [
    "A submarine captain trapped in an iceberg trench discovers a sabotage device on board.",
    "A whistleblower locked inside a smart tower tries to bypass automated security lockdown."
  ]
};

const PIPELINE_STEPS = [
  { step: 1, title: '1. Idea & Premise Analysis', desc: 'Analyzing logline, premise, tone & thematic setup' },
  { step: 2, title: '2. Story Arc (4-Act Structure)', desc: 'Structuring narrative arc, dramatic conflict & climax beats' },
  { step: 3, title: '3. Screenplay & Dialogue', desc: 'Formatting industry-standard script & character dialogues' },
  { step: 4, title: '4. Character Bible & Personas', desc: 'Synthesizing master character profiles & voice bibles' },
  { step: 5, title: '5. Scene Breakdown', desc: 'Creating scene cards, locations & time setups' },
  { step: 6, title: '6. Camera & Lighting Directions', desc: 'Configuring shot list, lens specs & lighting directions' },
  { step: 7, title: '7. Image Keyframe Prompts', desc: 'Formulating 8K Imagen 3, Midjourney v6 & Flux prompts' },
  { step: 8, title: '8. Video Motion Prompts', desc: 'Drafting Google Veo, Sora & Runway Gen-3 motion prompts' },
  { step: 9, title: '9. Voice Package & Dubbing', desc: 'Building ElevenLabs voiceover, dialogue direction & accents' },
  { step: 10, title: '10. Music Score & Tracks', desc: 'Composing Suno/Udio cinematic audio cues & drone tempos' },
  { step: 11, title: '11. Sound Effects (SFX)', desc: 'Generating ambient Foley, impact transitions & audio layers' },
  { step: 12, title: '12. Poster & Thumbnail', desc: 'Designing click-through hero thumbnail & poster prompts' },
  { step: 13, title: '13. SEO & Metadata Package', desc: 'Formulating viral YouTube/IG titles, descriptions & tags' },
  { step: 14, title: '14. Final Production Export Package', desc: 'Finalizing JSON, Markdown, TXT & SRT subtitle package' }
];

const HISTORY_STORAGE_KEY = 'cineai_v5_projects_history';

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onEpisodeGenerated,
  onNavigate,
  onNotify,
  prefilledPrompt,
  onClearPrefilledPrompt,
  onProjectGenerated
}) => {
  // Form State
  const [prompt, setPrompt] = useState("A fearless Mumbai journalist uncovers an underground AI crime network while protecting her family.");
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [selectedGenre, setSelectedGenre] = useState("Crime");
  const [selectedDuration, setSelectedDuration] = useState("2 min");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9 Cinema Landscape");
  const [selectedPlatform, setSelectedPlatform] = useState("YouTube");
  
  const [promptCategoryFilter, setPromptCategoryFilter] = useState("Action");

  // Sync prefilled prompt when coming from Prompt Library
  useEffect(() => {
    if (prefilledPrompt) {
      setPrompt(prefilledPrompt);
      if (onClearPrefilledPrompt) onClearPrefilledPrompt();
    }
  }, [prefilledPrompt]);
  
  const [outputOptions, setOutputOptions] = useState<Record<string, boolean>>(INITIAL_OUTPUT_OPTIONS);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generatedPackage, setGeneratedPackage] = useState<GeneratedPackage | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Error State for Beautiful Error Cards
  const [errorState, setErrorState] = useState<{
    type: string;
    title: string;
    message: string;
    detail?: string;
  } | null>(null);

  // History State
  const [projectHistory, setProjectHistory] = useState<GeneratedPackage[]>([]);
  const [activeProject, setActiveProject] = useState<any>(null);

  // Workspace & Viewer States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pinned' | 'recent'>('all');
  const [productionLogs, setProductionLogs] = useState<Array<{ id: string; time: string; text: string }>>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(18);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);

  // Rotating tips timer during generation
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % ROTATING_AI_TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // V7 Three Panel Workspace Layout States
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // UI Active Tab state after generation
  const [activeOutputTab, setActiveOutputTab] = useState<
    'overview' | 'story' | 'screenplay' | 'timeline' | 'storyboard' | 'characters' | 'relationships' | 'calendar' | 'team' | 'quality' | 'cost' | 'scenes' | 'images' | 'videos' | 'video-prompts' | 'voice' | 'music' | 'thumbnail' | 'prompts' | 'assets' | 'seo' | 'export' | 'exports' | 'history' | 'performance'
  >('overview');

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setProjectHistory(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load project history", e);
    }
  }, []);

  const savePackageToHistory = (pkg: GeneratedPackage) => {
    try {
      const itemWithId: GeneratedPackage = {
        ...pkg,
        id: pkg.id || `proj_${Date.now()}`,
        timestamp: pkg.timestamp || new Date().toLocaleString()
      };
      setProjectHistory(prev => {
        const filtered = prev.filter(p => p.id !== itemWithId.id && p.title !== itemWithId.title);
        const updated = [itemWithId, ...filtered];
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save project history", e);
    }
  };

  const handleTogglePinHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectHistory(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved project?")) return;
    try {
      setProjectHistory(prev => {
        const updated = prev.filter(p => p.id !== id);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleDuplicateHistory = (pkg: GeneratedPackage, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: GeneratedPackage = {
      ...pkg,
      id: `proj_${Date.now()}`,
      title: `${pkg.title} (Copy)`,
      timestamp: new Date().toLocaleString()
    };
    savePackageToHistory(duplicated);
  };

  const handleRenameHistory = (pkg: GeneratedPackage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = window.prompt("Enter new title for this project:", pkg.title);
    if (!newTitle || !newTitle.trim()) return;
    
    const updatedPkg = { ...pkg, title: newTitle.trim() };
    setProjectHistory(prev => {
      const updated = prev.map(p => p.id === pkg.id ? updatedPkg : p);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    if (generatedPackage?.id === pkg.id) {
      setGeneratedPackage(updatedPkg);
    }
  };

  const handleOpenHistoryItem = (pkg: GeneratedPackage) => {
    setGeneratedPackage(pkg);
    setActiveOutputTab('overview');
  };

  const handleToggleOption = (key: string) => {
    setOutputOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAllOptions = (select: boolean) => {
    const updated: Record<string, boolean> = {};
    Object.keys(outputOptions).forEach(k => {
      updated[k] = select;
    });
    setOutputOptions(updated);
  };

  const handleGenerate = async () => {
    if (!prompt || !prompt.trim()) {
      setErrorState({
        type: 'EMPTY_PROMPT',
        title: 'Prompt Cannot Be Empty',
        message: 'Please enter a story premise, logline, or choose one of the 1-click templates to initiate the AI Movie Production Pipeline.'
      });
      return;
    }

    setErrorState(null);
    setIsGenerating(true);
    setLoadingStep(0);
    setRemainingSeconds(18);

    // Create background render job
    const newJob = jobQueueManager.createJob(
      project?.id || `proj_${Date.now()}`,
      `ep_${Date.now()}`,
      `AI Episode: ${prompt.slice(0, 30)}...`
    );
    
    const initialLog = {
      id: 'log_0',
      time: new Date().toLocaleTimeString(),
      text: `[SYSTEM] Pipeline initialized with prompt: "${prompt.slice(0, 45)}..."`
    };
    setProductionLogs([initialLog]);

    const countdownTimer = setInterval(() => {
      setRemainingSeconds(prev => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const stepKeys: PipelineStageKey[] = [
      'idea',
      'story',
      'screenplay',
      'characterBible',
      'sceneBreakdown',
      'shotList',
      'cameraPlan',
      'lightingPlan',
      'imagePrompts',
      'videoPrompts',
      'voicePackage',
      'musicPackage',
      'sfxPackage',
      'subtitles',
      'seoPackage',
      'exportPackage'
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        const nextStep = prev < PIPELINE_STEPS.length - 1 ? prev + 1 : prev;
        const currentStepInfo = PIPELINE_STEPS[nextStep];
        const currentStageKey = stepKeys[nextStep] || 'idea';
        const progressPct = Math.round(((nextStep + 1) / PIPELINE_STEPS.length) * 95);

        if (currentStepInfo) {
          const logMsg = `[STEP ${nextStep + 1}/${PIPELINE_STEPS.length}] ${currentStepInfo.title}: ${currentStepInfo.desc}`;
          setProductionLogs(logs => [
            ...logs,
            {
              id: `log_${Date.now()}`,
              time: new Date().toLocaleTimeString(),
              text: logMsg
            }
          ]);
          jobQueueManager.updateJobProgress(
            newJob.jobId,
            currentStageKey,
            currentStepInfo.title,
            progressPct,
            logMsg
          );
        }
        return nextStep;
      });
    }, 1100);

    try {
      const res = await generateCompleteStudioEpisode({
        prompt,
        language: selectedLanguage,
        genre: selectedGenre,
        episodeLength: selectedDuration,
        aspectRatio: selectedAspectRatio,
        platform: selectedPlatform,
        outputOptions
      });

      clearInterval(stepInterval);
      clearInterval(countdownTimer);
      
      if (res.success && res.data) {
        const pkgData: GeneratedPackage = {
          ...res.data,
          id: `proj_${Date.now()}`,
          timestamp: new Date().toLocaleString()
        };
        setGeneratedPackage(pkgData);
        savePackageToHistory(pkgData);
        setActiveOutputTab('overview');

        jobQueueManager.updateJobProgress(
          newJob.jobId,
          'exportPackage',
          'Production Package Ready',
          100,
          `Successfully generated "${pkgData.title}" package.`,
          'Completed'
        );

        if (onNotify) {
          onNotify('Generation Completed', `Episode package for "${pkgData.title}" synthesized`, 'success');
        }

        if (onProjectGenerated) {
          const autoProject: Project = {
            id: pkgData.id || `proj_${Date.now()}`,
            title: pkgData.title || 'Untitled AI Feature',
            logline: pkgData.synopsis || prompt,
            genre: pkgData.genre || selectedGenre,
            format: selectedAspectRatio.includes('16:9') ? 'Cinematic Feature' : 'Short Reel',
            aspectRatio: selectedAspectRatio,
            status: 'Completed',
            language: selectedLanguage,
            platform: selectedPlatform,
            posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            episodes: [
              {
                id: `ep_${Date.now()}`,
                seasonNumber: 1,
                episodeNumber: 1,
                title: pkgData.title,
                synopsis: pkgData.synopsis,
                targetDurationMinutes: parseInt(selectedDuration) || 3,
                sceneBreakdown: pkgData.scenes as any,
                voiceScript: pkgData.scenes?.map(s => s.dialogues?.map(d => `${d.speaker}: ${d.lines}`).join('\n')).join('\n\n') || '',
                videoPrompts: pkgData.videoPrompts?.map(vp => vp.prompt) || [],
                imagePrompts: pkgData.imagePrompts ? [pkgData.imagePrompts.imagen, pkgData.imagePrompts.flux] : [],
                musicPrompts: [pkgData.scenes?.[0]?.backgroundMusicPrompt || 'Cinematic theme'],
                soundEffectsPrompts: [pkgData.scenes?.[0]?.soundEffectPrompt || 'Ambient sfx'],
                subtitlesSrt: pkgData.subtitlesSrt || '',
                estimatedCredits: 1200
              }
            ]
          };
          onProjectGenerated(autoProject);
        }
      } else {
        const errType = res.errorType || 'UNKNOWN';
        let errorTitle = 'Production Pipeline Error';
        let errorMessage = res.error || 'An unexpected error occurred during synthesis.';

        if (errType === 'INVALID_API_KEY') {
          errorTitle = 'Invalid API Key Configured';
          errorMessage = 'The Gemini API Key is either missing or invalid. Please configure a valid API key in environment settings.';
        } else if (errType === 'RATE_LIMIT') {
          errorTitle = 'Gemini Rate Limit Exceeded';
          errorMessage = 'Too many requests were sent in a short time window. Please wait a few moments and try again.';
        } else if (errType === 'TIMEOUT') {
          errorTitle = 'Gemini Request Timeout';
          errorMessage = 'The synthesis request timed out while generating multi-scene structured assets. Please retry.';
        } else if (errType === 'MALFORMED_JSON') {
          errorTitle = 'Malformed AI Response Format';
          errorMessage = 'The Gemini engine returned unparseable JSON output. Click retry to generate again.';
        } else if (errType === 'NETWORK_ERROR') {
          errorTitle = 'Network Connection Failure';
          errorMessage = 'Could not reach backend services. Please check server status or network connection.';
        }

        jobQueueManager.markJobFailed(newJob.jobId, `${errorTitle}: ${errorMessage}`);

        setErrorState({
          type: errType,
          title: errorTitle,
          message: errorMessage,
          detail: res.error
        });
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      jobQueueManager.markJobFailed(newJob.jobId, err.message || 'Unhandled exception');
      setErrorState({
        type: 'UNHANDLED_EXCEPTION',
        title: 'Unhandled Pipeline Exception',
        message: err.message || 'An unhandled exception occurred during episode synthesis.',
        detail: String(err)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExportZIP = async () => {
    if (!generatedPackage) return;
    try {
      const zip = new JSZip();
      const slug = generatedPackage.title.replace(/\s+/g, '_');
      const root = zip.folder(slug) || zip;

      // Master JSON
      root.file(`${slug}_Production_Package.json`, JSON.stringify(generatedPackage, null, 2));

      // Markdown
      let md = `# 🎬 ${generatedPackage.title}\n\n`;
      md += `**Genre:** ${generatedPackage.genre} | **Language:** ${generatedPackage.language} | **Duration:** ${generatedPackage.duration}\n\n`;
      md += `## Synopsis\n${generatedPackage.synopsis}\n\n`;
      md += `## Characters\n`;
      generatedPackage.characters?.forEach(c => {
        md += `### ${c.name} (${c.role || 'Main'})\n- Personality: ${c.personality}\n- Voice: ${c.voice || 'N/A'}\n- Costume: ${c.costume || c.clothes || 'N/A'}\n- Master Prompt: \`${c.masterPrompt || c.characterConsistencyPrompt || ''}\` \n\n`;
      });
      md += `## Scenes Breakdown\n`;
      generatedPackage.scenes?.forEach(s => {
        md += `### Scene ${s.sceneNumber}: ${s.location || s.heading || 'Scene'}\n- Visual Prompt: \`${s.visualPrompt}\` \n- Lighting: ${s.lighting}\n`;
        if (s.dialogues?.length) {
          s.dialogues.forEach(d => md += `  * **${d.speaker}** (${d.emotion}): "${d.lines}"\n`);
        }
        md += `\n`;
      });
      root.file(`${slug}_Studio.md`, md);

      // TXT Screenplay
      let txt = `=========================================================\n`;
      txt += `TITLE: ${generatedPackage.title.toUpperCase()}\n`;
      txt += `GENRE: ${generatedPackage.genre} | DURATION: ${generatedPackage.duration}\n`;
      txt += `=========================================================\n\n`;
      generatedPackage.scenes?.forEach(s => {
        txt += `SCENE ${s.sceneNumber}: ${(s.location || s.heading || 'INT. LOCATION').toUpperCase()}\n`;
        txt += `[Camera: ${s.cameraAngle || 'Eye Level'} | Movement: ${s.cameraMovement || 'Static'} | Lens: ${s.lens || '35mm'} | Lighting: ${s.lighting}]\n\n`;
        txt += `${s.visualPrompt}\n\n`;
        s.dialogues?.forEach(d => {
          txt += `\t\t${d.speaker.toUpperCase()}\n`;
          if (d.emotion) txt += `\t\t(${d.emotion})\n`;
          txt += `\t${d.lines}\n\n`;
        });
        txt += `---------------------------------------------------------\n\n`;
      });
      root.file(`${slug}_Screenplay.txt`, txt);

      // Specific JSON prompt packages
      root.file(`${slug}_Character_Bible.json`, JSON.stringify(generatedPackage.characters || [], null, 2));
      root.file(`${slug}_Scene_Book.json`, JSON.stringify(generatedPackage.scenes || [], null, 2));
      root.file(`${slug}_Image_Prompts.json`, JSON.stringify(generatedPackage.imagePrompts || {}, null, 2));
      root.file(`${slug}_Video_Prompts.json`, JSON.stringify(generatedPackage.videoPrompts || {}, null, 2));
      root.file(`${slug}_Voice_Package.json`, JSON.stringify(generatedPackage.voicePackage || {}, null, 2));
      root.file(`${slug}_SEO_Distribution.json`, JSON.stringify(generatedPackage.socialMediaPackage || {}, null, 2));

      if (generatedPackage.subtitlesSrt) {
        root.file(`${slug}_Subtitles.srt`, generatedPackage.subtitlesSrt);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}_CineAI_Production_Package.zip`;
      a.click();
    } catch (err) {
      console.error("Failed to generate ZIP", err);
    }
  };

  const handleExportJSON = () => {
    if (!generatedPackage) return;
    const blob = new Blob([JSON.stringify(generatedPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_CineAI_Package.json`;
    a.click();
  };

  const handleExportTXT = () => {
    if (!generatedPackage) return;
    let text = `CINEAI CREATOROS V5 — COMPLETE AI EPISODE PRODUCTION PACKAGE\n`;
    text += `==========================================================\n`;
    text += `TITLE: ${generatedPackage.title}\n`;
    text += `GENRE: ${generatedPackage.genre} | LANGUAGE: ${generatedPackage.language} | DURATION: ${generatedPackage.duration}\n`;
    text += `MOOD: ${generatedPackage.mood || 'N/A'} | TARGET AUDIENCE: ${generatedPackage.targetAudience || 'N/A'}\n\n`;
    text += `--- SHORT SYNOPSIS ---\n${generatedPackage.synopsis}\n\n`;
    
    if (generatedPackage.storyStructure) {
      text += `--- STORY STRUCTURE ---\n`;
      text += `ACT I (BEGINNING): ${generatedPackage.storyStructure.beginning}\n`;
      text += `ACT II (CONFLICT): ${generatedPackage.storyStructure.conflict}\n`;
      text += `ACT III (CLIMAX): ${generatedPackage.storyStructure.climax}\n`;
      text += `ACT IV (ENDING): ${generatedPackage.storyStructure.ending}\n\n`;
    }

    text += `--- MASTER CHARACTER BIBLE ---\n`;
    generatedPackage.characters?.forEach(c => {
      text += `[${c.id || 'CHAR'}] NAME: ${c.name} (${c.role || 'Role'}, Age: ${c.age || 'N/A'}, Gender: ${c.gender || 'N/A'})\n`;
      text += `FACE: ${c.faceDescription || 'N/A'}\n`;
      text += `HAIR & EYES: Hair: ${c.hair || 'N/A'}, Eyes: ${c.eyes || 'N/A'}\n`;
      text += `SKIN & BUILD: Skin: ${c.skinTone || 'N/A'}, Height: ${c.height || 'N/A'}, Build: ${c.bodyType || 'N/A'}\n`;
      text += `COSTUME: ${c.costume || c.clothes || 'N/A'}\n`;
      text += `ACCESSORIES: ${c.accessories || 'N/A'}\n`;
      text += `EXPRESSIONS: ${c.expressions || 'N/A'}\n`;
      text += `PERSONALITY: ${c.personality}\n`;
      text += `VOICE: ${c.voice || 'N/A'}\n`;
      text += `NEGATIVE PROMPT: ${c.negativePrompt || 'N/A'}\n`;
      text += `CONSISTENCY PROMPT: ${c.characterConsistencyPrompt || 'N/A'}\n\n`;
    });

    text += `--- SCENE CARDS BREAKDOWN ---\n`;
    generatedPackage.scenes?.forEach(s => {
      text += `SCENE ${s.sceneNumber}: ${s.location || s.heading || 'SCENE'} (${s.time || ''} - ${s.duration})\n`;
      text += `SCENE GOAL: ${s.sceneGoal || 'N/A'}\n`;
      text += `VISUAL PROMPT: ${s.visualPrompt}\n`;
      text += `CHARACTER PROMPT: ${s.characterPrompt || 'N/A'}\n`;
      text += `CAMERA & LENS: ${s.cameraAngle || ''} ${s.cameraMovement || ''} | Lens: ${s.lens || 'N/A'}\n`;
      text += `LIGHTING: ${s.lighting}\n`;
      text += `ENVIRONMENT: ${s.environment || 'N/A'}\n`;
      text += `DIALOGUES:\n`;
      s.dialogues?.forEach(d => {
        text += `  - ${d.speaker.toUpperCase()} (${d.emotion}): "${d.lines}"\n`;
      });
      text += `VOICE EMOTION: ${s.voiceEmotion}\n`;
      text += `MUSIC: ${s.backgroundMusicPrompt || s.musicPrompt || 'N/A'}\n`;
      text += `SFX: ${s.soundEffectPrompt || s.sfxPrompt || 'N/A'}\n`;
      text += `NEGATIVE PROMPT: ${s.negativePrompt}\n\n`;
    });

    if (generatedPackage.imagePrompts) {
      text += `--- IMAGE GENERATION PROMPTS ---\n`;
      text += `GOOGLE IMAGEN 3: ${generatedPackage.imagePrompts.imagen}\n`;
      text += `FLUX PRO 1.1: ${generatedPackage.imagePrompts.flux}\n`;
      text += `MIDJOURNEY V6: ${generatedPackage.imagePrompts.midjourney}\n`;
      text += `STABLE DIFFUSION XL: ${generatedPackage.imagePrompts.sdxl}\n\n`;
    }

    if (generatedPackage.voicePackage) {
      text += `--- VOICE PACKAGE ---\n`;
      text += `VOICE STYLE: ${generatedPackage.voicePackage.voiceStyle}\n`;
      text += `EMOTION: ${generatedPackage.voicePackage.emotion}\n`;
      text += `SPEED: ${generatedPackage.voicePackage.speakingSpeed}\n`;
      text += `ACCENT: ${generatedPackage.voicePackage.accent}\n\n`;
    }

    if (generatedPackage.socialMediaPackage) {
      text += `--- SOCIAL MEDIA & DISTRIBUTION PACKAGE ---\n`;
      text += `YOUTUBE TITLE: ${generatedPackage.socialMediaPackage.youtubeTitle}\n`;
      text += `SEO DESCRIPTION: ${generatedPackage.socialMediaPackage.seoDescription}\n`;
      text += `INSTAGRAM CAPTION: ${generatedPackage.socialMediaPackage.instagramCaption}\n`;
      text += `FACEBOOK CAPTION: ${generatedPackage.socialMediaPackage.facebookCaption}\n`;
      text += `HASHTAGS: ${generatedPackage.socialMediaPackage.hashtags?.join(' ')}\n\n`;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_ProductionPackage.txt`;
    a.click();
  };

  const handleExportMarkdown = () => {
    if (!generatedPackage) return;
    let md = `# 🎬 ${generatedPackage.title}\n\n`;
    md += `**Genre:** ${generatedPackage.genre} | **Language:** ${generatedPackage.language} | **Duration:** ${generatedPackage.duration} | **Format:** ${generatedPackage.aspectRatio}\n`;
    md += `**Mood:** ${generatedPackage.mood || 'N/A'} | **Target Audience:** ${generatedPackage.targetAudience || 'N/A'}\n\n`;
    md += `## 📖 Short Synopsis\n${generatedPackage.synopsis}\n\n`;

    if (generatedPackage.storyStructure) {
      md += `## 🎭 Story Structure (Four-Act Drama)\n`;
      md += `- **Act I (Beginning):** ${generatedPackage.storyStructure.beginning}\n`;
      md += `- **Act II (Conflict):** ${generatedPackage.storyStructure.conflict}\n`;
      md += `- **Act III (Climax):** ${generatedPackage.storyStructure.climax}\n`;
      md += `- **Act IV (Ending):** ${generatedPackage.storyStructure.ending}\n\n`;
    }

    md += `## 👥 Master Character Bible\n`;
    generatedPackage.characters?.forEach(c => {
      md += `### ${c.name} [${c.id || 'CHAR'}] - ${c.role || 'Role'} (${c.gender || ''}, ${c.age || ''})\n`;
      md += `- **Face Description:** ${c.faceDescription || c.appearance || 'N/A'}\n`;
      md += `- **Hair & Eyes:** Hair: ${c.hair || 'N/A'}, Eyes: ${c.eyes || 'N/A'}\n`;
      md += `- **Skin Tone & Build:** Skin: ${c.skinTone || 'N/A'}, Height: ${c.height || 'N/A'}, Build: ${c.bodyType || 'N/A'}\n`;
      md += `- **Costume & Wardrobe:** ${c.costume || c.clothes || 'N/A'}\n`;
      md += `- **Accessories:** ${c.accessories || 'N/A'}\n`;
      md += `- **Expressions:** ${c.expressions || 'N/A'}\n`;
      md += `- **Personality:** ${c.personality}\n`;
      md += `- **Voice:** ${c.voice || 'N/A'}\n`;
      md += `- **Negative Prompt:** \`${c.negativePrompt || 'N/A'}\` \n`;
      md += `- **Consistency Prompt:** \`${c.characterConsistencyPrompt || 'N/A'}\` \n\n`;
    });

    md += `## 🎥 Scene Cards Breakdown\n`;
    generatedPackage.scenes?.forEach(s => {
      md += `### Scene ${s.sceneNumber}: ${s.location || s.heading || 'SCENE'} (${s.duration})\n`;
      md += `- **Scene Goal:** ${s.sceneGoal || 'N/A'}\n`;
      md += `- **Visual Prompt:** \`${s.visualPrompt}\` \n`;
      md += `- **Character Prompt:** \`${s.characterPrompt || 'N/A'}\` \n`;
      md += `- **Camera & Lens:** ${s.cameraAngle || ''} - ${s.cameraMovement || ''} | Lens: ${s.lens || 'N/A'}\n`;
      md += `- **Lighting:** ${s.lighting}\n`;
      md += `- **Environment:** ${s.environment || 'N/A'}\n`;
      md += `\n#### Dialogues:\n`;
      s.dialogues?.forEach(d => {
        md += `> **${d.speaker}** *(${d.emotion})*: "${d.lines}"\n\n`;
      });
      md += `- **Voice Emotion:** ${s.voiceEmotion}\n`;
      md += `- **Music Prompt:** ${s.backgroundMusicPrompt || s.musicPrompt || 'N/A'}\n`;
      md += `- **SFX Prompt:** ${s.soundEffectPrompt || s.sfxPrompt || 'N/A'}\n`;
      md += `- **Negative Prompt:** \`${s.negativePrompt}\` \n\n`;
    });

    if (generatedPackage.imagePrompts) {
      md += `## 🎨 Image Generation Prompts\n`;
      md += `- **Google Imagen 3:** \`${generatedPackage.imagePrompts.imagen}\` \n`;
      md += `- **Flux Pro 1.1:** \`${generatedPackage.imagePrompts.flux}\` \n`;
      md += `- **Midjourney v6:** \`${generatedPackage.imagePrompts.midjourney}\` \n`;
      md += `- **Stable Diffusion XL:** \`${generatedPackage.imagePrompts.sdxl}\` \n\n`;
    }

    if (generatedPackage.voicePackage) {
      md += `## 🎙️ Voice Package\n`;
      md += `- **Voice Style:** ${generatedPackage.voicePackage.voiceStyle}\n`;
      md += `- **Emotion:** ${generatedPackage.voicePackage.emotion}\n`;
      md += `- **Speaking Speed:** ${generatedPackage.voicePackage.speakingSpeed}\n`;
      md += `- **Accent:** ${generatedPackage.voicePackage.accent}\n\n`;
    }

    if (generatedPackage.socialMediaPackage) {
      md += `## 📲 Social Media & Distribution Package\n`;
      md += `- **YouTube Title:** ${generatedPackage.socialMediaPackage.youtubeTitle}\n`;
      md += `- **SEO Description:** ${generatedPackage.socialMediaPackage.seoDescription}\n`;
      md += `- **Instagram Caption:** ${generatedPackage.socialMediaPackage.instagramCaption}\n`;
      md += `- **Facebook Caption:** ${generatedPackage.socialMediaPackage.facebookCaption}\n`;
      md += `- **Hashtags:** ${generatedPackage.socialMediaPackage.hashtags?.join(' ')}\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_Studio.md`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDownloadSRT = () => {
    if (!generatedPackage?.subtitlesSrt) return;
    const blob = new Blob([generatedPackage.subtitlesSrt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_Subtitles.srt`;
    a.click();
  };

  const handleDownloadImagePromptsJSON = () => {
    if (!generatedPackage) return;
    const payload = {
      projectTitle: generatedPackage.title,
      globalImagePrompts: generatedPackage.imagePrompts,
      sceneImagePrompts: generatedPackage.scenes?.map(s => ({
        sceneNumber: s.sceneNumber,
        location: s.location || s.heading,
        masterVisualPrompt: s.visualPrompt,
        characterPrompt: s.characterPrompt,
        cameraComposition: `${s.cameraAngle || 'Wide Tracking'} - ${s.cameraMovement || 'Dolly'}`,
        lens: s.lens || '35mm Anamorphic',
        lighting: s.lighting,
        colorPalette: 'High contrast cinematic dual-tone',
        negativePrompt: s.negativePrompt,
        characterConsistencyReferences: generatedPackage.characters?.map(c => c.id || c.name)
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_ImagePrompts.json`;
    a.click();
  };

  const handleDownloadVideoPromptsJSON = () => {
    if (!generatedPackage) return;
    const payload = {
      projectTitle: generatedPackage.title,
      aspectRatio: generatedPackage.aspectRatio,
      compatibleModels: ['Google Veo', 'Runway Gen-3 Alpha', 'Luma Dream Machine', 'OpenAI Sora'],
      videoPrompts: generatedPackage.videoPrompts || generatedPackage.scenes?.map(s => ({
        sceneNumber: s.sceneNumber,
        model: 'Google Veo / Runway Gen-3',
        sceneMotion: s.visualPrompt,
        cameraMovement: s.cameraMovement || 'Smooth Tracking Dolly Shot',
        subjectMovement: 'Natural cinematic character action',
        environmentMotion: 'Ambient lighting atmosphere and atmospheric dust particles',
        lightingAnimation: s.lighting,
        transition: 'Cut to next scene beat',
        mood: generatedPackage.mood || 'Cinematic',
        duration: s.duration,
        promptText: `4K cinematic film scene. ${s.visualPrompt}. Camera: ${s.cameraAngle || 'Eye level'}, ${s.cameraMovement || 'Slow dolly'}. Lens: ${s.lens || '35mm'}. Lighting: ${s.lighting}. 60fps high quality.`
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_VideoPrompts.json`;
    a.click();
  };

  const handleDownloadMusicPromptsJSON = () => {
    if (!generatedPackage) return;
    const payload = {
      projectTitle: generatedPackage.title,
      overallMood: generatedPackage.mood || 'Cinematic Tension',
      sceneMusicCues: generatedPackage.scenes?.map(s => ({
        sceneNumber: s.sceneNumber,
        location: s.location || s.heading,
        backgroundMusicPrompt: s.backgroundMusicPrompt || s.musicPrompt,
        soundEffectPrompt: s.soundEffectPrompt || s.sfxPrompt,
        mood: generatedPackage.mood || 'Dramatic',
        suggestedTempo: '110 BPM',
        suggestedInstruments: 'Synthesizer pads, orchestral strings, bass drone, sub-bass pulse',
        aiMusicFormatSuno: `[Cinematic ${generatedPackage.genre}] ${s.backgroundMusicPrompt || s.musicPrompt}. Tension building, atmospheric instrumentation, 110 BPM.`,
        aiMusicFormatUdio: `${s.backgroundMusicPrompt || s.musicPrompt}, film soundtrack, orchestral, high drama`
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPackage.title.replace(/\s+/g, '_')}_MusicPackage.json`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-24 text-slate-100">
      
      {/* 🎬 HERO SECTION */}
      <div className="flex flex-col items-center text-center gap-4 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide shadow-lg shadow-emerald-950/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ONE CLICK AI MOVIE PRODUCTION PIPELINE V5</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          🎬 CineAI CreatorOS V5
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
          One Prompt → Complete Production Package. Master Character Consistency Engine, 4-Act Story Structure, 8K Image & Video Prompts, Voice Direction, Audio & Distribution Suite.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs text-slate-400 font-medium pt-1">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-emerald-400" /> YouTube Shorts
          </span>
          <span>•</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-emerald-400" /> Instagram Reels
          </span>
          <span>•</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Facebook Videos
          </span>
          <span>•</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-emerald-400" /> 16:9 Cinema
          </span>
        </div>
      </div>

      {/* 📊 PREMIUM DASHBOARD WIDGETS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Total Projects</span>
            <Film className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {projectHistory.length > 0 ? projectHistory.length : 1}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">● Studio History Sync</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Episodes Generated</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {(projectHistory.length * 3 + 12)}
          </div>
          <span className="text-[10px] text-amber-400 font-medium">● Production Ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>AI Tokens Used</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            142.5K
          </div>
          <span className="text-[10px] text-cyan-400 font-medium">Gemini 3.6 Flash</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Avg Gen Speed</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            14.2s
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">High Speed Parallel</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col gap-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span>Export Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-heading mt-1">
            100%
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Zero Render Errors</span>
        </div>
      </div>

      {/* 🎬 PRODUCTION TIMELINE PIPELINE BAR */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Production Timeline Pipeline</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Click any node to navigate active workspace module</span>
        </div>

        <div className="flex items-center justify-between overflow-x-auto pb-2 pt-1 gap-2 scrollbar-thin">
          {[
            { id: 'overview', label: 'Idea', icon: Lightbulb },
            { id: 'story', label: 'Story', icon: BookOpen },
            { id: 'screenplay', label: 'Screenplay', icon: FileText },
            { id: 'characters', label: 'Characters', icon: Users },
            { id: 'scenes', label: 'Camera', icon: Video },
            { id: 'images', label: 'Prompts', icon: Image },
            { id: 'voice', label: 'Voice', icon: Mic },
            { id: 'export', label: 'Export', icon: Download }
          ].map((stepNode, idx, arr) => {
            const Icon = stepNode.icon;
            const isActive = activeOutputTab === stepNode.id;
            const isCompleted = !!generatedPackage;

            return (
              <React.Fragment key={stepNode.id}>
                <button
                  onClick={() => {
                    if (generatedPackage) setActiveOutputTab(stepNode.id as any);
                  }}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border
                    ${isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                      : isCompleted
                        ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{stepNode.label}</span>
                  {isCompleted && !isActive && <Check className="w-3 h-3 text-emerald-400" />}
                </button>
                {idx < arr.length - 1 && (
                  <div className={`h-0.5 w-3 sm:w-6 shrink-0 ${isCompleted ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ✍️ MASSIVE PREMIUM PROMPT EDITOR & PROMPT TEMPLATES */}
      <div className="flex flex-col gap-4">
        {/* Prompt Category Template Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Prompt Templates:
          </span>
          {Object.keys(PROMPT_TEMPLATES_BY_CATEGORY).map((cat) => (
            <button
              key={cat}
              onClick={() => setPromptCategoryFilter(cat)}
              className={`
                px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer
                ${promptCategoryFilter === cat 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative group rounded-[24px] bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-1 shadow-2xl transition-all duration-300 focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/10">
          <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-amber-500/20 opacity-30 blur-xl pointer-events-none group-focus-within:opacity-70 transition-opacity" />
          
          <div className="relative z-10 flex flex-col min-h-[220px] p-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your movie idea..."
              className="w-full h-36 bg-transparent text-slate-100 placeholder-slate-500 text-base sm:text-lg font-medium resize-none focus:outline-none leading-relaxed"
            />

            <div className="mt-auto pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 1-Click {promptCategoryFilter} Templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {(PROMPT_TEMPLATES_BY_CATEGORY[promptCategoryFilter] || EXAMPLE_PROMPTS).map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(ex);
                      setSelectedGenre(promptCategoryFilter);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-amber-500/20 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-colors text-left line-clamp-1 max-w-xs cursor-pointer font-medium"
                    title={ex}
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🎛️ PREMIUM CONTROLS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Language */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Genre</span>
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Episode Length */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>Episode Length</span>
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {DURATIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aspect Ratio</span>
            </label>
            <select
              value={selectedAspectRatio}
              onChange={(e) => setSelectedAspectRatio(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {ASPECT_RATIOS.map(ar => (
                <option key={ar} value={ar}>{ar}</option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform</span>
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 📋 OUTPUT OPTIONS */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Production Package Output Options</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectAllOptions(true)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => handleSelectAllOptions(false)}
                className="text-[11px] text-slate-400 hover:text-slate-300 font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 'story', label: 'Story' },
              { id: 'screenplay', label: 'Screenplay' },
              { id: 'sceneBreakdown', label: 'Scene Breakdown' },
              { id: 'characterBible', label: 'Character Bible' },
              { id: 'imagePrompts', label: 'Image Prompts' },
              { id: 'cameraDirections', label: 'Camera' },
              { id: 'lighting', label: 'Lighting' },
              { id: 'voiceDialogue', label: 'Voice Dialogue' },
              { id: 'voiceEmotion', label: 'Voice Emotion' },
              { id: 'backgroundMusicPrompt', label: 'Music Prompt' },
              { id: 'soundEffects', label: 'Sound Effects' },
              { id: 'subtitleFile', label: 'Subtitle File' },
              { id: 'thumbnailPrompt', label: 'Thumbnail' },
              { id: 'seoTitle', label: 'SEO Title' },
              { id: 'seoDescription', label: 'SEO Description' },
              { id: 'hashtags', label: 'Hashtags' }
            ].map((opt) => {
              const isChecked = !!outputOptions[opt.id];
              return (
                <button
                  key={opt.id}
                  onClick={() => handleToggleOption(opt.id)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold border transition-all text-left justify-between
                    ${isChecked
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                    }
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ⚠️ BEAUTIFUL ERROR CARD UI */}
        <AnimatePresence>
          {errorState && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl bg-rose-950/50 border border-rose-500/40 flex flex-col gap-4 shadow-2xl backdrop-blur-xl relative overflow-hidden my-4"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
                    {errorState.type === 'INVALID_API_KEY' ? <Key className="w-6 h-6" /> :
                     errorState.type === 'RATE_LIMIT' ? <Gauge className="w-6 h-6" /> :
                     errorState.type === 'TIMEOUT' ? <Clock className="w-6 h-6" /> :
                     errorState.type === 'NETWORK_ERROR' ? <WifiOff className="w-6 h-6" /> :
                     errorState.type === 'EMPTY_PROMPT' ? <Edit3 className="w-6 h-6" /> :
                     <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-[10px] uppercase tracking-wider">
                        ERROR: {errorState.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{errorState.title}</h3>
                    <p className="text-xs text-rose-200/90 leading-relaxed">{errorState.message}</p>
                    {errorState.detail && (
                      <p className="text-[11px] font-mono text-rose-400/80 bg-slate-950/80 p-2.5 rounded-xl border border-rose-900/50 mt-1">
                        {errorState.detail}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setErrorState(null)}
                  className="text-xs text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-rose-900/40">
                <button
                  onClick={() => setErrorState(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Generation</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✨ HUGE MAIN BUTTON */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`
              relative group overflow-hidden w-full sm:w-auto px-10 py-5 rounded-2xl font-heading font-extrabold text-base sm:text-lg tracking-tight
              bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/30
              hover:shadow-emerald-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Executing 9-Step Production Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>✨ Generate Complete AI Episode</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* 🚀 REAL ANIMATED PROGRESS PIPELINE (12 STEPS) */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-6 rounded-3xl bg-slate-900/95 border border-emerald-500/40 flex flex-col gap-5 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>CineAI V10 Production Engine</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                        Step {loadingStep + 1} of {PIPELINE_STEPS.length}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">Tokens: ~{(loadingStep + 1) * 15400}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">Latency: 124ms</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">Queue: Active</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar & Est Time */}
                <div className="w-full sm:w-56 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Est. {remainingSeconds}s remaining</span>
                    </span>
                    <span className="text-emerald-400">{Math.round(((loadingStep + 1) / PIPELINE_STEPS.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 ease-out"
                      style={{ width: `${((loadingStep + 1) / PIPELINE_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Step Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PIPELINE_STEPS.map((s, idx) => {
                  const isDone = idx < loadingStep;
                  const isCurrent = idx === loadingStep;
                  return (
                    <div
                      key={s.step}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border text-xs transition-all
                        ${isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                          : isCurrent 
                            ? 'bg-slate-800 border-emerald-500 text-white shadow-lg shadow-emerald-950/50' 
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600'
                        }
                      `}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">
                            ✓
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 font-semibold flex items-center justify-center text-[10px]">
                            {s.step}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className={`font-bold truncate ${isCurrent ? 'text-emerald-400' : ''}`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Production Terminal Log Stream */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 text-slate-500 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Live AI Production Logs</span>
                  </span>
                  <span>Gemini 3.6 Flash Engine</span>
                </div>
                {productionLogs.map((log) => (
                  <div key={log.id} className="text-slate-300 flex items-start gap-2">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className="text-emerald-400/90">{log.text}</span>
                  </div>
                ))}
              </div>

              {/* ROTATING AI PRODUCTION TIP */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span className="leading-relaxed">{ROTATING_AI_TIPS[currentTipIndex]}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 PREMIUM EMPTY STATE WHEN NO PROJECT GENERATED */}
        {!generatedPackage && !isGenerating && (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center flex flex-col items-center gap-4 my-2 shadow-xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Clapperboard className="w-8 h-8 animate-pulse" />
            </div>
            <div className="max-w-md flex flex-col gap-1">
              <h3 className="text-xl font-bold text-white font-heading">Create Your First AI Movie Package</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your movie premise above or choose a preset prompt template, then click <strong>Generate Complete AI Episode</strong> to generate 4-Act Screenplay, Character Bible, 8K Image & Video Prompts, Voice Directions & Distribution Files.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                'Sci-Fi Heist in Neo-Tokyo',
                'Cyberpunk Detective Thriller',
                'Epic Mythological Fantasy',
                'Mumbai Underworld Syndicate'
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(preset);
                    setSelectedGenre(i % 2 === 0 ? 'Sci-Fi' : 'Crime');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 AFTER GENERATION: V7 THREE PANEL WORKSPACE */}
      <AnimatePresence>
        {generatedPackage && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 pt-6 border-t border-slate-800 items-start w-full relative"
          >
            {/* LEFT PANEL: PROJECTS, CHARACTERS, ASSETS */}
            <LeftQuickPanel
              isOpen={isLeftPanelOpen}
              onToggle={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              projects={projectHistory.map(p => ({
                id: p.id || p.title,
                title: p.title,
                logline: p.synopsis || p.title,
                genre: p.genre || 'Sci-Fi',
                format: 'Feature Film',
                episodes: [p as any]
              }))}
              activeProject={activeProject}
              onSelectProject={(proj) => {
                setActiveProject(proj);
                if (proj.episodes?.[0]) setGeneratedPackage(proj.episodes[0]);
              }}
              characters={generatedPackage?.characters}
            />

            {/* CENTER AI MOVIE WORKSPACE */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
            {/* EXPORT HEADER BAR */}
            <div className={`sticky top-16 z-30 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-6 bg-slate-950' : ''}`}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                      CineAI V10 Operating System
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Generated {generatedPackage.timestamp || 'Just now'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {generatedPackage.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {generatedPackage.language}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {generatedPackage.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {generatedPackage.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white truncate max-w-md">{generatedPackage.title}</h2>
                    <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      Built with ❤️ by SHUBHAM MALANDE
                    </span>
                  </div>
                </div>
              </div>

              {/* SEARCH & QUICK ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                {/* Search Bar inside Workspace */}
                <div className="relative flex-1 lg:flex-initial min-w-[160px] sm:min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search characters, scenes..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <button
                  onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${isLeftPanelOpen ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                  title="Toggle Left Projects & Assets Panel"
                >
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Left Panel</span>
                </button>

                <button
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${isRightPanelOpen ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                  title="Toggle AI Director Copilot"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Copilot</span>
                </button>

                <button
                  onClick={() => setShowJsonViewer(!showJsonViewer)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${showJsonViewer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'}`}
                  title="Toggle raw JSON inspector"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showJsonViewer ? 'Hide JSON' : 'Raw JSON'}</span>
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Fullscreen Mode"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleExportZIP}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download One-Click Production ZIP Package"
                >
                  <FolderDown className="w-3.5 h-3.5" />
                  <span>ZIP Package</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* 🎬 PRODUCTION TIMELINE STAGE PIPELINE (1-CLICK WORKSPACE SWITCHING) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5" />
                  <span>Production Timeline Stages (1-Click Workspace Navigation)</span>
                </span>
                <span className="text-slate-500 font-normal hidden sm:inline">Idea → Story → Screenplay → Characters → Camera → Prompts → Export</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { stage: '1. Idea', tab: 'overview', icon: Lightbulb, desc: 'Premise & Setup' },
                  { stage: '2. Story', tab: 'story', icon: Clapperboard, desc: '4-Act Narrative' },
                  { stage: '3. Screenplay', tab: 'screenplay', icon: FileText, desc: 'Script & Dialogue' },
                  { stage: '4. Characters', tab: 'characters', icon: Users, desc: 'Character Bible' },
                  { stage: '5. Camera', tab: 'storyboard', icon: Camera, desc: 'Visual Keyframes' },
                  { stage: '6. Prompts', tab: 'prompts', icon: Wand2, desc: '8K Generation' },
                  { stage: '7. Export', tab: 'export', icon: Download, desc: 'ZIP / PDF Center' },
                ].map((st) => {
                  const Icon = st.icon;
                  const isCurrent = activeOutputTab === st.tab;
                  return (
                    <button
                      key={st.stage}
                      onClick={() => setActiveOutputTab(st.tab as any)}
                      className={`
                        p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer text-left
                        ${isCurrent
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/40'
                          : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] font-bold font-heading">{st.stage}</span>
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono truncate">{st.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 🎯 WORKSPACE TABS (V8 ALL TABS) */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'story', label: 'Story', icon: Clapperboard },
                { id: 'screenplay', label: 'Screenplay', icon: FileText },
                { id: 'timeline', label: 'Timeline Editor', icon: Film },
                { id: 'storyboard', label: 'Storyboard', icon: Camera },
                { id: 'characters', label: 'Character Bible', icon: Users },
                { id: 'relationships', label: 'Relationship Map', icon: GitFork },
                { id: 'calendar', label: 'Production Calendar', icon: Calendar },
                { id: 'team', label: 'Team Workspace', icon: Users },
                { id: 'quality', label: 'AI Quality Score', icon: Award },
                { id: 'cost', label: 'Cost Estimator', icon: Calculator },
                { id: 'scenes', label: 'Scenes', icon: Layers },
                { id: 'prompts', label: 'Prompt Lab', icon: Wand2 },
                { id: 'assets', label: 'Asset Library', icon: FolderDown },
                { id: 'images', label: 'Image Prompts', icon: ImageIcon },
                { id: 'videos', label: 'Video Prompts', icon: Video },
                { id: 'voice', label: 'Voice Package', icon: Mic },
                { id: 'music', label: 'Music Package', icon: Music },
                { id: 'thumbnail', label: 'Thumbnail', icon: Sparkles },
                { id: 'seo', label: 'SEO Package', icon: Globe },
                { id: 'export', label: 'Export Center', icon: Download },
                { id: 'history', label: `Version History (${projectHistory.length})`, icon: History },
                { id: 'performance', label: 'Performance', icon: Gauge }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeOutputTab === tab.id || (tab.id === 'videos' && activeOutputTab === 'video-prompts') || (tab.id === 'export' && activeOutputTab === 'exports');
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOutputTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer
                      ${isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* -------------------- TAB 1: OVERVIEW -------------------- */}
            {activeOutputTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-4 shadow-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {generatedPackage.genre}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      {generatedPackage.language}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      {generatedPackage.duration}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      {generatedPackage.aspectRatio}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      {generatedPackage.platform}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                    {generatedPackage.title}
                  </h2>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-1">
                    <span className="font-bold text-slate-400 uppercase text-xs">Premise & Short Synopsis:</span>
                    <p className="text-sm text-slate-200 leading-relaxed">{generatedPackage.synopsis}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Atmosphere & Mood:</span>
                      <p className="text-slate-200 font-medium">{generatedPackage.mood || 'High-octane, Tense, Cinematic'}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Target Audience:</span>
                      <p className="text-slate-200 font-medium">{generatedPackage.targetAudience || 'Cinematic Short Film & OTT Viewers'}</p>
                    </div>
                  </div>
                </div>

                {/* 4-Act Story Structure */}
                {generatedPackage.storyStructure && (
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-4 shadow-xl">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                      <Clapperboard className="w-4 h-4" />
                      <span>Four-Act Narrative Structure</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1">
                        <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">Act I: Beginning</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.storyStructure.beginning}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1">
                        <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">Act II: Conflict</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.storyStructure.conflict}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1">
                        <span className="text-rose-400 font-bold uppercase text-[10px] tracking-wider">Act III: Climax</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.storyStructure.climax}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1">
                        <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider">Act IV: Ending</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.storyStructure.ending}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thumbnail Visual Prompt Box */}
                {(generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt) && (
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Thumbnail AI Visual Poster Prompt</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || '', 'thumb-overview')}
                        className="text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        {copiedSection === 'thumb-overview' ? 'Copied Prompt' : 'Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                      {generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 2: STORY -------------------- */}
            {activeOutputTab === 'story' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Narrative Arc & Screenplay Structure</h3>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-4 shadow-xl">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Logline & Core Premise</h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {generatedPackage.synopsis}
                  </p>
                </div>

                {generatedPackage.storyStructure && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
                        <span>Act I: The Inciting Setup</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2">{generatedPackage.storyStructure.beginning}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                        <span>Act II: Conflict & Escalation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2">{generatedPackage.storyStructure.conflict}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs">3</span>
                        <span>Act III: Climax & Turning Point</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2">{generatedPackage.storyStructure.climax}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">4</span>
                        <span>Act IV: Resolution & Ending</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2">{generatedPackage.storyStructure.ending}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 3: SCREENPLAY -------------------- */}
            {activeOutputTab === 'screenplay' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white">Full Screenplay Script</h3>
                      <p className="text-xs text-slate-400">Industry standard scene headers, stage directions, and formatted dialogues</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(
                        generatedPackage.scenes?.map(s => `SCENE ${s.sceneNumber}: ${(s.location || s.heading || 'INT. LOCATION').toUpperCase()}\n${s.visualPrompt}\n\n` + s.dialogues?.map(d => `\t\t${d.speaker.toUpperCase()}\n\t(${d.emotion})\n\t${d.lines}`).join('\n\n')).join('\n\n-----------------------------------------\n\n') || '',
                        'screenplay-copy'
                      )}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{copiedSection === 'screenplay-copy' ? 'Copied Screenplay' : 'Copy Screenplay'}</span>
                    </button>
                    <button
                      onClick={handleExportTXT}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download TXT</span>
                    </button>
                  </div>
                </div>

                {/* Screenplay Content Canvas */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800/90 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed shadow-2xl flex flex-col gap-8 max-h-[75vh] overflow-y-auto">
                  <div className="text-center pb-6 border-b border-slate-800/80 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold uppercase tracking-wider text-emerald-400">{generatedPackage.title}</h2>
                    <p className="text-slate-400 text-xs">{generatedPackage.genre} | {generatedPackage.language} | {generatedPackage.duration}</p>
                    <p className="text-slate-500 text-[10px]">Written & Synthesized by CineAI CreatorOS V10</p>
                  </div>

                  {generatedPackage.scenes?.map((s) => (
                    <div key={s.sceneNumber} className="flex flex-col gap-4 border-b border-slate-900 pb-8 last:border-none">
                      <div className="text-emerald-400 font-bold uppercase tracking-wider text-sm flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <span>SCENE #{s.sceneNumber}: ${(s.location || s.heading || 'INT. LOCATION').toUpperCase()}</span>
                        <span className="text-slate-500 text-xs font-normal">[{s.cameraAngle || 'Eye Level'}]</span>
                      </div>

                      <p className="text-slate-300 italic pl-2 border-l-2 border-slate-800 leading-relaxed">
                        {s.visualPrompt}
                      </p>

                      {s.dialogues?.map((d, dIdx) => (
                        <div key={dIdx} className="flex flex-col items-center my-2 max-w-lg mx-auto text-center w-full">
                          <span className="font-bold text-amber-300 tracking-wider text-xs">{d.speaker.toUpperCase()}</span>
                          {d.emotion && <span className="text-slate-500 text-[11px] italic">({d.emotion})</span>}
                          <p className="text-slate-100 font-sans text-sm mt-1 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800/60 w-full">
                            "{d.lines}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 4: MOVIE TIMELINE EDITOR -------------------- */}
            {activeOutputTab === 'timeline' && (
              <MovieTimelineEditor
                generatedPackage={generatedPackage}
                onUpdatePackage={setGeneratedPackage}
              />
            )}

            {/* -------------------- TAB 5: STORYBOARD VIEWER -------------------- */}
            {activeOutputTab === 'storyboard' && (
              <StoryboardViewer
                generatedPackage={generatedPackage}
                onUpdatePackage={setGeneratedPackage}
              />
            )}

            {/* -------------------- TAB 6: CHARACTERS (CHARACTER BIBLE STUDIO) -------------------- */}
            {activeOutputTab === 'characters' && (
              <CharacterBibleStudio
                characters={generatedPackage?.characters}
                onUpdateCharacters={(updated) => setGeneratedPackage({ ...generatedPackage, characters: updated })}
              />
            )}

            {/* -------------------- TAB 7: CHARACTER RELATIONSHIP MAP -------------------- */}
            {activeOutputTab === 'relationships' && (
              <CharacterRelationshipMap characters={generatedPackage?.characters} />
            )}

            {/* -------------------- TAB 8: PRODUCTION CALENDAR -------------------- */}
            {activeOutputTab === 'calendar' && (
              <ProductionCalendar generatedPackage={generatedPackage} />
            )}

            {/* -------------------- TAB 9: TEAM WORKSPACE -------------------- */}
            {activeOutputTab === 'team' && (
              <TeamWorkspace />
            )}

            {/* -------------------- TAB 10: AI QUALITY SCORE -------------------- */}
            {activeOutputTab === 'quality' && (
              <AIQualityScore generatedPackage={generatedPackage} />
            )}

            {/* -------------------- TAB 11: PRODUCTION COST ESTIMATOR -------------------- */}
            {activeOutputTab === 'cost' && (
              <ProductionCostEstimator generatedPackage={generatedPackage} />
            )}

            {/* -------------------- TAB 6: PROMPT ENGINEERING STUDIO -------------------- */}
            {activeOutputTab === 'prompts' && (
              <PromptEngineeringStudio
                generatedPackage={generatedPackage}
                onUpdatePackage={setGeneratedPackage}
              />
            )}

            {/* -------------------- TAB 7: ASSET MANAGER -------------------- */}
            {activeOutputTab === 'assets' && (
              <AssetManagerView generatedPackage={generatedPackage} />
            )}

            {/* -------------------- TAB 12: EXPORT CENTER -------------------- */}
            {(activeOutputTab === 'export' || activeOutputTab === 'exports') && (
              <ExportCenterView generatedPackage={generatedPackage} />
            )}

            {/* -------------------- TAB 13: VERSION HISTORY -------------------- */}
            {activeOutputTab === 'history' && (
              <VersionHistoryStudio
                currentPackage={generatedPackage}
                onRestoreVersion={(restored) => setGeneratedPackage(restored)}
              />
            )}

            {/* -------------------- TAB 14: PERFORMANCE MONITOR -------------------- */}
            {activeOutputTab === 'performance' && (
              <PerformanceMonitorWidget />
            )}

            {/* -------------------- TAB 4: SCENES (SCENE CARDS) -------------------- */}
            {activeOutputTab === 'scenes' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Cinematic Scene Cards Breakdown</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    {generatedPackage.scenes?.length || 0} Scenes Total
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {generatedPackage.scenes?.map((scene) => (
                    <div key={scene.sceneNumber} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-5 shadow-2xl">
                      {/* Scene Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                            #{scene.sceneNumber}
                          </span>
                          <h4 className="text-base font-bold text-white font-mono tracking-tight">
                            {scene.location || scene.heading || `SCENE ${scene.sceneNumber}`} {scene.time ? `- ${scene.time}` : ''}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                            Duration: {scene.duration}
                          </span>
                          <button
                            onClick={() => handleCopyText(JSON.stringify(scene, null, 2), `scene-card-${scene.sceneNumber}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3 text-emerald-400" />
                            <span>{copiedSection === `scene-card-${scene.sceneNumber}` ? 'Copied Scene' : 'Copy Scene'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Scene Goal */}
                      {scene.sceneGoal && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                          <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-1">Scene Goal:</span>
                          <p className="text-slate-200">{scene.sceneGoal}</p>
                        </div>
                      )}

                      {/* Visual & Camera Prompts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Visual Prompt
                            </span>
                            <button 
                              onClick={() => handleCopyText(scene.visualPrompt, `sc-${scene.sceneNumber}-vis`)}
                              className="text-[10px] text-slate-400 hover:text-white"
                            >
                              {copiedSection === `sc-${scene.sceneNumber}-vis` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{scene.visualPrompt}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5" /> Camera & Lens Cues
                            </span>
                          </div>
                          <p className="text-slate-200 text-[11px]">
                            <strong>Angle:</strong> {scene.cameraAngle || 'Wide Tracking'} | <strong>Movement:</strong> {scene.cameraMovement || 'Parallel Dolly'}
                          </p>
                          <p className="text-slate-300 font-mono text-[11px]">
                            <strong>Lens:</strong> {scene.lens || '35mm Anamorphic'}
                          </p>
                        </div>
                      </div>

                      {/* Lighting & Environment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Lighting Setup:</span>
                          <p className="text-slate-300">{scene.lighting}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Environment Details:</span>
                          <p className="text-slate-300">{scene.environment || scene.location}</p>
                        </div>
                      </div>

                      {/* Dialogues */}
                      {scene.dialogues && scene.dialogues.length > 0 && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5" /> Scene Dialogues
                          </span>
                          <div className="flex flex-col gap-2">
                            {scene.dialogues.map((d, dIdx) => (
                              <div key={dIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex flex-col gap-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white uppercase text-[11px]">{d.speaker}</span>
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">{d.emotion}</span>
                                </div>
                                <p className="text-slate-200 italic">"{d.lines}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audio & Music */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-purple-400 font-bold uppercase text-[10px] block mb-1">Background Music Prompt:</span>
                          <p className="text-slate-300 text-[11px] font-mono">{scene.backgroundMusicPrompt || scene.musicPrompt}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-teal-400 font-bold uppercase text-[10px] block mb-1">Sound Effects (SFX):</span>
                          <p className="text-slate-300 text-[11px] font-mono">{scene.soundEffectPrompt || scene.sfxPrompt}</p>
                        </div>
                      </div>

                      {/* Negative Prompt */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-rose-400 font-bold uppercase text-[10px] block mb-1">Negative Prompt:</span>
                        <p className="text-slate-400 font-mono text-[11px]">{scene.negativePrompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 5: IMAGES -------------------- */}
            {activeOutputTab === 'images' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Multi-Engine Image Generation Studio</h3>
                  </div>
                  <button
                    onClick={handleDownloadImagePromptsJSON}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Prompts JSON</span>
                  </button>
                </div>

                {generatedPackage.imagePrompts && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase">
                        <span>Google Imagen 3</span>
                        <button onClick={() => handleCopyText(generatedPackage.imagePrompts?.imagen || '', 'img-imagen')} className="hover:underline cursor-pointer">
                          {copiedSection === 'img-imagen' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {generatedPackage.imagePrompts.imagen}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase">
                        <span>Flux Pro 1.1</span>
                        <button onClick={() => handleCopyText(generatedPackage.imagePrompts?.flux || '', 'img-flux')} className="hover:underline cursor-pointer">
                          {copiedSection === 'img-flux' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {generatedPackage.imagePrompts.flux}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase">
                        <span>Midjourney v6</span>
                        <button onClick={() => handleCopyText(generatedPackage.imagePrompts?.midjourney || '', 'img-mj')} className="hover:underline cursor-pointer">
                          {copiedSection === 'img-mj' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {generatedPackage.imagePrompts.midjourney}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-400 uppercase">
                        <span>Stable Diffusion XL (SDXL)</span>
                        <button onClick={() => handleCopyText(generatedPackage.imagePrompts?.sdxl || '', 'img-sdxl')} className="hover:underline cursor-pointer">
                          {copiedSection === 'img-sdxl' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {generatedPackage.imagePrompts.sdxl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 6: VIDEO PROMPTS -------------------- */}
            {(activeOutputTab === 'video-prompts' || activeOutputTab === 'videos') && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">AI Motion Video Prompts (Google Veo, Runway Gen-3, Sora)</h3>
                  </div>
                  <button
                    onClick={handleDownloadVideoPromptsJSON}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Video JSON</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {generatedPackage.videoPrompts?.map((vp, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase">
                          Scene {vp.sceneNumber} • {vp.model}
                        </span>
                        <button
                          onClick={() => handleCopyText(vp.prompt, `vp-${idx}`)}
                          className="text-xs text-emerald-400 hover:underline font-semibold"
                        >
                          {copiedSection === `vp-${idx}` ? 'Copied Prompt' : 'Copy Motion Prompt'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                        {vp.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 7: VOICE -------------------- */}
            {activeOutputTab === 'voice' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Voice Direction & Subtitles (SRT)</h3>
                  </div>
                </div>

                {generatedPackage.voicePackage && (
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Voice Style:</span>
                      <p className="text-slate-200">{generatedPackage.voicePackage.voiceStyle}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Emotion Tone:</span>
                      <p className="text-slate-200">{generatedPackage.voicePackage.emotion}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Speaking Speed:</span>
                      <p className="text-slate-200">{generatedPackage.voicePackage.speakingSpeed}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Accent & Language:</span>
                      <p className="text-slate-200">{generatedPackage.voicePackage.accent}</p>
                    </div>
                  </div>
                )}

                {/* Subtitles SRT Viewer */}
                {generatedPackage.subtitlesSrt && (
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Subtitles SRT File</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyText(generatedPackage.subtitlesSrt, 'srt-copy')}
                          className="text-xs text-slate-300 hover:text-white font-semibold"
                        >
                          {copiedSection === 'srt-copy' ? 'Copied' : 'Copy SRT'}
                        </button>
                        <button
                          onClick={handleDownloadSRT}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:brightness-110"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .srt</span>
                        </button>
                      </div>
                    </div>

                    <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-72 leading-relaxed">
                      {generatedPackage.subtitlesSrt}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 8: MUSIC -------------------- */}
            {activeOutputTab === 'music' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Background Music & Sound Effects Cues</h3>
                  </div>
                  <button
                    onClick={handleDownloadMusicPromptsJSON}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Music JSON</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {generatedPackage.scenes?.map((s) => (
                    <div key={s.sceneNumber} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 text-xs shadow-lg">
                      <span className="font-bold text-emerald-400 uppercase text-xs">
                        Scene #{s.sceneNumber} Audio Directions
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-purple-400 font-bold uppercase text-[10px]">
                            <span>Background Music Prompt</span>
                            <button
                              onClick={() => handleCopyText(s.backgroundMusicPrompt || s.musicPrompt || '', `m-p-${s.sceneNumber}`)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedSection === `m-p-${s.sceneNumber}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{s.backgroundMusicPrompt || s.musicPrompt}</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-teal-400 font-bold uppercase text-[10px]">
                            <span>Sound Effects (SFX) Prompt</span>
                            <button
                              onClick={() => handleCopyText(s.soundEffectPrompt || s.sfxPrompt || '', `sfx-p-${s.sceneNumber}`)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedSection === `sfx-p-${s.sceneNumber}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{s.soundEffectPrompt || s.sfxPrompt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------- TAB 9: THUMBNAIL STUDIO -------------------- */}
            {activeOutputTab === 'thumbnail' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Thumbnail & Cover Art Studio</h3>
                  </div>
                  <button
                    onClick={() => {
                      const thumb = generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || '';
                      handleCopyText(thumb, 'thumb-all');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSection === 'thumb-all' ? 'Copied Prompt!' : 'Copy Master Thumbnail Prompt'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  {/* YouTube High CTR Thumbnail */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>YouTube Widescreen Thumbnail Prompt (16:9)</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || '', 'yt-thumb-tab')}
                        className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        {copiedSection === 'yt-thumb-tab' ? 'Copied' : 'Copy YouTube Prompt'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-100 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800/90 leading-relaxed">
                      {generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || `High CTR 16:9 YouTube Thumbnail for ${generatedPackage.title}. Close-up expressive character portrait with dramatic cinematic lighting, ultra-detailed 8k render.`}
                    </p>
                  </div>

                  {/* Instagram Cover Prompt */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Instagram Reels / Story Vertical Cover Prompt (9:16)</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(`9:16 vertical poster cover for ${generatedPackage.title}. ${generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || ''}. Bold cinematic composition, vibrant neon rim lighting, high contrast.`, 'insta-cover-tab')}
                        className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        {copiedSection === 'insta-cover-tab' ? 'Copied' : 'Copy Instagram Prompt'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-100 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800/90 leading-relaxed">
                      {`Vertical 9:16 poster cover for ${generatedPackage.title}. ${generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || ''}. Centered heroic framing, intense atmospheric lighting, deep contrast shadows.`}
                    </p>
                  </div>

                  {/* Facebook Video Cover Prompt */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Facebook Video Cover Banner Prompt</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(`Facebook video banner cover for ${generatedPackage.title}. ${generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || ''}. Wide action shot, high-contrast typography space.`, 'fb-cover-tab')}
                        className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        {copiedSection === 'fb-cover-tab' ? 'Copied' : 'Copy Facebook Prompt'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-100 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800/90 leading-relaxed">
                      {`Facebook video banner cover for ${generatedPackage.title}. ${generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || ''}. Cinematic wide composition with high contrast visual focus and clear focal subject.`}
                    </p>
                  </div>

                  {/* Title Placement & Color Direction */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <span className="font-bold text-amber-400 uppercase text-xs flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Title Placement Direction
                      </span>
                      <p className="text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        Bold 3D metallic or neon yellow typography placed on the upper third or lower-left corner with crisp dark drop shadows for maximum mobile contrast.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <span className="font-bold text-cyan-400 uppercase text-xs flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Color & Contrast Direction
                      </span>
                      <p className="text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        High-contrast dual-tone palette: Electric Cyan / Amber Gold rim highlights set against deep obsidian dark backgrounds to guarantee maximum CTR on feed scroll.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- TAB 9: SEO PACKAGE -------------------- */}
            {activeOutputTab === 'seo' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Social Media & SEO Distribution Suite</h3>
                  </div>
                  <button
                    onClick={() => {
                      const hashtags = generatedPackage.socialMediaPackage?.hashtags?.join(' ') || '';
                      const fullSeoText = `YOUTUBE TITLE:\n${generatedPackage.socialMediaPackage?.youtubeTitle}\n\nSEO DESCRIPTION:\n${generatedPackage.socialMediaPackage?.seoDescription}\n\nINSTAGRAM CAPTION:\n${generatedPackage.socialMediaPackage?.instagramCaption}\n\nFACEBOOK CAPTION:\n${generatedPackage.socialMediaPackage?.facebookCaption}\n\nHASHTAGS:\n${hashtags}`;
                      handleCopyText(fullSeoText, 'seo-all');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSection === 'seo-all' ? 'Copied Full SEO Package!' : 'Copy Entire SEO Package'}</span>
                  </button>
                </div>

                {generatedPackage.socialMediaPackage && (
                  <div className="flex flex-col gap-4">
                    {/* YouTube Title */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Video className="w-4 h-4" />
                          <span>YouTube Video Title</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.youtubeTitle || '', 'yt-title')}
                          className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                        >
                          {copiedSection === 'yt-title' ? 'Copied' : 'Copy Title'}
                        </button>
                      </div>
                      <p className="text-sm font-bold text-white bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        {generatedPackage.socialMediaPackage.youtubeTitle}
                      </p>
                    </div>

                    {/* SEO Description */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          <span>SEO Optimized Description</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.seoDescription || '', 'seo-desc')}
                          className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                        >
                          {copiedSection === 'seo-desc' ? 'Copied' : 'Copy Description'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                        {generatedPackage.socialMediaPackage.seoDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Instagram Caption */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Share2 className="w-4 h-4" />
                            <span>Instagram / Reels Caption</span>
                          </span>
                          <button
                            onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.instagramCaption || '', 'insta-cap')}
                            className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                          >
                            {copiedSection === 'insta-cap' ? 'Copied' : 'Copy Caption'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                          {generatedPackage.socialMediaPackage.instagramCaption}
                        </p>
                      </div>

                      {/* Facebook Caption */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="w-4 h-4" />
                            <span>Facebook / Post Caption</span>
                          </span>
                          <button
                            onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.facebookCaption || '', 'fb-cap')}
                            className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                          >
                            {copiedSection === 'fb-cap' ? 'Copied' : 'Copy Caption'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                          {generatedPackage.socialMediaPackage.facebookCaption}
                        </p>
                      </div>
                    </div>

                    {/* 30 Viral Hashtags */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          <span>30 Viral Hashtags</span>
                        </span>
                        <button
                          onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.hashtags?.join(' ') || '', 'hash-all')}
                          className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                        >
                          {copiedSection === 'hash-all' ? 'Copied All Hashtags' : 'Copy 30 Hashtags'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                        {generatedPackage.socialMediaPackage.hashtags?.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Thumbnail Prompt */}
                    {(generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt) && (
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4" />
                            <span>Thumbnail AI Poster Prompt</span>
                          </span>
                          <button
                            onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt || '', 'thumb-seo')}
                            className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                          >
                            {copiedSection === 'thumb-seo' ? 'Copied' : 'Copy Prompt'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
                          {generatedPackage.socialMediaPackage?.thumbnailPrompt || generatedPackage.thumbnailPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 10: EXPORTS -------------------- */}
            {(activeOutputTab === 'exports' || activeOutputTab === 'export') && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Export Engine & Social Media Package</h3>
                  </div>
                </div>

                {/* File Export Buttons */}
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Download Production Package Files</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={handleExportJSON}
                      className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-emerald-400 flex flex-col items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileCode className="w-5 h-5" />
                      <span>Download JSON</span>
                    </button>

                    <button
                      onClick={handleExportMarkdown}
                      className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex flex-col items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Download Markdown</span>
                    </button>

                    <button
                      onClick={handleExportTXT}
                      className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-amber-400 flex flex-col items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Download TXT</span>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="p-4 rounded-xl bg-emerald-500 hover:brightness-110 text-slate-950 text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <Printer className="w-5 h-5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Social Media Distribution Package */}
                {generatedPackage.socialMediaPackage && (
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl text-xs">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                      <Globe className="w-4 h-4" />
                      <span>Social Media & YouTube Distribution Suite</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">YouTube Title:</span>
                        <p className="text-slate-200 font-bold">{generatedPackage.socialMediaPackage.youtubeTitle}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">SEO Description:</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.socialMediaPackage.seoDescription}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Instagram Caption:</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.socialMediaPackage.instagramCaption}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Facebook Caption:</span>
                        <p className="text-slate-300 leading-relaxed">{generatedPackage.socialMediaPackage.facebookCaption}</p>
                      </div>

                      {/* 30 Hashtags */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 md:col-span-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">30 Viral Hashtags:</span>
                          <button
                            onClick={() => handleCopyText(generatedPackage.socialMediaPackage?.hashtags?.join(' ') || '', 'hash-export')}
                            className="text-[10px] text-emerald-400 hover:underline font-bold"
                          >
                            {copiedSection === 'hash-export' ? 'Copied 30 Hashtags' : 'Copy All 30 Hashtags'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {generatedPackage.socialMediaPackage.hashtags?.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 13: HISTORY -------------------- */}
            {activeOutputTab === 'history' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-heading font-bold text-white">Saved AI Movie Projects History</h3>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search history..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
                      {(['all', 'pinned', 'recent'] as const).map(filterKey => (
                        <button
                          key={filterKey}
                          onClick={() => setHistoryFilter(filterKey)}
                          className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${historyFilter === filterKey ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          {filterKey}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {(() => {
                  const filteredHistory = projectHistory
                    .filter(item => {
                      if (historyFilter === 'pinned') return !!item.pinned;
                      return true;
                    })
                    .filter(item => {
                      if (!historySearch.trim()) return true;
                      const q = historySearch.toLowerCase();
                      return (
                        item.title?.toLowerCase().includes(q) ||
                        item.synopsis?.toLowerCase().includes(q) ||
                        item.genre?.toLowerCase().includes(q)
                      );
                    });

                  if (filteredHistory.length === 0) {
                    return (
                      <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center gap-3">
                        <History className="w-10 h-10 text-slate-600" />
                        <p className="text-sm text-slate-400 font-medium">No projects match your filter or search.</p>
                        <p className="text-xs text-slate-500">Generate an episode above or clear your filters to view history.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredHistory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenHistoryItem(item)}
                          className={`p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border transition-all flex flex-col gap-3 shadow-lg cursor-pointer group relative ${item.pinned ? 'border-amber-500/50 shadow-amber-950/20' : 'border-slate-800 hover:border-emerald-500/50'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.pinned && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                                  <Pin className="w-3 h-3 fill-amber-300" />
                                  <span>Pinned</span>
                                </span>
                              )}
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                {item.genre}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                                {item.language}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                                {item.duration}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.timestamp || 'Saved'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.synopsis}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                            <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                              <span>Open Workspace</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleTogglePinHistory(item.id || '', e)}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${item.pinned ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                                title={item.pinned ? 'Unpin project' : 'Pin project'}
                              >
                                <Pin className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleRenameHistory(item, e)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Rename project"
                              >
                                <Edit3 className="w-3 h-3 text-cyan-400" />
                                <span>Rename</span>
                              </button>
                              <button
                                onClick={(e) => handleDuplicateHistory(item, e)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Duplicate project"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={(e) => handleDeleteHistory(item.id || '', e)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
            </div>

            {/* RIGHT PANEL: AI DIRECTOR COPILOT */}
            <AIDirectorCopilot
              isOpen={isRightPanelOpen}
              onClose={() => setIsRightPanelOpen(false)}
              generatedPackage={generatedPackage}
              onUpdatePackage={setGeneratedPackage}
              onAddLog={(msg) => setProductionLogs(prev => [{ id: Date.now().toString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), text: msg }, ...prev])}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💻 RAW JSON INSPECTOR MODAL */}
      <AnimatePresence>
        {showJsonViewer && generatedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Raw Production JSON Inspector</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">
                        Valid Schema
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Complete raw output generated by Gemini AI</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(JSON.stringify(generatedPackage, null, 2), 'raw-json')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSection === 'raw-json' ? 'Copied JSON!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={() => setShowJsonViewer(false)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto font-mono text-xs text-emerald-400/90 bg-slate-950/90 leading-relaxed scrollbar-thin">
                <pre>{JSON.stringify(generatedPackage, null, 2)}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📡 FLOATING LIVE AI ACTIVITY FEED DRAWER */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isActivityFeedOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="w-80 sm:w-96 p-4 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 max-h-80 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live AI Activity Feed</span>
                </div>
                <button
                  onClick={() => setIsActivityFeedOpen(false)}
                  className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[11px]">
                {productionLogs.length === 0 ? (
                  <p className="text-slate-500 italic py-4 text-center">No recent AI production logs. Click Generate to trigger live feed.</p>
                ) : (
                  productionLogs.map(log => (
                    <div key={log.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 flex items-start gap-2">
                      <span className="text-slate-500 text-[10px] shrink-0 font-bold">[{log.time}]</span>
                      <span className="text-emerald-300/90 leading-tight">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsActivityFeedOpen(!isActivityFeedOpen)}
          className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-2xl hover:border-emerald-400 transition-all cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Live AI Activity Feed</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
