"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

import ReviewCard from "@/components/ReviewCard";
import ReviewFilters from "@/components/ReviewFilters";
import { useReviews } from "@/context/ReviewContext";
import type { ReviewFilter } from "@/types";

const defaultFilter: ReviewFilter = {
  search: "",
  shop: "",
  workerName: "",
  bustSize: "",
  bodyType: "",
  personality: "",
  heightMin: undefined,
  heightMax: undefined,
  minRating: 0,
};

export default function ReviewList() {
  const { reviews, loading, error } = useReviews();
  const [filter, setFilter] = useState<ReviewFilter>(defaultFilter);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const keyword = filter.search?.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        [review.workerName, review.shopName, review.detail, review.headline, review.bustSize, review.personality]
          .filter(Boolean)
          .map((field) => (field ?? "").toString().toLowerCase())
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
        (review.bustSize ?? "").toLowerCase() === filter.bustSize.toLowerCase();
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
  }, [reviews, filter]);

  return (
    <section className="space-y-8">
      <ReviewFilters value={filter} onChange={setFilter} />
      {error ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-amber-200">
          {error}
        </div>
      ) : loading ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
          レビューを読み込んでいます...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
          条件に一致する口コミがありません。キーワードを変えるか、新しい体験談を{" "}
          <Link href="/review/register" className="text-white underline">
            投稿
          </Link>
          してください。
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2" id="review-grid">
          {filtered.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </div>
      )}
    </section>
  );
}
