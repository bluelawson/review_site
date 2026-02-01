'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import Button from '@/components/ui/Button';
import { useAuthState } from '@/hooks/useAuthState';

const navLinks = [
  { href: '/', label: 'トップ' },
  { href: '/review/search', label: 'レビュー検索' },
  { href: '/#access', label: '閲覧条件' },
  { href: '/review/register', label: '投稿する' },
  { href: '/mypage', label: 'マイページ' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthState();

  const initials = useMemo(() => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const isUnlocked =
    !!user &&
    (user.plan === 'premium' ||
      user.plan === 'admin' ||
      user.reviewsSubmitted > 0);

  const handleLogout = () => {
    logout();
    router.push('/auth/logout');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-[0.6em] text-slate-500">
            SEREN
          </span>
          <span className="text-2xl font-black text-white">
            Soapland Review Exchange
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-slate-400">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-white ${active ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right text-xs uppercase tracking-[0.3em] text-slate-400 md:block">
                <p>{user.name}</p>
                <p>{isUnlocked ? 'UNLOCKED' : 'PENDING'}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-full border border-white/20 text-xs font-semibold">
                {initials}
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/auth/login')}
              >
                LOGIN
              </Button>
              <Button onClick={() => router.push('/auth/register')}>
                JOIN
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
