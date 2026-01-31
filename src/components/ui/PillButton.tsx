'use client';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export default function PillButton({
  active = false,
  disabled,
  className = '',
  children,
  ...props
}: PropsWithChildren<PillButtonProps>) {
  const base = 'rounded-full border px-4 py-2 text-xs transition';
  const activeClass = 'border-white/60 bg-white/10 text-white';
  const inactiveClass =
    'border-white/10 text-slate-400 hover:border-white/30 hover:text-white';
  const disabledClass = 'border-white/10 text-slate-500 cursor-not-allowed';
  const enabledClass = 'cursor-pointer';
  const stateClass = disabled
    ? disabledClass
    : active
      ? activeClass
      : inactiveClass;

  return (
    <button
      className={`${base} ${stateClass} ${disabled ? '' : enabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
