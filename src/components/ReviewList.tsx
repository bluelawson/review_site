'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ReviewCard from '@/components/ReviewCard';
import ReviewFilters from '@/components/ReviewFilters';
import { fetchReviews, removeReview } from '@/lib/reviewApi';
import type { Review, ReviewFilter } from '@/types';

const defaultFilter: ReviewFilter = {
  search: '',
  shop: '',
  workerName: '',
  bustSize: '',
  bodyType: '',
  personality: '',
  heightMin: undefined,
  heightMax: undefined,
  minRating: 0,
};

const filterReviews = (reviews: Review[], filter: ReviewFilter) => {
  const keyword = filter.search?.trim().toLowerCase();
  return reviews.filter((review) => {
    const matchesKeyword =
      !keyword ||
      [
        review.workerName,
        review.shopName,
        review.detail,
        review.headline,
        review.bustSize,
        review.personality,
      ]
        .filter(Boolean)
        .map((field) => (field ?? '').toString().toLowerCase())
        .some((field) => field.includes(keyword));

    const matchesShop = !filter.shop || review.shopName === filter.shop;
    const matchesWorker =
      !filter.workerName ||
      review.workerName.toLowerCase().includes(filter.workerName.toLowerCase());
    const matchesBody = !filter.bodyType || review.bodyType === filter.bodyType;
    const matchesPersonality =
      !filter.personality || review.personality === filter.personality;
    const matchesBust =
      !filter.bustSize ||
      (review.bustSize ?? '').toLowerCase() === filter.bustSize.toLowerCase();
    const height = review.heightCm ?? 0;
    const matchesHeightMin =
      !filter.heightMin || height >= Number(filter.heightMin);
    const matchesHeightMax =
      !filter.heightMax || height <= Number(filter.heightMax);
    const matchesRating =
      !filter.minRating || review.rating >= Number(filter.minRating);

    return (
      matchesKeyword &&
      matchesShop &&
      matchesWorker &&
      matchesBody &&
      matchesPersonality &&
      matchesBust &&
      matchesHeightMin &&
      matchesHeightMax &&
      matchesRating
    );
  });
};

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>(defaultFilter);

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

  const handleDelete = async (id: string) => {
    try {
      await removeReview(id);
      setLoading(true);
      setError(null);
      const data = await fetchReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'レビューの削除に失敗しました。',
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(
    () => filterReviews(reviews, filter),
    [reviews, filter],
  );

  return (
    <section className="space-y-8">
      <ReviewFilters reviews={reviews} value={filter} onChange={setFilter} />
      {error ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-amber-200">
          {error}
        </div>
      ) : loading ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
          レビューを読み込んでいます...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
          条件に一致する口コミがありません。キーワードを変えるか、新しい体験談を{' '}
          <Link href="/review/register" className="text-white underline">
            投稿
          </Link>
          してください。
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2" id="review-grid">
          {filteredReviews.map((review) => (
            <ReviewCard
              review={review}
              key={review.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
