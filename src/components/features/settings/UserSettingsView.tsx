import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Settings, Save, Check, Shield, Cpu, Palette, Globe, Film, Tv, Video } from 'lucide-react';
import { UserProfile, AIModelConfig } from '../../../types';

interface UserSettingsViewProps {
  user: UserProfile;
  config: AIModelConfig;
  onSaveUser: (u: UserProfile) => void;
  onSaveConfig: (c: AIModelConfig) => void;
  onNotify?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const UserSettingsView: React.FC<UserSettingsViewProps> = ({
  user,
  config,
  onSaveUser,
  onSaveConfig,
  onNotify
}) => {
  const [userName, setUserName] = useState(user.name);
  const [studioName, setStudioName] = useState(user.studioName);
  const [selectedTextModel, setSelectedTextModel] = useState(config.selectedTextModel);
  const [theme, setTheme] = useState(user.theme || 'Cinematic Dark');
  const [language, setLanguage] = useState(user.defaultLanguage || 'English');
  const [defaultEpisodeLength, setDefaultEpisodeLength] = useState(user.defaultEpisodeLength || '3-5 min Reel');
  const [defaultPlatform, setDefaultPlatform] = useState(user.defaultPlatform || 'YouTube Shorts');
  const [defaultAspectRatio, setDefaultAspectRatio] = useState(config.defaultAspectRatio || '16:9');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveUser({
      ...user,
      name: userName,
      studioName,
      theme,
      defaultLanguage: language,
      defaultEpisodeLength,
      defaultPlatform
    });
    onSaveConfig({ ...config, selectedTextModel, defaultAspectRatio });
    setSaved(true);
    if (onNotify) {
      onNotify('Settings Saved', 'Your studio OS preferences have been updated successfully.', 'success');
    }
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16 max-w-4xl text-slate-100">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-300">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-heading font-bold text-white">CineAI Studio V6 Settings</h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure default production parameters, theme preferences, platform defaults, and studio executive profile.
          </p>
        </div>

        <Button onClick={handleSave} variant="primary" icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}>
          {saved ? 'Saved Preferences' : 'Save Settings'}
        </Button>
      </GlassCard>

      {/* Production Defaults */}
      <GlassCard className="p-6 flex flex-col gap-4 border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Film className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-heading font-bold text-white">Default Production Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Default Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="German">German</option>
              <option value="Korean">Korean</option>
              <option value="Mandarin">Mandarin</option>
              <option value="Portuguese">Portuguese</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Default Episode Length</span>
            </label>
            <select
              value={defaultEpisodeLength}
              onChange={(e) => setDefaultEpisodeLength(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="1-2 min Short">1-2 min Short</option>
              <option value="3-5 min Reel">3-5 min Reel</option>
              <option value="8-10 min Web Series">8-10 min Web Series</option>
              <option value="15-20 min Feature">15-20 min Feature</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              <span>Default Platform</span>
            </label>
            <select
              value={defaultPlatform}
              onChange={(e) => setDefaultPlatform(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="TikTok">TikTok</option>
              <option value="OTT / Web Series">OTT / Web Series</option>
              <option value="Cinema Screen">Cinema Screen</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Default Aspect Ratio</span>
            </label>
            <select
              value={defaultAspectRatio}
              onChange={(e) => setDefaultAspectRatio(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="16:9">16:9 Widescreen Cinematic</option>
              <option value="9:16">9:16 Vertical Reel Format</option>
              <option value="2.39:1">2.39:1 Anamorphic Scope</option>
              <option value="1:1">1:1 Square Format</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Studio Theme</span>
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="Cinematic Dark">Cinematic Dark (Default)</option>
              <option value="Obsidian Glass">Obsidian Glass</option>
              <option value="Neon Matrix">Neon Matrix</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* AI Engine & Model Config */}
      <GlassCard className="p-6 flex flex-col gap-4 border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-heading font-bold text-white">AI Engine Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Script & Screenplay AI Model</label>
            <select
              value={selectedTextModel}
              onChange={(e) => setSelectedTextModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended - Ultra Fast)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Advanced Reasoning)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Studio Profile */}
      <GlassCard className="p-6 flex flex-col gap-4 border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-heading font-bold text-white">Studio Executive Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Creator / Showrunner Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Studio / Company Name</label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
