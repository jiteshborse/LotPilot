import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate' | 'cyan' | 'indigo' | 'orange' | 'teal' | 'sky';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    slate: 'bg-slate-800 text-slate-300 border border-slate-700/80',
    blue: 'bg-blue-950/80 text-blue-300 border border-blue-800/60',
    emerald: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
    amber: 'bg-amber-950/80 text-amber-300 border border-amber-800/60',
    rose: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    purple: 'bg-purple-950/80 text-purple-300 border border-purple-800/60',
    cyan: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60',
    indigo: 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60',
    orange: 'bg-orange-950/80 text-orange-300 border border-orange-800/60',
    teal: 'bg-teal-950/80 text-teal-300 border border-teal-800/60',
    sky: 'bg-sky-950/80 text-sky-300 border border-sky-800/60',
  };

  const dotColors = {
    slate: 'bg-slate-400',
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    purple: 'bg-purple-400',
    cyan: 'bg-cyan-400',
    indigo: 'bg-indigo-400',
    orange: 'bg-orange-400',
    teal: 'bg-teal-400',
    sky: 'bg-sky-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
