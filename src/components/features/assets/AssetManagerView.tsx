import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Folder,
  Image as ImageIcon,
  Video,
  Mic,
  Music,
  Volume2,
  FileText,
  Download,
  Trash2,
  Edit2,
  UploadCloud,
  Play,
  Pause,
  Eye,
  FileDown,
  Check,
  Search,
  Filter
} from 'lucide-react';

export interface AssetFile {
  id: string;
  name: string;
  category: 'Images' | 'Videos' | 'Audio' | 'Voice' | 'Music' | 'SFX' | 'Subtitles' | 'Exports';
  size: string;
  updatedAt: string;
  url?: string;
  previewType: 'image' | 'audio' | 'video' | 'text';
  contentSnippet?: string;
}

interface AssetManagerViewProps {
  generatedPackage?: any;
}

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({ generatedPackage }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Images' | 'Videos' | 'Audio' | 'Voice' | 'Music' | 'SFX' | 'Subtitles' | 'Exports'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [assets, setAssets] = useState<AssetFile[]>([
    {
      id: 'ast-1',
      name: 'Cyberpunk_City_8K_KeyArt.png',
      category: 'Images',
      size: '4.8 MB',
      updatedAt: 'Today, 14:20',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60',
      previewType: 'image'
    },
    {
      id: 'ast-2',
      name: 'Protagonist_Facial_Anchor.png',
      category: 'Images',
      size: '3.2 MB',
      updatedAt: 'Today, 14:21',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
      previewType: 'image'
    },
    {
      id: 'ast-3',
      name: 'Scene_1_Anamorphic_Camera_Pass.mp4',
      category: 'Videos',
      size: '28.4 MB',
      updatedAt: 'Today, 14:25',
      previewType: 'video'
    },
    {
      id: 'ast-4',
      name: 'Voiceover_Act1_ElevenLabs_HD.mp3',
      category: 'Voice',
      size: '6.1 MB',
      updatedAt: 'Today, 14:28',
      previewType: 'audio'
    },
    {
      id: 'ast-5',
      name: 'Synthwave_Cinematic_Score.wav',
      category: 'Music',
      size: '18.9 MB',
      updatedAt: 'Today, 14:30',
      previewType: 'audio'
    },
    {
      id: 'ast-6',
      name: 'Futuristic_Door_Pneumatic_SFX.mp3',
      category: 'SFX',
      size: '1.4 MB',
      updatedAt: 'Today, 14:31',
      previewType: 'audio'
    },
    {
      id: 'ast-7',
      name: 'English_Subtitles_Timecoded.srt',
      category: 'Subtitles',
      size: '48 KB',
      updatedAt: 'Today, 14:32',
      previewType: 'text',
      contentSnippet: `1\n00:00:01,000 --> 00:00:04,200\n[NEON RAIN HISSES]\nThe rain never stops in Sector 9.\n\n2\n00:00:04,500 --> 00:00:08,100\nThey thought they wiped our memories. They were wrong.`
    },
    {
      id: 'ast-8',
      name: 'Full_Production_Master_Package.zip',
      category: 'Exports',
      size: '64.5 MB',
      updatedAt: 'Today, 14:35',
      previewType: 'text',
      contentSnippet: 'Contains Screenplay PDF, Character Bibles, 8K Image Prompts, Voice Tracks & SRT Subtitles.'
    }
  ]);

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredAssets = assets.filter(a => {
    const matchesCategory = activeTab === 'All' || a.category === activeTab;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleStartRename = (asset: AssetFile) => {
    setEditingAssetId(asset.id);
    setNewName(asset.name);
  };

  const handleSaveRename = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, name: newName } : a));
    setEditingAssetId(null);
  };

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const targetCategory = activeTab === 'All' ? 'Images' : activeTab;

    const newAsset: AssetFile = {
      id: `ast-${Date.now()}`,
      name: `Uploaded_Asset_${Date.now().toString().slice(-4)}.png`,
      category: targetCategory as any,
      size: '2.4 MB',
      updatedAt: 'Just now',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      previewType: 'image'
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-emerald-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Folder className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">Asset Library</h1>
          </div>
          <p className="text-xs text-slate-400">
            Central repository for Images, Videos, Audio, Voices, Music, SFX, Subtitles, and Exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <Badge variant="emerald">{assets.length} Assets</Badge>
        </div>
      </GlassCard>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {[
          { id: 'All', label: 'All Assets', icon: Folder },
          { id: 'Images', label: 'Images', icon: ImageIcon },
          { id: 'Videos', label: 'Videos', icon: Video },
          { id: 'Audio', label: 'Audio', icon: Volume2 },
          { id: 'Voice', label: 'Voices', icon: Mic },
          { id: 'Music', label: 'Music', icon: Music },
          { id: 'SFX', label: 'SFX', icon: Volume2 },
          { id: 'Subtitles', label: 'Subtitles', icon: FileText },
          { id: 'Exports', label: 'Exports', icon: FileDown }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = tab.id === 'All' ? assets.length : assets.filter(a => a.category === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border
                ${isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleSimulatedDrop}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
        }`}
      >
        <UploadCloud className={`w-8 h-8 ${isDragOver ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
        <span className="text-xs font-bold text-slate-200">
          Drag & Drop custom files into <span className="text-emerald-400">{activeTab}</span>
        </span>
        <span className="text-[10px] text-slate-500">Supports PNG, JPG, MP4, WAV, MP3, SRT & ZIP up to 500MB</span>
      </div>

      {/* Asset Cards Grid */}
      {filteredAssets.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-2">
          <Folder className="w-10 h-10 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-400">No {activeTab} Assets Found</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Drag & drop files above or search with another keyword.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <GlassCard key={asset.id} className="p-4 flex flex-col justify-between gap-3 border-slate-800/90 hover:border-slate-700 transition-all">
              {/* Media Preview Box */}
              <div className="relative w-full h-40 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center group">
                {asset.previewType === 'image' && asset.url ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : asset.previewType === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
                    <Video className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400">MP4 Render Pass (1080p 60fps)</span>
                  </div>
                ) : asset.previewType === 'audio' ? (
                  <div className="w-full h-full bg-slate-900 p-4 flex flex-col items-center justify-center gap-3 text-slate-300">
                    <div className="flex items-center gap-1 h-8">
                      {[40, 70, 30, 90, 60, 100, 40, 80, 50, 90, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: playingAudioId === asset.id ? `${h}%` : '30%' }}
                          className={`w-1 rounded-full transition-all duration-300 ${playingAudioId === asset.id ? 'bg-emerald-400' : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setPlayingAudioId(playingAudioId === asset.id ? null : asset.id)}
                      className="px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
                    >
                      {playingAudioId === asset.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingAudioId === asset.id ? 'Pause Preview' : 'Play Audio'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full p-3 bg-slate-950 font-mono text-[10px] text-slate-400 overflow-y-auto leading-relaxed">
                    {asset.contentSnippet}
                  </div>
                )}
              </div>

              {/* Name & Metadata */}
              <div className="flex flex-col gap-1">
                {editingAssetId === asset.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-slate-950 border border-emerald-500 text-xs text-white"
                    />
                    <button onClick={() => handleSaveRename(asset.id)} className="p-1 text-emerald-400 hover:text-white">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">{asset.name}</span>
                    <button onClick={() => handleStartRename(asset)} className="text-slate-500 hover:text-slate-300">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-bold">{asset.category}</span>
                  <span>{asset.size}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={asset.url || '#'}
                  download={asset.name}
                  onClick={(e) => {
                    if (!asset.url) {
                      e.preventDefault();
                      alert(`Downloading ${asset.name} (${asset.size}) to your workstation.`);
                    }
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
