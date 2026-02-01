'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FieldWrapper, TextField } from '@/components/ui/Input';
import PillButton from '@/components/ui/PillButton';
import { bodyTypes, personalityTones } from '@/types';
import type { Review, ReviewFilter } from '@/types';

type Props = {
  reviews: Review[];
  value: ReviewFilter;
  onChange: (value: ReviewFilter) => void;
};

type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  label: string;
  placeholder: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
};

function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleValue = (nextValue: string) => {
    if (value.includes(nextValue)) {
      onChange(value.filter((item) => item !== nextValue));
    } else {
      onChange([...value, nextValue]);
    }
  };
  const allSelected = options.length > 0 && value.length === options.length;
  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  return (
    <FieldWrapper label={label}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white focus:border-white focus:outline-none"
        >
          <span className={selectedLabels.length ? '' : 'text-slate-500'}>
            {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
          </span>
          <span className="text-slate-400">▾</span>
        </button>
        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
            <div className="max-h-56 overflow-y-auto pr-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="size-4 rounded border-white/30 bg-white/10 text-white"
                />
                <span>すべて</span>
              </label>
              {options.map((option) => {
                const checked = value.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(option.value)}
                      className="size-4 rounded border-white/30 bg-white/10 text-white"
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}

export default function ReviewFilters({ reviews, value, onChange }: Props) {
  const shops = useMemo(
    () => Array.from(new Set(reviews.map((review) => review.shopName))),
    [reviews],
  );
  const shopOptions = useMemo(
    () => Array.from(new Set(shops.map((shop) => shop.trim()))).filter(Boolean),
    [shops],
  );
  const handleChange = (
    key: keyof ReviewFilter,
    val: string | number | string[] | undefined,
  ) => {
    onChange({ ...value, [key]: val });
  };

  const bustOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <section
      className="glass-panel relative z-40 overflow-visible rounded-3xl border border-white/10 px-6 py-6 isolate"
      id="reviews"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-reg uppercase tracking-[0.5em] text-slate-400">
            CONDITIONS
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
              placeholder="キャスト名／店名／感想"
            />
          </label>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <FieldWrapper label="店舗">
          <input
            list="shop-options"
            value={value.shop ?? ''}
            onChange={(e) => handleChange('shop', e.target.value || undefined)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/60"
            placeholder="入力または選択"
          />
          <datalist id="shop-options">
            {shopOptions.map((shop) => (
              <option key={shop} value={shop} />
            ))}
          </datalist>
        </FieldWrapper>
        <FieldWrapper label="キャスト名">
          <TextField
            type="text"
            value={value.castName ?? ''}
            onChange={(e) => handleChange('castName', e.target.value)}
            placeholder="例) らら"
            className="text-sm"
          />
        </FieldWrapper>
        <MultiSelect
          label="バスト"
          placeholder="選択してください"
          options={bustOptions}
          value={value.bustSizes ?? []}
          onChange={(next) => handleChange('bustSizes', next)}
        />
        <MultiSelect
          label="体型"
          placeholder="選択してください"
          options={bodyTypes.map((body) => ({ label: body, value: body }))}
          value={value.bodyTypes ?? []}
          onChange={(next) => handleChange('bodyTypes', next)}
        />
        <MultiSelect
          label="性格"
          placeholder="選択してください"
          options={personalityTones.map((item) => ({
            label: item,
            value: item,
          }))}
          value={value.personalities ?? []}
          onChange={(next) => handleChange('personalities', next)}
        />
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
        <FieldWrapper label="キャスト評価">
          <div className="mt-2 flex flex-wrap gap-3">
            {[0, 3, 4, 4.5].map((threshold) => (
              <PillButton
                key={threshold}
                onClick={() => handleChange('minCastRating', threshold)}
                active={(value.minCastRating ?? 0) === threshold}
                type="button"
              >
                {threshold === 0 ? 'ALL' : `${threshold}+`}
              </PillButton>
            ))}
          </div>
        </FieldWrapper>
      </div>
    </section>
  );
}
