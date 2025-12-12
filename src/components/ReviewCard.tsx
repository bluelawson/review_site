"use client";
import Link from "next/link";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewContext";
import type { Review } from "@/types";

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
  const { user } = useAuth();
  const { deleteReview } = useReviews();
  const isOwner = user?.email === review.createdBy;
  const unlocked = !!user && (user.reviewsSubmitted > 0 || user.plan === "premium");

  const handleDelete = () => {
    if (confirm("このレビューを削除しますか？")) {
      deleteReview(review.id);
    }
  };

  return (
    <article className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-white/30">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
        <span>{review.shopName}</span>
        <span>{new Date(review.createdAt).toLocaleDateString("ja-JP")}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-white">{review.headline}</h3>
      <p className="text-sm text-slate-400">
        {review.workerName} / {review.estimatedAge}歳推定 / {review.bodyType}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">
        {review.serviceHighlights.map((tag) => (
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
          unlocked ? "text-slate-300" : "text-slate-500 blur-[2px]"
        }`}
      >
        {review.detail}
      </p>
      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
        <span>Damage: {review.damage}</span>
        <span>Rating: {review.rating.toFixed(1)}</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={unlocked ? `/review/${review.id}` : "/#access"}
          className="text-xs uppercase tracking-[0.4em] text-white underline"
        >
          {unlocked ? "全文を読む" : "アンロック方法"}
        </Link>
        {isOwner && (
          <Button variant="ghost" type="button" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
      {!unlocked && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-amber-400/20"></div>
      )}
    </article>
  );
}
