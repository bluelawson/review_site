'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import RemandReasonModal from '@/components/modals/RemandReasonModal';
import Button from '@/components/ui/Button';
import PanelMessage from '@/components/ui/PanelMessage';
import { TOP_RATED_REVIEW_COUNT } from '@/constants/review';
import {
  reviewStatusBadgeClass,
  reviewStatusLabels,
} from '@/constants/reviewStatus';
import { useAuthState } from '@/hooks/useAuthState';
import {
  fetchReviewByIdWithViewer,
  fetchReviews,
  likeReview,
  removeReview,
  setReviewStatus,
  setReviewVisibility,
} from '@/lib/reviewApi';
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
  const [deleting, setDeleting] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [remandOpen, setRemandOpen] = useState(false);
  const [liking, setLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchReviewByIdWithViewer(id, user?.email)
      .then((data) => {
        if (!active) return;
        setReview(data);
        setHasLiked(!!data?.likedByMe);
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
  }, [id, user?.email]);

  useEffect(() => {
    let active = true;

    const loadTopRated = async () => {
      try {
        const data = await fetchReviews();
        if (!active) return;
        const sorted = [...data].sort((a, b) => {
          const likesDiff = b.likesCount - a.likesCount;
          if (likesDiff !== 0) return likesDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        const topRatedIds = new Set(
          sorted.slice(0, TOP_RATED_REVIEW_COUNT).map((item) => item.id),
        );
        setIsTopRated(topRatedIds.has(id));
      } catch (err) {
        console.error(err);
      }
    };

    loadTopRated();
    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!review || deleting) return;
    if (!window.confirm('このレビューを削除しますか？')) return;

    try {
      setDeleting(true);
      await removeReview(review.id);
      router.push('/review/search');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'レビューの削除に失敗しました。');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!review || updatingVisibility) return;
    try {
      setUpdatingVisibility(true);
      const updated = await setReviewVisibility(review.id, !review.isPublished);
      setReview(updated);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '公開状態の更新に失敗しました。');
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleLike = async () => {
    if (!review || liking || !user) return;
    const nextLiked = !hasLiked;

    try {
      setLiking(true);
      setHasLiked(nextLiked);
      setReview((prev) =>
        prev
          ? {
              ...prev,
              likesCount: prev.likesCount + (nextLiked ? 1 : -1),
            }
          : prev,
      );

      const updated = await likeReview(review.id, user.email);
      setReview((prev) =>
        prev ? { ...prev, likesCount: updated.likesCount } : prev,
      );
      setHasLiked(updated.likedByMe);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'いいねに失敗しました。');
      setReview((prev) =>
        prev
          ? {
              ...prev,
              likesCount: Math.max(0, prev.likesCount + (nextLiked ? -1 : 1)),
            }
          : prev,
      );
      setHasLiked(!nextLiked);
    } finally {
      setLiking(false);
    }
  };

  const handleSetStatus = async (
    nextStatus: 'APPROVED' | 'REJECTED',
    remandReason?: string,
  ) => {
    if (!review || updatingStatus || !user) return;
    const actionLabel = nextStatus === 'APPROVED' ? '承認' : '差し戻し';
    if (!window.confirm(`このレビューを${actionLabel}しますか？`)) return;

    try {
      setUpdatingStatus(true);
      const updated = await setReviewStatus(
        review.id,
        nextStatus,
        user.email,
        remandReason,
      );
      setReview((prev) => (prev ? { ...prev, ...updated } : prev));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '審査結果の更新に失敗しました。');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!review && loading) {
    return <PanelMessage>読み込み中...</PanelMessage>;
  }

  if (error) {
    return <PanelMessage tone="error">{error}</PanelMessage>;
  }

  if (!review && !loading) {
    return <PanelMessage>該当するレビューが見つかりませんでした。</PanelMessage>;
  }

  if (!review) {
    return null;
  }

  const isAdmin = user?.plan === 'admin';
  const canViewAll = !!user && (user.reviewsSubmitted > 0 || user.plan === 'premium');
  const canViewUnpublished = isAdmin || canViewAll;
  const isPending = review.status === 'PENDING';
  const isRejected = review.status === 'REJECTED';
  const isApproved = review.status === 'APPROVED';
  const canDelete = !!user && (isAdmin || user.userName === review.author.userName);
  const canLike = !!user && isApproved;

  const unlocked = !isApproved || review.isPublished || isTopRated || canViewUnpublished;

  if (isApproved && !review.isPublished && !isTopRated && !canViewUnpublished) {
    return <PanelMessage>このレビューは非公開です。</PanelMessage>;
  }

  return (
    <>
      <article className="glass-panel mx-auto max-w-4xl rounded-3xl border border-white/10 px-8 py-10">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              {review.shopName} / {new Date(review.createdAt).toLocaleString('ja-JP')}
            </span>
            {isAdmin && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] ${
                  isTopRated || review.isPublished
                    ? 'bg-emerald-400/10 text-emerald-200'
                    : 'bg-amber-300/10 text-amber-200'
                }`}
              >
                {isTopRated || review.isPublished ? '公開中' : '非公開'}
              </span>
            )}
            {isPending && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] ${reviewStatusBadgeClass.PENDING}`}
              >
                {reviewStatusLabels.PENDING}
              </span>
            )}
            {isRejected && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] ${reviewStatusBadgeClass.REJECTED}`}
              >
                {reviewStatusLabels.REJECTED}
              </span>
            )}
          </div>
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">{review.headline}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {review.castName}
          {review.estimatedAge ? ` / 推定 ${review.estimatedAge}` : ''}
          {review.bodyType ? ` / ${review.bodyType}` : ''}
          {review.bustSize ? ` / ${review.bustSize} cup` : ''}
          {review.heightCm ? ` / ${review.heightCm}cm` : ''}
        </p>

        <div className="divider my-6" />

        {(isPending || isRejected) && (
          <PanelMessage tone={isPending ? 'info' : 'error'}>
            {isPending
              ? 'このレビューは審査中です。公開までもう少しお待ちください。'
              : 'このレビューは差し戻されました。内容を見直して再申請してください。'}
            {isRejected && review.remandReason && (
              <div className="mt-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                  差し戻し理由
                </p>
                <div className="mt-2 whitespace-pre-line rounded-2xl border border-rose-300/40 bg-black/30 px-4 py-3 text-xs text-rose-100">
                  {review.remandReason}
                </div>
              </div>
            )}
          </PanelMessage>
        )}

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
                <Button variant="ghost" onClick={() => router.push('/review/register')}>
                  投稿する
                </Button>
                <Button onClick={() => router.push('/auth/login')}>ログイン</Button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs text-slate-400">
            <p>料金: {review.damage}</p>
            <p>サービス: {review.serviceHighlights.join(' / ')}</p>
            <p>キャスト評価: {review.castRating.toFixed(1)}</p>
            <p>いいね: {review.likesCount}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Posted by {review.author.name}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-slate-500">
          <button type="button" onClick={() => router.back()} className="text-left">
            ← 戻る
          </button>

          <div className="flex items-center gap-2">
            {canLike && (
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={liking}
                type="button"
                className={hasLiked ? 'text-rose-300 border-rose-300/60' : ''}
              >
                {hasLiked ? '♥' : '♡'}
              </Button>
            )}

            {isAdmin && !isTopRated && isApproved && (
              <Button
                variant={review.isPublished ? 'ghost' : 'outline'}
                onClick={handleTogglePublish}
                disabled={updatingVisibility}
                type="button"
                className={
                  review.isPublished
                    ? ''
                    : 'border-amber-300/50 text-amber-200 hover:border-amber-200/80'
                }
              >
                {review.isPublished ? '非公開にする' : '公開する'}
              </Button>
            )}

            {isAdmin && !isApproved && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSetStatus('APPROVED')}
                  disabled={updatingStatus}
                  type="button"
                  className="border-emerald-300/50 text-emerald-200 hover:border-emerald-200/80"
                >
                  承認する
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setRemandOpen(true)}
                  disabled={updatingStatus}
                  type="button"
                  className="text-rose-200 hover:text-rose-100"
                >
                  差し戻す
                </Button>
              </>
            )}

            {canDelete && (
              <Button variant="ghost" onClick={handleDelete} disabled={deleting} type="button">
                {deleting ? '削除中...' : 'DELETE'}
              </Button>
            )}
          </div>
        </div>
      </article>

      <RemandReasonModal
        open={remandOpen}
        submitting={updatingStatus}
        onCancel={() => setRemandOpen(false)}
        onSubmit={async (reason) => {
          setRemandOpen(false);
          await handleSetStatus('REJECTED', reason);
        }}
      />
    </>
  );
}
