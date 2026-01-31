'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import PanelMessage from '@/components/ui/PanelMessage';
import { useAuthState } from '@/hooks/useAuthState';
import {
  fetchReviewByIdWithViewer,
  likeReview,
  removeReview,
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
  const [liking, setLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

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

  if (!review && loading) {
    return (
      <PanelMessage>読み込み中...</PanelMessage>
    );
  }

  if (error) {
    return (
      <PanelMessage tone="error">{error}</PanelMessage>
    );
  }

  if (!review && !loading) {
    return (
      <PanelMessage>該当するレビューが見つかりませんでした。</PanelMessage>
    );
  }
  if (!review) {
    return null;
  }

  const handleDelete = async () => {
    if (!review || deleting) return;
    const confirmed = window.confirm('このレビューを削除しますか？');
    if (!confirmed) return;
    try {
      setDeleting(true);
      await removeReview(review.id);
      router.push('/review/search');
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'レビューの削除に失敗しました。',
      );
    } finally {
      setDeleting(false);
    }
  };

  const isAdmin = user?.plan === 'admin';
  const canViewAll =
    !!user && (user.reviewsSubmitted > 0 || user.plan === 'premium');
  const canViewUnpublished = isAdmin || canViewAll;
  const unlocked = review.isPublished || canViewUnpublished;
  const canManage = isAdmin;
  const isOwner = user?.email === review.author.email;
  const canDelete = !!user && (isAdmin || isOwner);
  const canLike =
    !!user &&
    user.email !== 'guest@seren.jp' &&
    user.id !== 'guest';

  if (!review.isPublished && !canViewUnpublished) {
    return (
      <PanelMessage>このレビューは非公開です。</PanelMessage>
    );
  }

  const handleTogglePublish = async () => {
    if (!review || updatingVisibility) return;
    try {
      setUpdatingVisibility(true);
      const updated = await setReviewVisibility(
        review.id,
        !review.isPublished,
      );
      setReview(updated);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : '公開状態の更新に失敗しました。',
      );
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handleLike = async () => {
    if (!review || liking || !canLike) return;
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
      const updated = await likeReview(review.id, user!.email);
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
              likesCount: Math.max(
                0,
                prev.likesCount + (nextLiked ? -1 : 1),
              ),
            }
          : prev,
      );
      setHasLiked(!nextLiked);
    } finally {
      setLiking(false);
    }
  };

  return (
    <article className="glass-panel mx-auto max-w-4xl rounded-3xl border border-white/10 px-8 py-10">
      <div className="text-xs uppercase tracking-[0.4em] text-slate-400">
        {review.shopName} / {new Date(review.createdAt).toLocaleString('ja-JP')}
      </div>
      <h1 className="mt-4 text-4xl font-semibold text-white">
        {review.headline}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {review.castName}
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
          <p>キャスト評価: {review.castRating.toFixed(1)}</p>
          <p>いいね: {review.likesCount}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Posted by {review.author.name} ({review.author.email})
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-slate-500">
        <Link href="/">← 戻る</Link>
        <div className="flex items-center gap-2">
          {canLike && (
            <Button
              variant="ghost"
              onClick={handleLike}
              disabled={liking}
              className={
                hasLiked ? 'text-rose-300 border-rose-300/60' : ''
              }
            >
              {hasLiked ? '♥' : '♡'}
            </Button>
          )}
          {canManage && (
            <Button
              variant="ghost"
              onClick={handleTogglePublish}
              disabled={updatingVisibility}
            >
              {review.isPublished ? '非公開' : '公開'}
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '削除中...' : 'DELETE'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
