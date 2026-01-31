'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import ReviewCard from '@/components/ReviewCard';
import ReviewFilters from '@/components/ReviewFilters';
import PanelMessage from '@/components/ui/PanelMessage';
import PillButton from '@/components/ui/PillButton';
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

    const matchesShop =
      !filter.shop ||
      review.shopName.toLowerCase().includes(filter.shop.toLowerCase());
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const pageSize = 8;

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

  const filteredReviews = useMemo(() => {
    const result = filterReviews(reviews, filter);
    return [...result].sort((a, b) => {
      const ratingDiff =
        (b.reviewRating ?? b.rating) - (a.reviewRating ?? a.rating);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews, filter]);
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const pagedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <section className="space-y-8">
      <ReviewFilters reviews={reviews} value={filter} onChange={setFilter} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {filteredReviews.length} 件の口コミ
        </div>
        <div className="flex items-center gap-2">
          {[
            { value: 'grid', label: '2列' },
            { value: 'list', label: '1列' },
          ].map((option) => (
            <PillButton
              key={option.value}
              type="button"
              onClick={() => setViewMode(option.value as 'grid' | 'list')}
              active={viewMode === option.value}
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </div>
      {error ? (
        <PanelMessage tone="error">{error}</PanelMessage>
      ) : loading ? (
        <PanelMessage>レビューを読み込んでいます...</PanelMessage>
      ) : filteredReviews.length === 0 ? (
        <PanelMessage>
          条件に一致する口コミがありません。キーワードを変えるか、新しい体験談を{' '}
          <Link href="/review/register" className="text-white underline">
            投稿
          </Link>
          してください。
        </PanelMessage>
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2'
                : 'flex flex-col gap-6'
            }
            id="review-grid"
          >
            {pagedReviews.map((review) => (
              <ReviewCard
                review={review}
                key={review.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Page {page} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <PillButton
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={
                  page === 1
                    ? ''
                    : 'border-white/30 text-slate-200 hover:border-white/60 hover:text-white'
                }
              >
                Prev
              </PillButton>
              <PillButton
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className={
                  page === totalPages
                    ? ''
                    : 'border-white/30 text-slate-200 hover:border-white/60 hover:text-white'
                }
              >
                Next
              </PillButton>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
