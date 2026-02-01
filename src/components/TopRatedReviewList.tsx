'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ReviewCard from '@/components/ReviewCard';
import PanelMessage from '@/components/ui/PanelMessage';
import { fetchReviews } from '@/lib/reviewApi';
import { TOP_RATED_REVIEW_COUNT } from '@/constants/review';
import type { Review } from '@/types';

export default function TopRatedReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviews();
        if (!active) return;
        setReviews(data);
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError(
          err instanceof Error ? err.message : 'レビューの取得に失敗しました。',
        );
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const topRatedReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      const likesDiff = b.likesCount - a.likesCount;
      if (likesDiff !== 0) return likesDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted.slice(0, TOP_RATED_REVIEW_COUNT);
  }, [reviews]);

  return (
    <section className="space-y-8">
      <header className="space-y-2 pl-6">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Top Rated
        </p>
        <h2 className="text-3xl font-semibold text-white">高評価のレビュー</h2>
      </header>
      {error ? (
        <PanelMessage tone="error">{error}</PanelMessage>
      ) : loading ? (
        <PanelMessage>レビューを読み込んでいます...</PanelMessage>
      ) : topRatedReviews.length === 0 ? (
        <PanelMessage>
          条件に一致する口コミがありません。新しい体験談を{' '}
          <Link href="/review/register" className="text-white underline">
            投稿
          </Link>
          してください。
        </PanelMessage>
      ) : (
        <div className="grid gap-6 md:grid-cols-2" id="review-grid">
          {topRatedReviews.map((review) => (
            <ReviewCard
              review={review}
              key={review.id}
              forceShowDetail
              hidePublishToggle
              forcePublishedTag
            />
          ))}
        </div>
      )}
    </section>
  );
}
