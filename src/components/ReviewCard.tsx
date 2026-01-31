'use client';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import { useAuthState } from '@/hooks/useAuthState';
import type { Review } from '@/types';

type Props = {
  review: Review;
  onDelete?: (id: string) => Promise<void> | void;
  onTogglePublish?: (id: string, isPublished: boolean) => Promise<void> | void;
  canDelete?: boolean;
  canTogglePublish?: boolean;
  forceShowDetail?: boolean;
  hidePublishToggle?: boolean;
  forcePublishedTag?: boolean;
};

export default function ReviewCard({
  review,
  onDelete,
  onTogglePublish,
  canDelete = false,
  canTogglePublish = false,
  forceShowDetail = false,
  hidePublishToggle = false,
  forcePublishedTag = false,
}: Props) {
  const { user } = useAuthState();
  const isAdmin = user?.plan === 'admin';
  const canViewAll =
    !!user && (user.reviewsSubmitted > 0 || user.plan === 'premium');
  const unlocked = review.isPublished || isAdmin || canViewAll;
  const isForcePublished = forcePublishedTag;
  const shouldBlur =
    !forceShowDetail &&
    !isForcePublished &&
    !review.isPublished &&
    !isAdmin &&
    !canViewAll;
  const highlights = review.serviceHighlights ?? [];
  const createdAtLabel = new Date(review.createdAt).toLocaleDateString('ja-JP');

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('このレビューを削除しますか？')) return;
    await onDelete(review.id);
  };

  const handleTogglePublish = async () => {
    if (!onTogglePublish) return;
    await onTogglePublish(review.id, !review.isPublished);
  };

  return (
    <article className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-white/30">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
        <div className="flex items-center gap-2">
          <span>{review.shopName}</span>
          {isAdmin && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] ${
                isForcePublished || review.isPublished
                  ? 'bg-emerald-400/10 text-emerald-200'
                  : 'bg-amber-300/10 text-amber-200'
              }`}
            >
              {isForcePublished || review.isPublished ? '公開中' : '非公開'}
            </span>
          )}
        </div>
        <span>{createdAtLabel}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-white">
        {review.headline}
      </h3>
      <p className="text-sm text-slate-400">
        {review.castName}
        {review.estimatedAge ? ` / ${review.estimatedAge}歳推定` : ''}
        {review.bodyType ? ` / ${review.bodyType}` : ''}
        {review.heightCm ? ` / ${review.heightCm}cm` : ''}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">
        {highlights.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-3 py-1 text-white/80"
          >
            {tag}
          </span>
        ))}
      </div>
      <p
        className={`mt-4 text-sm leading-relaxed ${
          shouldBlur ? 'text-slate-500 blur-[2px]' : 'text-slate-300'
        }`}
      >
        {review.detail}
      </p>
      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
        <span>料金: {review.damage ?? '非公開'}</span>
        <span>キャスト評価: {review.castRating.toFixed(1)}</span>
        <span>いいね: {review.likesCount}</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/review/${review.id}`}
          className="text-xs uppercase tracking-[0.4em] text-white underline"
        >
          {unlocked ? '全文を読む' : '詳細を見る'}
        </Link>
        <div className="flex items-center gap-2">
          {canTogglePublish && onTogglePublish && !hidePublishToggle && (
            <Button
              variant={review.isPublished ? 'ghost' : 'outline'}
              type="button"
              onClick={handleTogglePublish}
              className={
                review.isPublished
                  ? ''
                  : 'border-amber-300/50 text-amber-200 hover:border-amber-200/80'
              }
            >
              {review.isPublished ? '非公開にする' : '公開する'}
            </Button>
          )}
          {canDelete && onDelete && (
            <Button variant="ghost" type="button" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
      {shouldBlur && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-amber-400/20"></div>
      )}
    </article>
  );
}
