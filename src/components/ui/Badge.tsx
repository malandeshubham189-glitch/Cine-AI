import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'gold' | 'purple' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
  icon
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'cyan':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'gold':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800/60 text-slate-300 border-slate-700/60';
    }
  };

  const getSize = () => (size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]');

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-md border
        whitespace-nowrap ${getStyles()} ${getSize()} ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
