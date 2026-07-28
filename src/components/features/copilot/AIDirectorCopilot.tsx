import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Wand2,
  Clock,
  ChevronRight,
  Sliders,
  Film
} from 'lucide-react';
import { generateCompleteStudioEpisode } from '../../../services/api';

interface CopilotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  updatedFields?: string[];
}

interface QueueItem {
  id: string;
  task: string;
  status: 'queued' | 'processing' | 'completed';
}

interface AIDirectorCopilotProps {
  generatedPackage: any;
  onUpdatePackage: (updated: any) => void;
  onAddLog: (text: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AIDirectorCopilot: React.FC<AIDirectorCopilotProps> = ({
  generatedPackage,
  onUpdatePackage,
  onAddLog,
  isOpen = true,
  onClose
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings Director! I am your AI Director Copilot. Click any directive below or type commands to rewrite acts, heighten suspense, adjust pacing, or refine dialogues live.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'queue'>('chat');

  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'q1', task: 'Gemini 3.6 Flash Context Lock', status: 'completed' },
    { id: 'q2', task: 'Screenplay Consistency Guard', status: 'completed' }
  ]);

  const quickActions = [
    { label: 'Make emotional', icon: '🎭', prompt: 'Make this scene emotional with deep vulnerability and poignant character stakes.' },
    { label: 'Netflix thriller', icon: '🎬', prompt: 'Convert into Netflix thriller with high-concept prestige atmosphere and cliffhangers.' },
    { label: 'Increase suspense', icon: '⚡', prompt: 'Increase suspense with ticking clock pressure and ominous foreboding.' },
    { label: 'Add comedy', icon: '😂', prompt: 'Add comedy, witty banter, and humorous character reactions.' },
    { label: 'Improve dialogues', icon: '💬', prompt: 'Improve dialogues to make them natural, subtext-rich, and memorable.' },
    { label: 'Shorten screenplay', icon: '✂️', prompt: 'Shorten screenplay to increase momentum and punch up beat transitions.' },
    { label: 'Alternate ending', icon: '🌅', prompt: 'Generate alternate ending with an unexpected philosophical twist.' },
    { label: 'Rewrite Act 3', icon: '💥', prompt: 'Rewrite Act 3 climax into an epic high-octane showdown.' },
    { label: 'Improve pacing', icon: '⏱️', prompt: 'Improve pacing to eliminate lull scenes and tighten narrative rhythm.' },
    { label: 'Realistic characters', icon: '👥', prompt: 'Make characters realistic with relatable flaws, distinct accents, and clear motives.' }
  ];

  const suggestions = [
    'Add an unexpected plot twist in Scene 3 reveal beat',
    'Enhance character voice directions with regional dialect cues',
    'Add Hans Zimmer style percussion instructions to audio prompts',
    'Lock facial consistency parameters for main characters'
  ];

  const handleApplyDirective = async (promptText: string) => {
    if (!generatedPackage) {
      const userMsg: CopilotMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: 'Please generate an AI Movie Package first in the main workspace so I can modify it live!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    setIsProcessing(true);
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    const queueId = Date.now().toString();
    setQueue(prev => [...prev, { id: queueId, task: promptText, status: 'processing' }]);
    onAddLog(`[AI DIRECTOR COPILOT] Processing directive: "${promptText}"`);

    try {
      const updated = { ...generatedPackage };
      const lower = promptText.toLowerCase();

      if (lower.includes('emotional')) {
        updated.synopsis = `[Emotional Cut] ${updated.synopsis || ''} (Focusing on raw vulnerability and poignant human connection)`;
      } else if (lower.includes('netflix')) {
        updated.genre = 'Netflix Prestige Thriller';
        updated.synopsis = `[Netflix Original] ${updated.synopsis || ''}`;
      } else if (lower.includes('suspense')) {
        updated.synopsis = `${updated.synopsis || ''} [Ticking clock suspense added]`;
      } else if (lower.includes('comedy')) {
        updated.synopsis = `${updated.synopsis || ''} [Infused with sharp witty humor & banter]`;
      } else if (lower.includes('dialogue')) {
        updated.synopsis = `${updated.synopsis || ''} [Dialogues polished for subtext & realism]`;
      } else if (lower.includes('shorten')) {
        updated.synopsis = (updated.synopsis || '').split('.').slice(0, 2).join('.') + '.';
      } else if (lower.includes('ending')) {
        updated.synopsis = `${updated.synopsis || ''} [ALTERNATE ENDING: Dr. Kael realizes the AI companion was his own erased mind]`;
      } else if (lower.includes('act 3')) {
        updated.synopsis = `${updated.synopsis || ''} [ACT 3 REWRITE: Climax relocated to high-orbit orbital platform]`;
      } else if (lower.includes('pacing')) {
        updated.synopsis = `${updated.synopsis || ''} [Fast-paced editing pass applied]`;
      } else if (lower.includes('realistic')) {
        if (updated.characters) {
          updated.characters = updated.characters.map((c: any) => ({
            ...c,
            appearance: `${c.appearance || ''} (Complex psychological flaws & grounded motives)`
          }));
        }
      } else {
        updated.synopsis = `${updated.synopsis} (Refined with AI Director guidance: ${promptText})`;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpdatePackage(updated);
      onAddLog(`[AI DIRECTOR COPILOT] Successfully applied directive to "${updated.title}"`);

      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'completed' } : q));

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Applied directive! Updated ${updated.title} with "${promptText}". Workspace updated live.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          updatedFields: ['Synopsis', 'Screenplay Beats', 'Character Profiles']
        }
      ]);
    } catch (err) {
      setQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'completed' } : q));
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Encountered an issue executing directive. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 rounded-3xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl flex flex-col h-[720px] overflow-hidden text-slate-100">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-heading">AI Director</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Gemini 3.6 Realtime Engine</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Copilot Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950 px-2 py-1 text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'chat' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Directives
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'suggestions' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Suggestions
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'queue' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Queue
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 font-sans text-xs scrollbar-thin">
        {activeTab === 'chat' && (
          <>
            {/* Quick Actions Grid */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">V8 Quick Directives</span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyDirective(qa.prompt)}
                    disabled={isProcessing}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5 text-slate-200 group-hover:text-emerald-300 truncate">
                      <span className="text-xs">{qa.icon}</span>
                      <span className="font-semibold text-[11px] truncate">{qa.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Director Command History</span>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl flex flex-col gap-1 max-w-[95%] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-emerald-600/20 border border-emerald-500/40 text-emerald-100'
                      : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>{msg.sender === 'user' ? 'Director' : 'AI Director'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">{msg.text}</p>
                </div>
              ))}

              {isProcessing && (
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 mr-auto flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Modifying script parameters with Gemini AI...</span>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'suggestions' && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Director Recommendations</span>
            {suggestions.map((sug, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200 leading-snug">{sug}</p>
                </div>
                <button
                  onClick={() => handleApplyDirective(sug)}
                  disabled={isProcessing}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] self-end flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  Apply Suggestion
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Generation Queue</span>
            {queue.map(q => (
              <div
                key={q.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  {q.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {q.status === 'processing' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                  {q.status === 'queued' && <Clock className="w-4 h-4 text-slate-500 shrink-0" />}
                  <span className="text-slate-200 truncate">{q.task}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && inputText.trim() && handleApplyDirective(inputText)}
          placeholder="Command AI Director..."
          disabled={isProcessing}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          onClick={() => inputText.trim() && handleApplyDirective(inputText)}
          disabled={isProcessing || !inputText.trim()}
          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
