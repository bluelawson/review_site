'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

export default function CTASection() {
  const router = useRouter();
  return (
    <section
      id="submit"
      className="glass-panel rounded-3xl border border-white/10 px-8 py-12 text-center shadow-2xl"
    >
      <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
        Share & Unlock
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white">あなたの体験談を鍵に</h2>
      <p className="mt-4 text-sm text-slate-300">
        投稿完了後すぐに閲覧権限が付与されます。テンプレートに従って、事実ベースで執筆してください。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Button onClick={() => router.push('/review/register')}>投稿フォームへ</Button>
        <Link
          href="/auth/register"
          className="inline-flex items-center rounded-full border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white"
        >
          無料会員登録
        </Link>
      </div>
    </section>
  );
}
