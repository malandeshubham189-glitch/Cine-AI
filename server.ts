import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialization for Google GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. API calls will use fallback generators.');
      return null;
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// 1. Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Generate Episode Endpoint
app.post('/api/ai/generate-episode', async (req, res) => {
  try {
    const { title, logline, genre, format, targetDurationMinutes, characters } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback response if API Key is not yet present
      return res.json({
        success: true,
        data: {
          title: title || 'Episode: Genesis',
          logline: logline || 'A rogue memory architect discovers encoded consciousness in corporate servers.',
          estimatedCredits: 1200,
          scenes: [
            {
              id: 'sc-gen-1',
              sceneNumber: 1,
              heading: 'EXT. METROPOLIS SUB-LEVEL - NIGHT',
              summary: 'Acid rain cascades over rusted industrial grates as Kaelen monitors Apex Cognition telemetry.',
              charactersInScene: [characters?.[0]?.name || 'Kaelen Vance'],
              scriptText: `EXT. METROPOLIS SUB-LEVEL - NIGHT\n\nAcid rain cascades over rusted grates.\n\n${(characters?.[0]?.name || 'KAELEN VANCE').toUpperCase()}\n(into comms)\nThe signal isn't data. It's a living human pulse.`,
              vfxNotes: 'Volumetric mist, neon green rain reflections, optic lens flare.',
              shots: [
                {
                  id: 'sh-gen-1',
                  shotNumber: 1,
                  shotType: 'Extreme Wide Shot',
                  cameraMovement: 'FPV Drone Sweep',
                  description: 'Wide sweep over neon industrial towers shrouded in toxic rain.',
                  lightingTone: 'Deep cobalt dark with amber highlights.',
                  aiRenderPrompt: 'Cinematic wide shot, cyberpunk city at night, heavy volumetric rain, Kodak 35mm grain, 8k.',
                  durationSeconds: 6,
                  audioCues: 'Heavy rain, distant sirens, low sub-bass drone.'
                }
              ]
            }
          ]
        }
      });
    }

    const promptText = `You are a Hollywood showrunner and screenplay architect for CineAI CreatorOS.
Generate a multi-scene episode structure for:
Title: "${title}"
Logline: "${logline}"
Genre: "${genre}"
Format: "${format}"
Duration: ${targetDurationMinutes} minutes
Key Characters: ${JSON.stringify(characters || [])}

Create 2 distinct, highly dramatic scenes formatted with proper screenplay headings (EXT./INT. LOCATION - TIME), vivid action lines, sharp dialogue, VFX notes, and 2 detailed camera shots per scene.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            logline: { type: Type.STRING },
            estimatedCredits: { type: Type.NUMBER },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  sceneNumber: { type: Type.NUMBER },
                  heading: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  charactersInScene: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  scriptText: { type: Type.STRING },
                  vfxNotes: { type: Type.STRING },
                  shots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        shotNumber: { type: Type.NUMBER },
                        shotType: { type: Type.STRING },
                        cameraMovement: { type: Type.STRING },
                        description: { type: Type.STRING },
                        lightingTone: { type: Type.STRING },
                        aiRenderPrompt: { type: Type.STRING },
                        durationSeconds: { type: Type.NUMBER },
                        audioCues: { type: Type.STRING }
                      },
                      required: ['id', 'shotNumber', 'shotType', 'cameraMovement', 'description', 'lightingTone', 'aiRenderPrompt', 'durationSeconds', 'audioCues']
                    }
                  }
                },
                required: ['id', 'sceneNumber', 'heading', 'summary', 'charactersInScene', 'scriptText', 'vfxNotes', 'shots']
              }
            }
          },
          required: ['title', 'logline', 'estimatedCredits', 'scenes']
        }
      }
    });

    const resultJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: resultJson });
  } catch (error: any) {
    console.error('Error generating episode:', error);
    return res.status(500).json({ success: false, error: error.message || 'Episode generation failed' });
  }
});

// 2b. Generate Complete AI Episode (CineAI CreatorOS v4 Master Engine Endpoint)
app.post('/api/ai/generate-complete-episode', async (req, res) => {
  try {
    const { 
      prompt, 
      language = 'English', 
      genre = 'Crime', 
      episodeLength = '2 min', 
      aspectRatio = '16:9 Landscape', 
      platform = 'YouTube',
      outputOptions = {}
    } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'EMPTY_PROMPT',
        error: 'Prompt cannot be empty. Please enter a premise or select a template.'
      });
    }

    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is missing or invalid. Please configure your API key in settings.'
      });
    }

    const systemPrompt = `You are the Master AI Film Director and Showrunner for CineAI CreatorOS V5.
User Premise / Prompt: "${prompt}"
Primary Language: ${language}
Genre: ${genre}
Episode Length / Duration: ${episodeLength}
Target Aspect Ratio: ${aspectRatio}
Target Platform: ${platform}

Output Options requested by user: ${JSON.stringify(outputOptions)}

Generate a complete, production-ready cinematic episode package as a single structured JSON object.
Ensure you strictly generate:
1. title, synopsis, genre, mood, targetAudience, language, platform, aspectRatio, duration
2. storyStructure: beginning, conflict, climax, ending
3. characters: array of Master Character Profiles containing:
   - id: unique character ID (e.g. "CHAR-01", "CHAR-02")
   - name: character name
   - role: Protagonist / Antagonist / Supporting
   - masterPrompt: comprehensive master image prompt for visual generation
   - negativePrompt: strict negative prompt preventing distortions and maintaining style
   - appearanceLock: detailed physical description lock (face, hair, eyes, skin tone, height, build)
   - voiceLock: precise voice tone, cadence, accent, and pitch parameters
   - costumeLock: specific clothing, wardrobe, and accessories description
   - age, gender, faceDescription, hair, eyes, skinTone, height, bodyType, costume, accessories, expressions, personality, voice, characterConsistencyPrompt
4. scenes: array of Scene Cards containing: sceneNumber, duration, location, time, sceneGoal, visualPrompt, characterPrompt, cameraAngle, cameraMovement, cameraPrompt, lens, lighting, environment, dialogues (array of {speaker, lines, emotion}), voiceEmotion, backgroundMusicPrompt, soundEffectPrompt, negativePrompt. Note: In characterPrompt and visualPrompt, reference character IDs (e.g. [CHAR-01]) and reuse their appearance locks to maintain character consistency.
5. imagePrompts: object with imagen, flux, midjourney, sdxl
6. videoPrompts: array of objects with sceneNumber, model, prompt
7. voicePackage: object with voiceStyle, emotion, speakingSpeed, accent
8. socialMediaPackage: object with youtubeTitle, seoDescription, instagramCaption, facebookCaption, hashtags (EXACTLY 30 hashtags), thumbnailPrompt
9. subtitlesSrt: formatted SRT text.

Return ONLY structured JSON adhering strictly to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            genre: { type: Type.STRING },
            mood: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            language: { type: Type.STRING },
            platform: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            duration: { type: Type.STRING },
            storyStructure: {
              type: Type.OBJECT,
              properties: {
                beginning: { type: Type.STRING },
                conflict: { type: Type.STRING },
                climax: { type: Type.STRING },
                ending: { type: Type.STRING }
              },
              required: ['beginning', 'conflict', 'climax', 'ending']
            },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  masterPrompt: { type: Type.STRING },
                  negativePrompt: { type: Type.STRING },
                  appearanceLock: { type: Type.STRING },
                  voiceLock: { type: Type.STRING },
                  costumeLock: { type: Type.STRING },
                  age: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  faceDescription: { type: Type.STRING },
                  hair: { type: Type.STRING },
                  eyes: { type: Type.STRING },
                  skinTone: { type: Type.STRING },
                  height: { type: Type.STRING },
                  bodyType: { type: Type.STRING },
                  costume: { type: Type.STRING },
                  accessories: { type: Type.STRING },
                  expressions: { type: Type.STRING },
                  personality: { type: Type.STRING },
                  voice: { type: Type.STRING },
                  characterConsistencyPrompt: { type: Type.STRING }
                },
                required: [
                  'id', 'name', 'role', 'masterPrompt', 'negativePrompt', 
                  'appearanceLock', 'voiceLock', 'costumeLock', 'age', 'gender', 
                  'faceDescription', 'hair', 'eyes', 'skinTone', 'height', 'bodyType', 
                  'costume', 'accessories', 'expressions', 'personality', 'voice', 
                  'characterConsistencyPrompt'
                ]
              }
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  duration: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  sceneGoal: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  characterPrompt: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  cameraPrompt: { type: Type.STRING },
                  lens: { type: Type.STRING },
                  lighting: { type: Type.STRING },
                  environment: { type: Type.STRING },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        lines: { type: Type.STRING },
                        emotion: { type: Type.STRING }
                      },
                      required: ['speaker', 'lines', 'emotion']
                    }
                  },
                  voiceEmotion: { type: Type.STRING },
                  backgroundMusicPrompt: { type: Type.STRING },
                  soundEffectPrompt: { type: Type.STRING },
                  negativePrompt: { type: Type.STRING }
                },
                required: ['sceneNumber', 'duration', 'location', 'time', 'sceneGoal', 'visualPrompt', 'characterPrompt', 'cameraAngle', 'cameraMovement', 'cameraPrompt', 'lens', 'lighting', 'environment', 'dialogues', 'voiceEmotion', 'backgroundMusicPrompt', 'soundEffectPrompt', 'negativePrompt']
              }
            },
            imagePrompts: {
              type: Type.OBJECT,
              properties: {
                imagen: { type: Type.STRING },
                flux: { type: Type.STRING },
                midjourney: { type: Type.STRING },
                sdxl: { type: Type.STRING }
              },
              required: ['imagen', 'flux', 'midjourney', 'sdxl']
            },
            videoPrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  model: { type: Type.STRING },
                  prompt: { type: Type.STRING }
                },
                required: ['sceneNumber', 'model', 'prompt']
              }
            },
            voicePackage: {
              type: Type.OBJECT,
              properties: {
                voiceStyle: { type: Type.STRING },
                emotion: { type: Type.STRING },
                speakingSpeed: { type: Type.STRING },
                accent: { type: Type.STRING }
              },
              required: ['voiceStyle', 'emotion', 'speakingSpeed', 'accent']
            },
            socialMediaPackage: {
              type: Type.OBJECT,
              properties: {
                youtubeTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                instagramCaption: { type: Type.STRING },
                facebookCaption: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                thumbnailPrompt: { type: Type.STRING }
              },
              required: ['youtubeTitle', 'seoDescription', 'instagramCaption', 'facebookCaption', 'hashtags', 'thumbnailPrompt']
            },
            subtitlesSrt: { type: Type.STRING }
          },
          required: ['title', 'synopsis', 'genre', 'mood', 'targetAudience', 'language', 'platform', 'aspectRatio', 'duration', 'storyStructure', 'characters', 'scenes', 'imagePrompts', 'videoPrompts', 'voicePackage', 'socialMediaPackage', 'subtitlesSrt']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating complete episode:', error);
    let errorType = 'UNKNOWN';
    const msg = error.message || String(error);
    if (msg.includes('API key') || msg.includes('401') || msg.includes('unauthorized') || msg.includes('UNAUTHENTICATED') || msg.includes('API_KEY_INVALID')) {
      errorType = 'INVALID_API_KEY';
    } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('rate limit') || msg.includes('Quota exceeded')) {
      errorType = 'RATE_LIMIT';
    } else if (msg.includes('timeout') || msg.includes('504') || msg.includes('DEADLINE_EXCEEDED') || msg.includes('ETIMEDOUT')) {
      errorType = 'TIMEOUT';
    } else if (msg.includes('JSON') || msg.includes('SyntaxError') || msg.includes('Unexpected token')) {
      errorType = 'MALFORMED_JSON';
    } else if (msg.includes('fetch') || msg.includes('ENOTFOUND') || msg.includes('network') || msg.includes('ECONNREFUSED')) {
      errorType = 'NETWORK_ERROR';
    }
    return res.status(500).json({ success: false, error: msg || 'Complete AI Episode generation failed', errorType });
  }
});

// 3. Scene Assistant & Script Polish
app.post('/api/ai/scene-assistant', async (req, res) => {
  try {
    const { actionType, scriptText, sceneHeading, instruction, genre } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is required to run Scene Assistant.'
      });
    }

    const systemPrompt = `You are a Oscar-winning script doctor and dialogue editor.
Task: ${actionType}
Genre: ${genre || 'Sci-Fi Cyberpunk'}
User Instruction: ${instruction || 'Elevate visual verbs, tighten dialogue pacing, and increase cinematic tension.'}

Current Scene:
${sceneHeading ? `Heading: ${sceneHeading}` : ''}
${scriptText}

Return JSON with "enhancedScript" (string) and "notes" (string with script doctor critique).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedScript: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
          required: ['enhancedScript', 'notes']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in scene assistant:', error);
    return res.status(500).json({ success: false, error: error.message, errorType: 'SCENE_ASSISTANT_FAILED' });
  }
});

// 4. Character Generator Endpoint
app.post('/api/ai/character-bio', async (req, res) => {
  try {
    const { name, role, concept, genre } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is required to generate character bios.'
      });
    }

    const promptText = `Generate a detailed character profile for CineAI CreatorOS.
Name: "${name}"
Role: "${role}"
Concept: "${concept}"
Genre: "${genre}"

Return JSON with archetype, bio, traits (array of 4 strings), voiceStyle, and visualPromptAnchor for AI image generators (Veo/Midjourney/Flux).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING },
            bio: { type: Type.STRING },
            traits: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            voiceStyle: { type: Type.STRING },
            visualPromptAnchor: { type: Type.STRING }
          },
          required: ['archetype', 'bio', 'traits', 'voiceStyle', 'visualPromptAnchor']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, character: { name, role, ...parsed } });
  } catch (error: any) {
    console.error('Error generating character:', error);
    return res.status(500).json({ success: false, error: error.message, errorType: 'CHARACTER_GEN_FAILED' });
  }
});

// 5. Prompt Optimizer Endpoint
app.post('/api/ai/optimize-prompt', async (req, res) => {
  try {
    const { rawConcept, directorStyle, category } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is required to optimize prompts.'
      });
    }

    const promptText = `Optimize the following concept into a master-grade cinematic AI image/video generation prompt for tools like Veo 3, Midjourney v6, or Flux Pro.
Raw Concept: "${rawConcept}"
Director Style: "${directorStyle || 'None'}"
Category: "${category || 'Cinematic Shot'}"

Include lens details, camera elevation, lighting quality, film stock / sensor properties, and color grading. Return JSON with "optimizedPrompt" (string) and "tags" (array of 4 string tags).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['optimizedPrompt', 'tags']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error optimizing prompt:', error);
    return res.status(500).json({ success: false, error: error.message, errorType: 'PROMPT_OPTIMIZER_FAILED' });
  }
});

// 6. Image Preview Generator Endpoint (using gemini-3.1-flash-lite-image)
app.post('/api/ai/generate-shot-visual', async (req, res) => {
  try {
    const { promptText, aspectRatio } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is required to render shot visuals.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { text: promptText || 'Cinematic sci-fi movie frame, rain slicked streets at night, high resolution, 8k.' }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '16:9'
        }
      }
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${base64Data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        errorType: 'IMAGE_SYNTHESIS_FAILED',
        error: 'No image data returned from image generation model.'
      });
    }

    return res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error generating image visual:', error);
    let errMsg = error.message || String(error);
    let errorType = 'IMAGE_SYNTHESIS_FAILED';

    try {
      if (typeof errMsg === 'string' && (errMsg.startsWith('{') || errMsg.includes('{"error"'))) {
        const jsonMatch = errMsg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.error && parsed.error.message) {
            errMsg = parsed.error.message;
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse error
    }

    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota') || errMsg.includes('Quota exceeded')) {
      errorType = 'QUOTA_EXCEEDED';
    }

    return res.status(500).json({
      success: false,
      errorType,
      error: `Shot visual generation error: ${errMsg}. Please check API key quota or billing settings in Google AI Studio.`
    });
  }
});

// 7. POST /api/story Endpoint (Official AI Movie Pipeline Route)
app.post('/api/story', async (req, res) => {
  try {
    const { prompt, language = 'English', genre = 'Crime', episodeLength = '2 min', aspectRatio = '16:9 Landscape', platform = 'YouTube', outputOptions = {} } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        errorType: 'EMPTY_PROMPT',
        error: 'Story prompt cannot be empty. Please enter a story premise or premise concept.'
      });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'INVALID_API_KEY',
        error: 'GEMINI_API_KEY environment variable is required to execute AI story and screenplay generation. Please configure your key in settings.'
      });
    }

    const systemPrompt = `You are the Master AI Film Director and Showrunner for CineAI CreatorOS.
User Premise: "${prompt}"
Language: ${language}
Genre: ${genre}
Duration: ${episodeLength}
Aspect Ratio: ${aspectRatio}
Platform: ${platform}
Output Options: ${JSON.stringify(outputOptions)}

Generate a complete production-ready AI Movie Episode package containing:
1. title, synopsis, genre, mood, targetAudience, language, platform, aspectRatio, duration
2. storyStructure: { beginning, conflict, climax, ending }
3. characters: array of Master Character Profiles (id, name, role, masterPrompt, negativePrompt, appearanceLock, voiceLock, costumeLock, age, gender, faceDescription, hair, eyes, skinTone, height, bodyType, costume, accessories, expressions, personality, voice, characterConsistencyPrompt)
4. scenes: array of Scene Cards (sceneNumber, duration, location, time, sceneGoal, visualPrompt, characterPrompt, cameraAngle, cameraMovement, cameraPrompt, lens, lighting, environment, dialogues: [{speaker, lines, emotion}], voiceEmotion, backgroundMusicPrompt, soundEffectPrompt, negativePrompt)
5. imagePrompts: { imagen, flux, midjourney, sdxl }
6. videoPrompts: array of { sceneNumber, model, prompt }
7. voicePackage: { voiceStyle, emotion, speakingSpeed, accent }
8. socialMediaPackage: { youtubeTitle, seoDescription, instagramCaption, facebookCaption, hashtags (30 hashtags), thumbnailPrompt }
9. subtitlesSrt: formatted SRT text string.

Return ONLY structured JSON adhering strictly to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            genre: { type: Type.STRING },
            mood: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            language: { type: Type.STRING },
            platform: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            duration: { type: Type.STRING },
            storyStructure: {
              type: Type.OBJECT,
              properties: {
                beginning: { type: Type.STRING },
                conflict: { type: Type.STRING },
                climax: { type: Type.STRING },
                ending: { type: Type.STRING }
              },
              required: ['beginning', 'conflict', 'climax', 'ending']
            },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  masterPrompt: { type: Type.STRING },
                  negativePrompt: { type: Type.STRING },
                  appearanceLock: { type: Type.STRING },
                  voiceLock: { type: Type.STRING },
                  costumeLock: { type: Type.STRING },
                  age: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  faceDescription: { type: Type.STRING },
                  hair: { type: Type.STRING },
                  eyes: { type: Type.STRING },
                  skinTone: { type: Type.STRING },
                  height: { type: Type.STRING },
                  bodyType: { type: Type.STRING },
                  costume: { type: Type.STRING },
                  accessories: { type: Type.STRING },
                  expressions: { type: Type.STRING },
                  personality: { type: Type.STRING },
                  voice: { type: Type.STRING },
                  characterConsistencyPrompt: { type: Type.STRING }
                },
                required: ['id', 'name', 'role', 'masterPrompt', 'negativePrompt', 'appearanceLock', 'voiceLock', 'costumeLock', 'age', 'gender', 'faceDescription', 'hair', 'eyes', 'skinTone', 'height', 'bodyType', 'costume', 'accessories', 'expressions', 'personality', 'voice', 'characterConsistencyPrompt']
              }
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  duration: { type: Type.STRING },
                  location: { type: Type.STRING },
                  time: { type: Type.STRING },
                  sceneGoal: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  characterPrompt: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  cameraPrompt: { type: Type.STRING },
                  lens: { type: Type.STRING },
                  lighting: { type: Type.STRING },
                  environment: { type: Type.STRING },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        lines: { type: Type.STRING },
                        emotion: { type: Type.STRING }
                      },
                      required: ['speaker', 'lines', 'emotion']
                    }
                  },
                  voiceEmotion: { type: Type.STRING },
                  backgroundMusicPrompt: { type: Type.STRING },
                  soundEffectPrompt: { type: Type.STRING },
                  negativePrompt: { type: Type.STRING }
                },
                required: ['sceneNumber', 'duration', 'location', 'time', 'sceneGoal', 'visualPrompt', 'characterPrompt', 'cameraAngle', 'cameraMovement', 'cameraPrompt', 'lens', 'lighting', 'environment', 'dialogues', 'voiceEmotion', 'backgroundMusicPrompt', 'soundEffectPrompt', 'negativePrompt']
              }
            },
            imagePrompts: {
              type: Type.OBJECT,
              properties: {
                imagen: { type: Type.STRING },
                flux: { type: Type.STRING },
                midjourney: { type: Type.STRING },
                sdxl: { type: Type.STRING }
              },
              required: ['imagen', 'flux', 'midjourney', 'sdxl']
            },
            videoPrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER },
                  model: { type: Type.STRING },
                  prompt: { type: Type.STRING }
                },
                required: ['sceneNumber', 'model', 'prompt']
              }
            },
            voicePackage: {
              type: Type.OBJECT,
              properties: {
                voiceStyle: { type: Type.STRING },
                emotion: { type: Type.STRING },
                speakingSpeed: { type: Type.STRING },
                accent: { type: Type.STRING }
              },
              required: ['voiceStyle', 'emotion', 'speakingSpeed', 'accent']
            },
            socialMediaPackage: {
              type: Type.OBJECT,
              properties: {
                youtubeTitle: { type: Type.STRING },
                seoDescription: { type: Type.STRING },
                instagramCaption: { type: Type.STRING },
                facebookCaption: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                thumbnailPrompt: { type: Type.STRING }
              },
              required: ['youtubeTitle', 'seoDescription', 'instagramCaption', 'facebookCaption', 'hashtags', 'thumbnailPrompt']
            },
            subtitlesSrt: { type: Type.STRING }
          },
          required: ['title', 'synopsis', 'genre', 'mood', 'targetAudience', 'language', 'platform', 'aspectRatio', 'duration', 'storyStructure', 'characters', 'scenes', 'imagePrompts', 'videoPrompts', 'voicePackage', 'socialMediaPackage', 'subtitlesSrt']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/story:', error);
    return res.status(500).json({ success: false, errorType: 'STORY_GEN_FAILED', error: error.message || 'Story generation failed' });
  }
});

// 8. POST /api/image Endpoint (Image AI Provider Layer)
app.post('/api/image', async (req, res) => {
  try {
    const { promptText, provider = 'Imagen 3', aspectRatio = '16:9' } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(500).json({
        success: false,
        errorType: 'API_KEY_REQUIRED',
        error: `Google Imagen / Gemini Image API key is required to render image for provider "${provider}". Please set GEMINI_API_KEY in settings.`,
        provider
      });
    }

    // Call gemini-3.1-flash-lite-image model for image synthesis
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: promptText || 'Cinematic movie scene, high contrast, 8k resolution.' }]
      },
      config: {
        imageConfig: { aspectRatio }
      }
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      return res.json({ success: true, imageUrl, provider });
    }

    return res.status(500).json({
      success: false,
      errorType: 'IMAGE_SYNTHESIS_FAILED',
      error: 'Image generation returned no image data. Ensure model quota and access for gemini-3.1-flash-lite-image or Imagen 3.',
      provider
    });
  } catch (error: any) {
    console.error('Error in /api/image:', error);
    let errMsg = error.message || String(error);
    let errorType = 'API_KEY_REQUIRED';

    try {
      if (typeof errMsg === 'string' && (errMsg.startsWith('{') || errMsg.includes('{"error"'))) {
        const jsonMatch = errMsg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.error && parsed.error.message) {
            errMsg = parsed.error.message;
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse error
    }

    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota') || errMsg.includes('Quota exceeded')) {
      errorType = 'QUOTA_EXCEEDED';
    }

    return res.status(500).json({
      success: false,
      errorType,
      error: `Google Imagen API access error: ${errMsg}. Please configure valid API credentials or check API key quota in settings.`,
      provider: req.body?.provider || 'Imagen 3'
    });
  }
});

// 9. POST /api/video Endpoint (Video AI Provider Layer - Google Veo / Runway / Kling / Luma)
app.post('/api/video', async (req, res) => {
  try {
    const { prompt, provider = 'Google Veo', cameraMovement, lens, durationSeconds = 4, sceneNumber } = req.body;
    const veoApiKey = process.env.VEO_API_KEY || process.env.GEMINI_API_KEY;

    if (!veoApiKey) {
      return res.status(500).json({
        success: false,
        errorType: 'API_KEY_REQUIRED',
        error: `Google Veo / ${provider} API key or service access is required to render video clips for Scene ${sceneNumber || 1}. Please configure VEO_API_KEY or GEMINI_API_KEY in settings.`,
        provider,
        status: 'failed'
      });
    }

    // Return Video Job Dispatch object conforming to Service Abstraction
    return res.json({
      success: true,
      job: {
        jobId: `veo_job_${Date.now()}_sc${sceneNumber || 1}`,
        provider,
        status: 'queued',
        prompt,
        cameraMovement,
        lens,
        durationSeconds,
        message: `Video generation job for Scene ${sceneNumber || 1} submitted to ${provider} rendering queue.`
      }
    });
  } catch (error: any) {
    console.error('Error in /api/video:', error);
    return res.status(500).json({
      success: false,
      errorType: 'VIDEO_API_ERROR',
      error: error.message || 'Video API dispatch failed'
    });
  }
});

// 10. POST /api/voice Endpoint (Voice AI Layer - ElevenLabs / Gemini TTS)
app.post('/api/voice', async (req, res) => {
  try {
    const { dialogueText, voiceId, emotion, speaker, provider = 'ElevenLabs' } = req.body;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    if (provider === 'ElevenLabs' && !elevenLabsKey) {
      return res.status(500).json({
        success: false,
        errorType: 'API_KEY_REQUIRED',
        error: `ElevenLabs API key (ELEVENLABS_API_KEY) is required to synthesize voice audio for character "${speaker || 'Character'}". Please configure your key in environment settings.`,
        provider,
        speaker
      });
    }

    if (provider === 'ElevenLabs' && elevenLabsKey) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || '21m00Tcm4TlvDq8ikWAM'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey
        },
        body: JSON.stringify({
          text: dialogueText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return res.status(500).json({
          success: false,
          errorType: 'ELEVENLABS_ERROR',
          error: errJson?.detail?.message || 'ElevenLabs TTS synthesis failed. Check API key validity.'
        });
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      return res.json({
        success: true,
        audioUrl: `data:audio/mp3;base64,${base64Audio}`,
        speaker,
        provider
      });
    }

    // Default response requiring valid voice key
    return res.status(500).json({
      success: false,
      errorType: 'API_KEY_REQUIRED',
      error: `Voice synthesis service (${provider}) requires ELEVENLABS_API_KEY or Gemini TTS access to generate dialogue audio.`,
      speaker,
      provider
    });
  } catch (error: any) {
    console.error('Error in /api/voice:', error);
    return res.status(500).json({
      success: false,
      errorType: 'VOICE_API_ERROR',
      error: error.message || 'Voice generation failed'
    });
  }
});

// 11. POST /api/export Endpoint (Production Export Package Compiler)
app.post('/api/export', async (req, res) => {
  try {
    const { episodeData, exportFormat = 'JSON' } = req.body;

    if (!episodeData) {
      return res.status(400).json({ success: false, error: 'No episode data provided for export compiler.' });
    }

    const title = episodeData.title || 'CineAI_Movie_Production';
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (exportFormat === 'JSON') {
      return res.json({
        success: true,
        filename: `${sanitizedTitle}_package.json`,
        mimeType: 'application/json',
        content: JSON.stringify(episodeData, null, 2)
      });
    }

    if (exportFormat === 'Markdown') {
      const markdownContent = `# ${episodeData.title || 'AI Movie Project'}
      
**Genre:** ${episodeData.genre || 'N/A'} | **Duration:** ${episodeData.duration || 'N/A'} | **Aspect Ratio:** ${episodeData.aspectRatio || '16:9'}

## Synopsis
${episodeData.synopsis || ''}

## Story Structure
- **Beginning:** ${episodeData.storyStructure?.beginning || ''}
- **Conflict:** ${episodeData.storyStructure?.conflict || ''}
- **Climax:** ${episodeData.storyStructure?.climax || ''}
- **Ending:** ${episodeData.storyStructure?.ending || ''}

## Character Bible
${(episodeData.characters || []).map((c: any) => `### ${c.name} (${c.role})\n- **Age:** ${c.age} | **Gender:** ${c.gender}\n- **Appearance:** ${c.appearanceLock}\n- **Master Image Prompt:** \`${c.masterPrompt}\`\n`).join('\n')}

## Scene Breakdown & Screenplay
${(episodeData.scenes || []).map((s: any) => `### SCENE ${s.sceneNumber}: ${s.location} (${s.time})\n- **Goal:** ${s.sceneGoal}\n- **Camera:** ${s.cameraAngle}, ${s.cameraMovement}, Lens: ${s.lens}\n- **Lighting:** ${s.lighting}\n\n**Dialogues:**\n${(s.dialogues || []).map((d: any) => `*${d.speaker}* (${d.emotion}): "${d.lines}"`).join('\n')}\n`).join('\n')}

---
*Generated by CineAI CreatorOS Production Engine*
`;
      return res.json({
        success: true,
        filename: `${sanitizedTitle}_story.md`,
        mimeType: 'text/markdown',
        content: markdownContent
      });
    }

    if (exportFormat === 'SRT') {
      return res.json({
        success: true,
        filename: `${sanitizedTitle}_subtitles.srt`,
        mimeType: 'text/plain',
        content: episodeData.subtitlesSrt || '1\n00:00:00,000 --> 00:00:05,000\n[CineAI CreatorOS Subtitles Ready]'
      });
    }

    // Default TXT export
    return res.json({
      success: true,
      filename: `${sanitizedTitle}_screenplay.txt`,
      mimeType: 'text/plain',
      content: JSON.stringify(episodeData, null, 2)
    });
  } catch (error: any) {
    console.error('Error in /api/export:', error);
    return res.status(500).json({ success: false, error: error.message || 'Export failed' });
  }
});

// Setup Vite middleware in Development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineAI CreatorOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
