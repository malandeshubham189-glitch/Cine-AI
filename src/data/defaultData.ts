import { Project, Character, CinematicPrompt, UserProfile, CreditTransaction, AIModelConfig } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Elena Rostova',
  email: 'e.rostova@cineai-studio.io',
  role: 'Executive Showrunner',
  plan: 'Studio Pro',
  creditsRemaining: 12450,
  totalCreditsUsed: 35550,
  monthlyQuota: 50000,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  studioName: 'Aetheria Pictures'
};

export const INITIAL_MODEL_CONFIG: AIModelConfig = {
  selectedTextModel: 'gemini-3.6-flash',
  selectedImageModel: 'gemini-3.1-flash-lite-image',
  defaultAspectRatio: '16:9',
  temperature: 0.8,
  autoSaveIntervalMs: 30000,
  exportFormatDefault: 'PDF'
};

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    name: 'Kaelen Vance',
    role: 'Protagonist',
    archetype: 'Rogue Memory Architect',
    bio: 'Former chief engineer at NeuralSync who went underground after discovering encoded human consciousness fragments in corporate sub-routines.',
    traits: ['Obsessive', 'Cynical', 'Hyper-Observant', 'Neuro-Augmented'],
    voiceStyle: 'Low raspy baritone, measured cadence, subtle vocal fry under strain.',
    visualPromptAnchor: 'Cinematic 35mm photograph, mid-30s cybernetic architect with glowing optic iris patch, damp leather longcoat, rain-slicked neon street background, 8k resolution, Kodak Vision3 color grading.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    relationships: [
      { characterId: 'char-2', relation: 'Former mentor turned fierce adversary' },
      { characterId: 'char-3', relation: 'Uneasy ally & synth-hacker' }
    ],
    episodesCount: 8
  },
  {
    id: 'char-2',
    name: 'Dr. Vespera Thorne',
    role: 'Antagonist',
    archetype: 'Corporate Techno-Monarch',
    bio: 'CEO of Apex Cognition. Visionary scientist obsessed with digitizing human souls to construct a post-biological paradise.',
    traits: ['Calculating', 'Charismatic', 'Unforgiving', 'Aristocratic'],
    voiceStyle: 'Silky, precise British RP, soft tone that commands immediate stillness.',
    visualPromptAnchor: 'Symmetrical medium close-up, sharp platinum hair, high-collared obsidian suit, glowing holographic architectural blueprints reflected in eyes, hyper-detailed, IMAX ratio.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    relationships: [
      { characterId: 'char-1', relation: 'Target of capture & extraction' }
    ],
    episodesCount: 12
  },
  {
    id: 'char-3',
    name: 'Soren Zero',
    role: 'Supporting',
    archetype: 'Underground Audio-Hacker',
    bio: 'Deaf audio engineer who listens to electromagnetic frequencies through spinal bone-conduction implants.',
    traits: ['Resourceful', 'Quiet', 'Loyal', 'Tactical'],
    voiceStyle: 'Subdued, clipped sentences, relies heavily on gestural visual telemetry.',
    visualPromptAnchor: 'Cyberpunk street medic, glowing sound-wave tattoos along neck, oversized tactical headphones, volumetric neon fog, shot on Arri Alexa Mini LF.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    relationships: [
      { characterId: 'char-1', relation: 'Technical partner in crime' }
    ],
    episodesCount: 6
  }
];

export const DEFAULT_PROMPTS: CinematicPrompt[] = [
  {
    id: 'p-1',
    title: 'Denis Villeneuve Desert Anamorphic',
    category: 'Director Style',
    promptText: 'Ultra wide 2.39:1 anamorphic shot, vast desolate orange dust storm, solitary brutalist obsidian monolith, extreme scale contrast, soft diffused sunlight through haze, Panavision C-Series lenses, minimalist atmospheric lighting, 8k render.',
    tags: ['Sci-Fi', 'Anamorphic', 'Brutalist', 'Atmospheric'],
    directorStyle: 'Denis Villeneuve',
    likesCount: 1420
  },
  {
    id: 'p-2',
    title: 'Christopher Nolan IMAX Practical Action',
    category: 'Director Style',
    promptText: 'IMAX 70mm film grain, high dynamic range, practical lighting, fast dolly tracking shot through smoke-filled hallway, tungsten light spill, photorealistic motion blur, crisp detail, heavy shadows, high contrast.',
    tags: ['Action', '70mm', 'IMAX', 'High Dynamic Range'],
    directorStyle: 'Christopher Nolan',
    likesCount: 1890
  },
  {
    id: 'p-3',
    title: 'Wong Kar-wai Rain-Slick Neon Romance',
    category: 'Director Style',
    promptText: 'Step-printed 24fps motion blur, rich emerald and ruby red neon reflections on wet asphalt, 35mm lens close up, dreamy soft focus, intense emotional shadowplay, nostalgic 90s Hong Kong cinema aesthetic.',
    tags: ['Neo-Noir', 'Mood', 'Color Grade', 'Step-Printing'],
    directorStyle: 'Wong Kar-wai',
    likesCount: 2150
  },
  {
    id: 'p-4',
    title: 'Volumetric Cyberpunk Underground Lighting',
    category: 'Lighting & Mood',
    promptText: 'Heavy volumetric cyan and magenta smoke, overhead industrial grate lights casting grid shadows onto puddle-covered concrete floor, dramatic rim light separating subjects from pitch dark background.',
    tags: ['Cyberpunk', 'Volumetric', 'Grid Shadows', 'Neon'],
    likesCount: 980
  },
  {
    id: 'p-5',
    title: 'Low-Angle Hero Crane Tracking',
    category: 'Camera Angles',
    promptText: 'Low angle crane shot rising rapidly from ground level up to eye level, revealing an expansive futuristic cityscape backdrop, wide 18mm lens with subtle barrel distortion at edges.',
    tags: ['Crane Shot', 'Low Angle', 'Reveal', 'Wide Angle'],
    likesCount: 740
  },
  {
    id: 'p-6',
    title: 'Particle Explosion Slow Motion 1000fps',
    category: 'VFX & Particles',
    promptText: 'Super slow motion 1000fps macro shot, glass shattering in mid-air with suspended glowing amber spark embers, shallow depth of field, optical flare, hyper-detailed fluid dynamics.',
    tags: ['VFX', 'Slow Motion', 'Macro', 'Particles'],
    likesCount: 1120
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'NEURAL HORIZON',
    logline: 'When human memory becomes a tradable cryptocurrency, a disgraced cyber-architect must heist his daughter’s deleted childhood from a corporate vault.',
    genre: 'Sci-Fi Cyberpunk',
    format: 'TV Episode (60m)',
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-06-15',
    status: 'Active Writing',
    budgetTier: 'Blockbuster',
    characters: DEFAULT_CHARACTERS,
    episodes: [
      {
        id: 'ep-101',
        projectId: 'proj-1',
        seasonNumber: 1,
        episodeNumber: 1,
        title: 'Episode 101: Ghost in the Code',
        logline: 'Kaelen intercepts an encrypted neuro-feed containing memories of a facility that shouldn’t exist.',
        targetDurationMinutes: 52,
        genre: 'Sci-Fi Cyberpunk',
        format: 'TV Episode (60m)',
        status: 'Storyboarding',
        createdDate: '2026-06-16',
        updatedDate: '2026-07-25',
        estimatedCredits: 1200,
        scenes: [
          {
            id: 'sc-1',
            sceneNumber: 1,
            heading: 'EXT. NEO-VERIDIAN DISTRICT - NIGHT',
            summary: 'Rain sweeps across the glowing holographic billboards. Kaelen stands on a wet fire escape monitoring Apex Cognition towers.',
            charactersInScene: ['Kaelen Vance'],
            scriptText: `EXT. NEO-VERIDIAN DISTRICT - NIGHT\n\nRain falls like liquefied neon across the slick fire escape. The air smells of copper and ozone.\n\nKAELEN VANCE (38) crouches near a rusted junction box. Rainwater drips from his leather coat down his cheek, but his right optic iris GLOWS steady amber as he scans the sky.\n\nKAELEN\n(into comms)\nSoren, I'm at the signal node. The frequency is erratic. It's spiking past 40 Terahertz.\n\nSOREN (V.O.)\n(filtered)\nThat's not data, Kaelen. That's a brainwave pulse. Someone's dumping live consciousness into the city grid.`,
            vfxNotes: 'Volumetric rain, holographic billboard reflections on damp leather, glowing optic eye flare.',
            shots: [
              {
                id: 'sh-1',
                shotNumber: 1,
                shotType: 'Extreme Wide Shot',
                cameraMovement: 'FPV Drone Sweep',
                description: 'Drone sweeps down over sprawling futuristic city with towering glass skyscrapers and flying transit shuttles in heavy rain.',
                lightingTone: 'Deep moody cobalt dark with vibrant neon amber highlights.',
                aiRenderPrompt: 'Cinematic wide angle, cyberpunk city at night, rain-slick streets, flying vehicles, Blade Runner vibe, 8k IMAX render.',
                imagePreviewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
                durationSeconds: 6,
                audioCues: 'Heavy distant thunder, roaring turbine engines, rain pitter-patter.'
              },
              {
                id: 'sh-2',
                shotNumber: 2,
                shotType: 'Close Up',
                cameraMovement: 'Static',
                description: 'Close-up of Kaelen looking through optic iris lens as digital data streams across his pupil.',
                lightingTone: 'Amber eye glow contrasting against cold shadow.',
                aiRenderPrompt: 'Extreme close up of human eye with cybernetic optic iris glowing amber, HUD telemetry overlays, cinematic photorealistic.',
                imagePreviewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
                durationSeconds: 4,
                audioCues: 'High-frequency digital hum, comms static clicking.'
              }
            ]
          },
          {
            id: 'sc-2',
            sceneNumber: 2,
            heading: 'INT. APEX COGNITION BOARDROOM - CONTINUOUS',
            summary: 'Dr. Vespera Thorne addresses silent corporate board members as a floating memory hologram rotates before them.',
            charactersInScene: ['Dr. Vespera Thorne'],
            scriptText: `INT. APEX COGNITION BOARDROOM - CONTINUOUS\n\nA room made entirely of smart-glass suspended 120 stories above the clouds. Below, lightning flashes in the storm.\n\nDR. VESPERA THORNE walks slowly around a 3D hologram of a human brain glowing with golden synaptic light.\n\nDR. THORNE\nMortality was simply a hardware limitation. Tonight, Apex solves the human expiration date.\n\nBOARD MEMBER #1\nAnd the neural decay rates?\n\nDR. THORNE\n(smiles cold)\nCollateral trivia. We proceed to Phase Three.`,
            vfxNotes: 'Symmetrical architecture, rotating gold neural brain hologram, lightning flashes through floor glass.',
            shots: [
              {
                id: 'sh-3',
                shotNumber: 1,
                shotType: 'Medium Shot',
                cameraMovement: 'Tracking Pan',
                description: 'Camera tracks slowly beside Dr. Thorne as she steps past illuminated smart glass panels.',
                lightingTone: 'Sleek corporate white with subtle gold light spill from hologram.',
                aiRenderPrompt: 'Medium shot of elegant female tech executive in high collar black suit, minimalist glass skyscraper boardroom at night, volumetric gold hologram, IMAX.',
                imagePreviewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                durationSeconds: 7,
                audioCues: 'Soft ambient hum, glass chime echo.'
              }
            ]
          }
        ]
      },
      {
        id: 'ep-102',
        projectId: 'proj-1',
        seasonNumber: 1,
        episodeNumber: 2,
        title: 'Episode 102: Synapse Fracture',
        logline: 'Cornered in the flooded subterranean rail yards, Soren must deploy an acoustic EMP to buy Kaelen time.',
        targetDurationMinutes: 48,
        genre: 'Sci-Fi Cyberpunk',
        format: 'TV Episode (60m)',
        status: 'Drafting',
        createdDate: '2026-06-20',
        updatedDate: '2026-07-26',
        estimatedCredits: 950,
        scenes: []
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'THE SILENT KINGDOM',
    logline: 'In an ancient realm where sound commands magic, a mute princess uncovers a forbidden vibration that can shatter mountains.',
    genre: 'Epic Fantasy',
    format: 'Feature Film',
    coverImageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-05-10',
    status: 'Pre-Production',
    budgetTier: 'Blockbuster',
    characters: [],
    episodes: []
  },
  {
    id: 'proj-3',
    title: 'ECHOES AT MIDNIGHT',
    logline: 'A detective in 1950s Los Angeles investigates crimes that haven’t happened yet according to an enigmatic radio frequency.',
    genre: 'Neo-Noir Crime',
    format: 'Cinematic Short',
    coverImageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    createdDate: '2026-07-01',
    status: 'Active Writing',
    budgetTier: 'Mid-Budget',
    characters: [],
    episodes: []
  }
];

export const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: 'tx-101',
    timestamp: '2026-07-27 08:30',
    feature: 'AI Script Generation',
    creditsUsed: 150,
    status: 'Completed'
  },
  {
    id: 'tx-102',
    timestamp: '2026-07-26 19:45',
    feature: 'Scene Visual Render',
    creditsUsed: 400,
    status: 'Completed'
  },
  {
    id: 'tx-103',
    timestamp: '2026-07-26 14:12',
    feature: 'Character Audio Synth',
    creditsUsed: 200,
    status: 'Completed'
  },
  {
    id: 'tx-104',
    timestamp: '2026-07-25 11:05',
    feature: 'Full Episode Polish',
    creditsUsed: 500,
    status: 'Completed'
  },
  {
    id: 'tx-105',
    timestamp: '2026-07-24 16:20',
    feature: 'Export Bible',
    creditsUsed: 100,
    status: 'Completed'
  }
];
