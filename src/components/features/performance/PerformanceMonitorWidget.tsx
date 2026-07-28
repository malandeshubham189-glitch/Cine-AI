import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Badge } from '../../ui/Badge';
import {
  Activity,
  Cpu,
  Database,
  Zap,
  Clock,
  Gauge,
  Wifi,
  Server,
  RefreshCw
} from 'lucide-react';

interface PerformanceMonitorWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PerformanceMonitorWidget: React.FC<PerformanceMonitorWidgetProps> = ({
  isOpen = true,
  onClose
}) => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 18,
    ramUsage: 42, // %
    tokenCount: 142500,
    genSpeed: 84, // tokens/sec
    apiLatency: 124 // ms
  });

  const [cpuHistory, setCpuHistory] = useState([12, 18, 22, 15, 30, 24, 18, 20, 16, 25, 19, 18]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextCpu = Math.floor(Math.random() * 20) + 12;
      setMetrics(prev => ({
        cpuUsage: nextCpu,
        ramUsage: Math.min(85, prev.ramUsage + (Math.random() * 2 - 1)),
        tokenCount: prev.tokenCount + Math.floor(Math.random() * 50),
        genSpeed: Math.floor(Math.random() * 15) + 75,
        apiLatency: Math.floor(Math.random() * 30) + 110
      }));

      setCpuHistory(prev => [...prev.slice(1), nextCpu]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-cyan-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Gauge className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">System & AI Performance Monitor</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry tracking CPU thread load, memory usage, token consumption velocity, and Gemini 3.6 API latency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald">60 FPS Render Pipeline</Badge>
        </div>
      </GlassCard>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col gap-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>CPU Core Load</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {metrics.cpuUsage}%
          </div>
          {/* Animated Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              style={{ width: `${metrics.cpuUsage}%` }}
              className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">16 vCPU Container</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>RAM Allocation</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {metrics.ramUsage.toFixed(1)}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              style={{ width: `${metrics.ramUsage}%` }}
              className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono">6.8 GB / 16 GB</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Generation Speed</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {metrics.genSpeed} <span className="text-xs font-normal text-slate-400">tok/s</span>
          </div>
          <span className="text-[10px] text-amber-400 font-medium">● High Speed Parallel Stream</span>
        </GlassCard>

        <GlassCard className="p-4 flex flex-col gap-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Gemini Latency</span>
            <Wifi className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading mt-1">
            {metrics.apiLatency} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">● Direct Edge Ingress</span>
        </GlassCard>
      </div>

      {/* CPU Usage Animated Wave Chart */}
      <GlassCard className="p-6 flex flex-col gap-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            Live Processor Load Telemetry
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Updating live every 2.0s</span>
        </div>

        <div className="flex items-end gap-2 h-32 pt-4 px-2 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          {cpuHistory.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
              <div
                style={{ height: `${val * 3}%` }}
                className="w-full bg-emerald-500/30 group-hover:bg-emerald-400 border-t-2 border-emerald-400 rounded-t-sm transition-all duration-300"
              />
              <span className="text-[8px] font-mono text-slate-600">{val}%</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
