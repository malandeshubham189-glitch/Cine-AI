import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface CreditBadgeProps {
  remaining: number;
  totalQuota: number;
  onPurchaseClick: () => void;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({
  remaining,
  totalQuota,
  onPurchaseClick
}) => {
  const percentage = Math.round((remaining / totalQuota) * 100);

  return (
    <div className="flex items-center gap-2">
      <div 
        onClick={onPurchaseClick}
        className="group cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-md shadow-amber-950/20"
      >
        <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
          <Coins className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-heading font-bold text-slate-100">{formatNumber(remaining)}</span>
            <span className="text-[10px] text-slate-400 font-normal">CR</span>
          </div>
          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" 
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
        <button 
          className="ml-1 p-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
          title="Buy More AI Credits"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
