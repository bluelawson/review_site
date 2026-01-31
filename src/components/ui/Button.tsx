'use client';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost' | 'outline';
  loading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  solid:
    'bg-white text-slate-900 hover:bg-slate-200 focus-visible:outline-white',
  ghost:
    'border border-white/30 text-white hover:border-white/70 hover:bg-white/10 focus-visible:outline-white/50',
  outline:
    'border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-800 focus-visible:outline-white/50',
};

export default function Button({
  className = '',
  variant = 'solid',
  loading,
  disabled,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const stateClass = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${stateClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
