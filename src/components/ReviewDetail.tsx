'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchReviewById } from '@/lib/reviewApi';
import type { Review } from '@/types';

type Props = {
  id: string;
};

export default function ReviewDetail({ id }: Props) {
  const router = useRouter();
  const { user } = useAuthState();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchReviewById(id)
      .then((data) => {
        if (!active) return;
        setReview(data);
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        setError(
          err instanceof Error ? err.message : 'レビューの取得に失敗しました。',
        );
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (!review && loading) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-amber-200">
        {error}
      </div>
    );
  }

  if (!review && !loading) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
        該当するレビューが見つかりませんでした。
      </div>
    );
  }

  const unlocked =
    !!user && (user.reviewsSubmitted > 0 || user.plan === 'premium');

  return (
    <article className="glass-panel mx-auto max-w-4xl rounded-3xl border border-white/10 px-8 py-10">
      <div className="text-xs uppercase tracking-[0.4em] text-slate-400">
        {review.shopName} / {new Date(review.createdAt).toLocaleString('ja-JP')}
      </div>
      <h1 className="mt-4 text-4xl font-semibold text-white">
        {review.headline}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {review.workerName}
        {review.estimatedAge ? ` / 推定 ${review.estimatedAge}` : ''}
        {review.bodyType ? ` / ${review.bodyType}` : ''}
        {review.bustSize ? ` / ${review.bustSize} cup` : ''}
        {review.heightCm ? ` / ${review.heightCm}cm` : ''}
      </p>
      <div className="divider my-6"></div>
      <div className="space-y-4 text-sm leading-relaxed text-slate-300">
        {unlocked ? (
          <p className="whitespace-pre-line">{review.detail}</p>
        ) : (
          <div className="rounded-3xl border border-amber-300/30 bg-[#050505]/80 px-6 py-6 text-center text-slate-200">
            <p>全文閲覧はロックされています。</p>
            <p className="mt-2 text-xs text-slate-400">
              自分のレビューを投稿するか、プレミアムパスで解錠してください。
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/review/register')}
              >
                投稿する
              </Button>
              <Button onClick={() => router.push('/auth/login')}>
                ログイン
              </Button>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-400">
          <p>料金: {review.damage}</p>
          <p>サービス: {review.serviceHighlights.join(' / ')}</p>
          <p>評価: {review.rating.toFixed(1)}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Posted by {review.author.name} ({review.author.email})
          </p>
        </div>
      </div>
      <div className="mt-8 flex justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
        <Link href="/">← 戻る</Link>
        <Link href="/review/register">自分の体験談を投稿</Link>
      </div>
    </article>
  );
}
