import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  Cpu,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import { RenderJob } from '../../types';
import { jobQueueManager } from '../../services/jobQueueService';

export const FloatingJobConsole: React.FC = () => {
  const [activeJob, setActiveJob] = useState<RenderJob | null>(null);
  const [jobsHistory, setJobsHistory] = useState<RenderJob[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'logs' | 'history'>('active');

  useEffect(() => {
    const unsubscribe = jobQueueManager.subscribe((jobs, active) => {
      setJobsHistory(jobs);
      setActiveJob(active);
    });
    return () => unsubscribe();
  }, []);

  if (!activeJob && jobsHistory.length === 0) {
    return null; // Don't render floating console if no jobs ever created
  }

  const currentDisplayJob = activeJob || jobsHistory[0];
  if (!currentDisplayJob) return null;

  const isRunning = currentDisplayJob.status !== 'Completed' && currentDisplayJob.status !== 'Failed' && currentDisplayJob.status !== 'Cancelled';

  const formatElapsed = (startTimeStr: string) => {
    const elapsedMs = Math.max(0, Date.now() - new Date(startTimeStr).getTime());
    const seconds = Math.floor(elapsedMs / 1000) % 60;
    const minutes = Math.floor(elapsedMs / 60000);
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full sm:w-96 font-sans">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 shadow-2xl overflow-hidden text-zinc-100"
        >
          {/* Header Bar */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-zinc-800/50 cursor-pointer select-none hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {isRunning ? (
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                ) : currentDisplayJob.status === 'Completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold tracking-wide text-zinc-200 truncate">
                    {currentDisplayJob.title || 'AI Render Engine'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                      isRunning
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : currentDisplayJob.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {currentDisplayJob.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {currentDisplayJob.currentStageName || 'Processing pipeline...'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 pl-2">
              <span className="text-xs font-mono font-bold text-indigo-400">
                {Math.round(currentDisplayJob.progressPercent)}%
              </span>
              <button
                type="button"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mini Progress Indicator */}
          <div className="h-1 bg-zinc-900 w-full overflow-hidden">
            <motion.div
              className={`h-full ${
                currentDisplayJob.status === 'Completed'
                  ? 'bg-emerald-500'
                  : currentDisplayJob.status === 'Failed'
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${currentDisplayJob.progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Expanded Detail Panel */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-3 bg-zinc-950/80 text-xs"
            >
              {/* Tab selector */}
              <div className="flex items-center space-x-1 border-b border-zinc-800/60 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('active')}
                  className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                    activeTab === 'active'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Active Pipeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                    activeTab === 'logs'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Logs ({currentDisplayJob.logs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-colors ${
                    activeTab === 'history'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Job Queue ({jobsHistory.length})
                </button>
              </div>

              {activeTab === 'active' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
                      <span className="text-zinc-500 block text-[10px]">AI PROVIDER</span>
                      <span className="text-zinc-200 font-medium truncate block mt-0.5">
                        {currentDisplayJob.provider || 'Gemini 3.6 + Veo'}
                      </span>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
                      <span className="text-zinc-500 block text-[10px]">ELAPSED TIME</span>
                      <span className="text-zinc-200 font-medium truncate block mt-0.5">
                        {formatElapsed(currentDisplayJob.startedTime)}
                      </span>
                    </div>
                  </div>

                  {currentDisplayJob.errorMessage && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                      {currentDisplayJob.errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {isRunning ? (
                      <button
                        type="button"
                        onClick={() => jobQueueManager.cancelJob(currentDisplayJob.jobId)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-[11px] transition-colors flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Cancel Render</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => jobQueueManager.retryJob(currentDisplayJob.jobId)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors flex items-center space-x-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Retry Stage</span>
                      </button>
                    )}

                    <span className="text-[10px] text-zinc-500 font-mono">
                      ID: {currentDisplayJob.jobId.slice(0, 12)}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="max-h-48 overflow-y-auto font-mono text-[10px] bg-zinc-900/80 rounded-lg p-2.5 border border-zinc-800/60 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
                  {currentDisplayJob.logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-zinc-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span
                        className={
                          log.level === 'error'
                            ? 'text-rose-400'
                            : log.level === 'warn'
                            ? 'text-amber-400'
                            : log.level === 'success'
                            ? 'text-emerald-400'
                            : 'text-zinc-300'
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {jobsHistory.map((j) => (
                    <div
                      key={j.jobId}
                      className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/40 flex items-center justify-between text-[11px]"
                    >
                      <div className="truncate mr-2">
                        <p className="font-medium text-zinc-200 truncate">{j.title}</p>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(j.startedTime).toLocaleDateString()} • {j.status}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-400">{Math.round(j.progressPercent)}%</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => jobQueueManager.clearJobHistory()}
                    className="w-full text-center py-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors pt-2"
                  >
                    Clear History
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
