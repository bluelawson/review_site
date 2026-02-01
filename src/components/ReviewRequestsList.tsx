'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import PanelMessage from '@/components/ui/PanelMessage';
import PillButton from '@/components/ui/PillButton';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchReviewRequests } from '@/lib/reviewApi';
import type { Review } from '@/types';

type StatusFilter = 'PENDING' | 'REJECTED';

const statusLabels: Record<StatusFilter, string> = {
  PENDING: '審査中',
  REJECTED: '否認',
};

export default function ReviewRequestsList() {
  const { user } = useAuthState();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('PENDING');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setError(null);
    fetchReviewRequests(user.email)
      .then((data) => {
        if (!active) return;
        setReviews(data);
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
  }, [user]);

  const grouped = useMemo(() => {
    const pending = reviews.filter((review) => review.status === 'PENDING');
    const rejected = reviews.filter((review) => review.status === 'REJECTED');
    return { pending, rejected };
  }, [reviews]);

  if (!user) {
    return (
      <PanelMessage>
        審査状況の確認にはログインが必要です。{' '}
        <Link href="/auth/login" className="text-white underline">
          ログイン
        </Link>
      </PanelMessage>
    );
  }

  const visible =
    filter === 'PENDING' ? grouped.pending : grouped.rejected;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {user.plan === 'admin' ? '全未承認レビュー' : 'あなたの未承認レビュー'}
        </div>
        <div className="flex items-center gap-2">
          {(['PENDING', 'REJECTED'] as const).map((status) => (
            <PillButton
              key={status}
              type="button"
              active={filter === status}
              onClick={() => setFilter(status)}
            >
              {statusLabels[status]} ({status === 'PENDING'
                ? grouped.pending.length
                : grouped.rejected.length}
              )
            </PillButton>
          ))}
        </div>
      </div>

      {error ? (
        <PanelMessage tone="error">{error}</PanelMessage>
      ) : loading ? (
        <PanelMessage>レビューを読み込んでいます...</PanelMessage>
      ) : visible.length === 0 ? (
        <PanelMessage>
          {filter === 'PENDING'
            ? '審査中のレビューはありません。'
            : '否認されたレビューはありません。'}
        </PanelMessage>
      ) : (
        <div className="space-y-4">
          {visible.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                <span>
                  {review.shopName} /{' '}
                  {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    review.status === 'PENDING'
                      ? 'bg-sky-400/10 text-sky-200'
                      : 'bg-rose-400/10 text-rose-200'
                  }`}
                >
                  {statusLabels[review.status as StatusFilter]}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {review.headline}
              </h3>
              <p className="text-sm text-slate-400">
                {review.castName}
                {review.estimatedAge ? ` / ${review.estimatedAge}` : ''}
                {review.bodyType ? ` / ${review.bodyType}` : ''}
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-slate-300">
                {review.detail}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Posted by {review.author.userName}
                </div>
                <Link
                  href={`/review/${review.id}`}
                  className="text-xs uppercase tracking-[0.4em] text-white underline"
                >
                  詳細を見る
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
