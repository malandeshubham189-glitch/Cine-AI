import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  accentBorder?: 'emerald' | 'cyan' | 'gold' | 'purple' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  accentBorder = 'none'
}) => {
  const getBorderColor = () => {
    switch (accentBorder) {
      case 'emerald':
        return 'border-emerald-500/30 hover:border-emerald-500/60';
      case 'cyan':
        return 'border-cyan-500/30 hover:border-cyan-500/60';
      case 'gold':
        return 'border-amber-500/30 hover:border-amber-500/60';
      case 'purple':
        return 'border-purple-500/30 hover:border-purple-500/60';
      default:
        return 'border-slate-800/80 hover:border-slate-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl bg-slate-900/60 backdrop-blur-xl border ${getBorderColor()}
        shadow-xl transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-950/20 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
