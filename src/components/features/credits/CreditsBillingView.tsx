import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { CreditCard, Coins, Check, Zap, ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import { UserProfile, CreditTransaction } from '../../../types';
import { formatNumber } from '../../../lib/utils';

interface CreditsBillingViewProps {
  user: UserProfile;
  transactions: CreditTransaction[];
  onTopUpCredits: (amount: number) => void;
}

export const CreditsBillingView: React.FC<CreditsBillingViewProps> = ({
  user,
  transactions,
  onTopUpCredits
}) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const plans = [
    { name: 'Creator', price: '$29/mo', credits: '10,000 CR', features: ['Gemini 3.6 Flash Access', 'Basic Storyboarding', 'FDX Export'] },
    { name: 'Studio Pro', price: '$89/mo', credits: '50,000 CR', features: ['Priority Gemini 3.6 Flash', 'AI Character Voice Synth', 'CSV & PDF Exporters', 'Dedicated Account Manager'], popular: true },
    { name: 'Enterprise OS', price: '$299/mo', credits: '250,000 CR', features: ['Unlimited Script Audits', 'Custom Fine-Tuned Models', 'Veo 3 Video Preview', 'Custom Studio SSO & API'] },
  ];

  const handleBuyPackage = (amount: number) => {
    onTopUpCredits(amount);
    setIsPurchaseModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Coins className="w-5 h-5" />
            <h1 className="text-2xl font-heading font-bold text-white">AI Credits & Billing Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Monitor AI token consumption, manage subscription tier, and top up studio credits.
          </p>
        </div>

        <Button onClick={() => setIsPurchaseModalOpen(true)} variant="accent" icon={<Plus className="w-4 h-4" />}>
          Top Up AI Credits
        </Button>
      </GlassCard>

      {/* Credit Balance Card & Plan Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard accentBorder="gold" className="p-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Active Credit Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-bold text-white tracking-tight">
                {formatNumber(user.creditsRemaining)}
              </span>
              <span className="text-xs text-slate-400 font-mono">CR</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {formatNumber(user.totalCreditsUsed)} credits consumed this billing period.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Monthly Quota:</span>
              <span className="font-bold text-slate-200">{formatNumber(user.monthlyQuota)} CR</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" 
                style={{ width: `${Math.min(100, (user.creditsRemaining / user.monthlyQuota) * 100)}%` }} 
              />
            </div>
          </div>
        </GlassCard>

        {/* Pricing Tiers */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <GlassCard 
              key={p.name} 
              className={`p-5 flex flex-col justify-between gap-4 ${p.popular ? 'border-amber-500/50 bg-slate-900/90' : 'border-slate-800'}`}
            >
              <div className="flex flex-col gap-2">
                {p.popular && <Badge variant="gold" className="w-fit">Most Popular</Badge>}
                <h3 className="text-base font-heading font-bold text-white">{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{p.price}</span>
                  <span className="text-[10px] text-slate-400">/month</span>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400 mt-1">{p.credits}</span>

                <ul className="flex flex-col gap-1.5 mt-3 text-xs text-slate-300">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => setIsPurchaseModalOpen(true)}
                variant={p.popular ? 'accent' : 'outline'}
                size="sm"
              >
                {user.plan === p.name ? 'Current Plan' : 'Select Plan'}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Credit Purchase Top Up Modal */}
      <Modal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} title="Top Up Studio AI Credits" subtitle="Instant credit refill for script generation and visual renders">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard hoverEffect onClick={() => handleBuyPackage(10000)} className="p-4 flex flex-col items-center text-center gap-2 border-slate-800 hover:border-amber-500/50">
            <Coins className="w-6 h-6 text-amber-400" />
            <span className="text-base font-bold text-white">10,000 CR</span>
            <span className="text-xs text-slate-400">$19.00</span>
            <Button size="sm" variant="accent" className="mt-2 w-full">Buy Pack</Button>
          </GlassCard>

          <GlassCard hoverEffect onClick={() => handleBuyPackage(25000)} className="p-4 flex flex-col items-center text-center gap-2 border-amber-500/40 bg-slate-900/90 hover:border-amber-500">
            <Badge variant="gold">Best Value</Badge>
            <Coins className="w-6 h-6 text-amber-400" />
            <span className="text-base font-bold text-white">25,000 CR</span>
            <span className="text-xs text-slate-400">$39.00</span>
            <Button size="sm" variant="accent" className="mt-2 w-full">Buy Pack</Button>
          </GlassCard>

          <GlassCard hoverEffect onClick={() => handleBuyPackage(100000)} className="p-4 flex flex-col items-center text-center gap-2 border-slate-800 hover:border-amber-500/50">
            <Coins className="w-6 h-6 text-amber-400" />
            <span className="text-base font-bold text-white">100,000 CR</span>
            <span className="text-xs text-slate-400">$129.00</span>
            <Button size="sm" variant="accent" className="mt-2 w-full">Buy Pack</Button>
          </GlassCard>
        </div>
      </Modal>
    </div>
  );
};
