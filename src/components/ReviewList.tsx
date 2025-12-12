"use client";
import { useMemo, useState } from "react";

import ReviewCard from "@/components/ReviewCard";
import ReviewFilters from "@/components/ReviewFilters";
import { useReviews } from "@/context/ReviewContext";

type FilterState = {
  search: string;
  shop: string;
  minRating: number;
};

const defaultFilter: FilterState = {
  search: "",
  shop: "",
  minRating: 0,
};

export default function ReviewList() {
  const { reviews } = useReviews();
  const [filter, setFilter] = useState<FilterState>(defaultFilter);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        filter.search.trim().length === 0 ||
        [review.workerName, review.shopName, review.detail, review.headline]
          .join(" ")
          .toLowerCase()
          .includes(filter.search.toLowerCase());
      const matchesShop =
        filter.shop === "" || review.shopName === filter.shop;
      const matchesRating = review.rating >= filter.minRating;
      return matchesSearch && matchesShop && matchesRating;
    });
  }, [reviews, filter]);

  return (
    <section className="space-y-8">
      <ReviewFilters value={filter} onChange={setFilter} />
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-400">
          条件に一致する口コミがありません。キーワードを変えるか、新しい体験談を{" "}
          <a href="/review/register" className="text-white underline">
            投稿
          </a>
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
