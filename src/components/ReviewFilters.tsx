'use client';
import { useMemo } from 'react';

import { FieldWrapper, SelectField, TextField } from '@/components/ui/Input';
import { bodyTypes, personalityTones } from '@/types';
import type { Review, ReviewFilter } from '@/types';

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
        <FieldWrapper label="店舗">
          <SelectField
            value={value.shop ?? ''}
            onChange={(e) => handleChange('shop', e.target.value || undefined)}
            className="text-sm"
            options={[
              { label: 'すべて', value: '' },
              ...shops.map((shop) => ({ label: shop, value: shop })),
            ]}
          />
        </FieldWrapper>
        <FieldWrapper label="嬢の名前">
          <TextField
            type="text"
            value={value.workerName ?? ''}
            onChange={(e) => handleChange('workerName', e.target.value)}
            placeholder="例) らら"
            className="text-sm"
          />
        </FieldWrapper>
        <FieldWrapper label="バスト">
          <TextField
            value={value.bustSize ?? ''}
            onChange={(e) => handleChange('bustSize', e.target.value)}
            placeholder="例) E"
            className="text-sm"
          />
        </FieldWrapper>
        <FieldWrapper label="体型">
          <SelectField
            value={value.bodyType ?? ''}
            onChange={(e) =>
              handleChange('bodyType', e.target.value || undefined)
            }
            className="text-sm"
            options={[
              { label: 'すべて', value: '' },
              ...bodyTypes.map((body) => ({ label: body, value: body })),
            ]}
          />
        </FieldWrapper>
        <FieldWrapper label="性格">
          <SelectField
            value={value.personality ?? ''}
            onChange={(e) =>
              handleChange('personality', e.target.value || undefined)
            }
            className="text-sm"
            options={[
              { label: 'すべて', value: '' },
              ...personalityTones.map((item) => ({ label: item, value: item })),
            ]}
          />
        </FieldWrapper>
        <FieldWrapper label="身長">
          <div className="mt-2 flex items-center gap-2">
            <TextField
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
              className="px-3 py-2 text-sm"
            />
            <span className="text-slate-500">-</span>
            <TextField
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
              className="px-3 py-2 text-sm"
            />
          </div>
        </FieldWrapper>
        <FieldWrapper label="最低評価">
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
        </FieldWrapper>
      </div>
    </section>
  );
}
