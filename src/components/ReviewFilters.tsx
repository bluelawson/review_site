"use client";
import { useMemo } from "react";

import { useReviews } from "@/context/ReviewContext";

type FilterState = {
  search: string;
  shop: string;
  minRating: number;
};

type Props = {
  value: FilterState;
  onChange: (value: FilterState) => void;
};

export default function ReviewFilters({ value, onChange }: Props) {
  const { reviews } = useReviews();
  const shops = useMemo(
    () =>
      Array.from(new Set(reviews.map((review) => review.shopName))).map((shop) => ({
        value: shop,
        label: shop,
      })),
    [reviews],
  );

  const handleChange = (key: keyof FilterState, val: string | number) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <section className="glass-panel rounded-3xl border border-white/10 px-6 py-6" id="reviews">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">検索</p>
          <h2 className="text-2xl font-semibold text-white">口コミを探す</h2>
          <p className="text-sm text-slate-400">
            キーワード、店舗、評価でフィルタリングできます。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
          <label className="flex flex-col gap-2">
            キーワード
            <input
              type="search"
              value={value.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none"
              placeholder="嬢名／店名／感想"
            />
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-xs uppercase tracking-[0.4em] text-slate-400">
          店舗
          <div className="mt-2">
            <select
              value={value.shop}
              onChange={(e) => handleChange("shop", e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
            >
              <option value="">すべて</option>
              {shops.map((shop) => (
                <option key={shop.value} value={shop.value} className="bg-slate-900">
                  {shop.label}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="text-xs uppercase tracking-[0.4em] text-slate-400">
          最低評価
          <div className="mt-2 flex flex-wrap gap-3">
            {[0, 3, 4, 4.5].map((threshold) => (
              <button
                key={threshold}
                onClick={() => handleChange("minRating", threshold)}
                className={`rounded-full border px-4 py-2 text-xs ${
                  value.minRating === threshold
                    ? "border-white/60 bg-white/10 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                }`}
                type="button"
              >
                {threshold === 0 ? "ALL" : `${threshold}+`}
              </button>
            ))}
          </div>
        </label>
      </div>
    </section>
  );
}
