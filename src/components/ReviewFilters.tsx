'use client';
import { useMemo } from 'react';

import type { Review, ReviewFilter } from '@/types';

const bodyTypes = [
  'スレンダー',
  '標準',
  'グラマラス',
  'メリハリ',
  '小柄',
  '長身',
];
const personalities = ['明るい', 'おとなしい', '積極的', '癒やし系'];

type Props = {
  reviews: Review[];
  value: ReviewFilter;
  onChange: (value: ReviewFilter) => void;
};

export default function ReviewFilters({ reviews, value, onChange }: Props) {
  const shops = useMemo(
    () => Array.from(new Set(reviews.map((review) => review.shopName))),
    [reviews],
  );
  const workerNames = useMemo(
    () => Array.from(new Set(reviews.map((review) => review.workerName))),
    [reviews],
  );

  const handleChange = (
    key: keyof ReviewFilter,
    val: string | number | undefined,
  ) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <section
      className="glass-panel rounded-3xl border border-white/10 px-6 py-6"
      id="reviews"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
            検索
          </p>
          <h2 className="text-2xl font-semibold text-white">口コミを探す</h2>
          <p className="text-sm text-slate-400">
            キーワードや属性でフィルタリングできます。
          </p>
        </div>
        <div className="w-full md:max-w-md">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            キーワード
            <input
              type="search"
              value={value.search ?? ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none"
              placeholder="嬢名／店名／感想"
            />
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          店舗
          <select
            value={value.shop ?? ''}
            onChange={(e) => handleChange('shop', e.target.value || undefined)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
          >
            <option value="">すべて</option>
            {shops.map((shop) => (
              <option key={shop} value={shop} className="bg-slate-900">
                {shop}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          嬢の名前
          <input
            type="text"
            value={value.workerName ?? ''}
            onChange={(e) => handleChange('workerName', e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none"
            placeholder="例) らら"
            list="worker-list"
          />
          <datalist id="worker-list">
            {workerNames.map((worker) => (
              <option key={worker} value={worker} />
            ))}
          </datalist>
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          バスト
          <input
            value={value.bustSize ?? ''}
            onChange={(e) => handleChange('bustSize', e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none"
            placeholder="例) E"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          体型
          <select
            value={value.bodyType ?? ''}
            onChange={(e) =>
              handleChange('bodyType', e.target.value || undefined)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
          >
            <option value="">すべて</option>
            {bodyTypes.map((body) => (
              <option key={body} value={body} className="bg-slate-900">
                {body}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          性格
          <select
            value={value.personality ?? ''}
            onChange={(e) =>
              handleChange('personality', e.target.value || undefined)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white focus:outline-none"
          >
            <option value="">すべて</option>
            {personalities.map((item) => (
              <option key={item} value={item} className="bg-slate-900">
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
          身長
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={130}
              max={200}
              value={value.heightMin ?? ''}
              onChange={(e) =>
                handleChange(
                  'heightMin',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="Min"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              min={130}
              max={200}
              value={value.heightMax ?? ''}
              onChange={(e) =>
                handleChange(
                  'heightMax',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="Max"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400 md:col-span-3">
          最低評価
          <div className="mt-2 flex flex-wrap gap-3">
            {[0, 3, 4, 4.5].map((threshold) => (
              <button
                key={threshold}
                onClick={() => handleChange('minRating', threshold)}
                className={`rounded-full border px-4 py-2 text-xs ${
                  (value.minRating ?? 0) === threshold
                    ? 'border-white/60 bg-white/10 text-white'
                    : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
                type="button"
              >
                {threshold === 0 ? 'ALL' : `${threshold}+`}
              </button>
            ))}
          </div>
        </label>
      </div>
    </section>
  );
}
