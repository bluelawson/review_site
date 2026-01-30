'use client';
import type { ReactNode } from 'react';

type Props = {
  tone?: 'error' | 'info';
  children: ReactNode;
};

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  error: 'text-amber-200',
  info: 'text-slate-400',
};

export default function PanelMessage({ tone = 'info', children }: Props) {
  return (
    <div
      className={`glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm ${toneClass[tone]}`}
    >
      {children}
    </div>
  );
}
