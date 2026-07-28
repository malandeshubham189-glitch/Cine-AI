import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-900/30 border border-emerald-400/30';
      case 'secondary':
        return 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-900/30 border border-cyan-400/30';
      case 'accent':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-900/30 border border-amber-400/30';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white font-medium border border-rose-500/30';
      case 'ghost':
        return 'bg-slate-800/40 hover:bg-slate-800 text-slate-200 border border-transparent hover:border-slate-700';
      case 'outline':
        return 'bg-slate-900/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg gap-1.5';
      case 'lg':
        return 'px-6 py-3 text-base rounded-xl gap-2.5';
      default:
        return 'px-4 py-2 text-sm rounded-lg gap-2';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center transition-all duration-200
        active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none
        ${getVariantStyles()} ${getSizeStyles()} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
