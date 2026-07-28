import React from 'react';
import { Film, Heart, Cpu, CheckCircle, RefreshCw, Zap } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl py-5 px-4 sm:px-8 mt-auto z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        
        {/* Left: Brand & Tagline & Version */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-200 tracking-tight">CineAI CreatorOS</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
              v10.0.0-PROD
            </span>
          </div>
        </div>

        {/* Center: Author Credit (MANDATORY REQUIREMENT) */}
        <div className="flex items-center gap-2 font-medium text-slate-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 shadow-inner">
          <span className="text-slate-400">Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-slate-400">by</span>
          <span className="font-bold text-emerald-400 tracking-wider font-heading uppercase text-[11px]">
            SHUBHAM MALANDE
          </span>
        </div>

        {/* Right: Live Engine & Operational Status Indicators */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini 3.6 Online</span>
          </span>

          <span className="flex items-center gap-1.5 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Synced: Just now</span>
          </span>

          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Production Ready</span>
          </span>
        </div>

      </div>
    </footer>
  );
};
