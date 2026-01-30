'use client';
import { useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import {
  FieldWrapper,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui/Input';
import { useAuthState } from '@/hooks/useAuthState';
import { createReview } from '@/lib/reviewApi';
import type { BodyType, PersonalityTone } from '@/types';

const shopOptions = [
  '水色りぼん',
  'fantasy',
  '女帝',
  'Velvet Garden',
  'Secret Lagoon',
];
const bodyOptions: BodyType[] = [
  'スレンダー',
  '標準',
  'グラマラス',
  'メリハリ',
  '小柄',
  '長身',
];
const personalityOptions: PersonalityTone[] = [
  '明るい',
  'おとなしい',
  '積極的',
  '癒やし系',
];

export default function ReviewForm() {
  const { user, registerSubmission } = useAuthState();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shopName: shopOptions[0],
    workerName: '',
    estimatedAge: '',
    bodyType: bodyOptions[0],
    bustSize: '',
    heightCm: '',
    personality: personalityOptions[0],
    headline: '',
    detail: '',
    serviceHighlights: '',
    rating: 4.5,
    damage: '',
  });

  const highlightList = useMemo(
    () =>
      form.serviceHighlights
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [form.serviceHighlights],
  );

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setStatus('error');
      setMessage('ログイン後に投稿できます。');
      return;
    }
    setLoading(true);
    try {
      await createReview({
        ...form,
        serviceHighlights: highlightList.length ? highlightList : ['丁寧'],
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        authorEmail: user.email,
      });
      registerSubmission();
      setStatus('success');
      setMessage('投稿が完了しました。審査後に公開されます。');
      setForm({
        shopName: shopOptions[0],
        workerName: '',
        estimatedAge: '',
        bodyType: bodyOptions[0],
        bustSize: '',
        heightCm: '',
        personality: personalityOptions[0],
        headline: '',
        detail: '',
        serviceHighlights: '',
        rating: 4.5,
        damage: '',
      });
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('投稿に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-10 text-center text-sm text-slate-300">
        投稿にはログインが必要です。{' '}
        <a href="/auth/login" className="text-white underline">
          ログイン
        </a>{' '}
        または{' '}
        <a href="/auth/register" className="text-white underline">
          新規登録
        </a>
        をしてください。
      </div>
    );
  }

  return (
    <form
      className="glass-panel space-y-6 rounded-3xl border border-white/10 px-8 py-10"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FieldWrapper label="店名">
          <SelectField
            value={form.shopName}
            onChange={(e) => handleChange('shopName', e.target.value)}
            options={shopOptions.map((shop) => ({ label: shop, value: shop }))}
          />
        </FieldWrapper>
        <FieldWrapper label="嬢の名前" description="伏字可">
          <TextField
            required
            value={form.workerName}
            onChange={(e) => handleChange('workerName', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="推定年齢">
          <TextField
            placeholder="例) 23-25"
            value={form.estimatedAge}
            onChange={(e) => handleChange('estimatedAge', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="バストサイズ">
          <TextField
            placeholder="例) E"
            value={form.bustSize}
            onChange={(e) => handleChange('bustSize', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="身長 (cm)">
          <TextField
            type="number"
            min={130}
            max={200}
            value={form.heightCm}
            onChange={(e) => handleChange('heightCm', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="体型">
          <SelectField
            value={form.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            options={bodyOptions.map((body) => ({ value: body, label: body }))}
          />
        </FieldWrapper>
        <FieldWrapper label="性格">
          <SelectField
            value={form.personality}
            onChange={(e) => handleChange('personality', e.target.value)}
            options={personalityOptions.map((personality) => ({
              value: personality,
              label: personality,
            }))}
          />
        </FieldWrapper>
      </div>
      <FieldWrapper label="キャッチタイトル">
        <TextField
          required
          value={form.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="詳細レビュー">
        <TextAreaField
          required
          value={form.detail}
          onChange={(e) => handleChange('detail', e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="サービスの特徴" description="カンマ区切りで入力">
        <TextField
          value={form.serviceHighlights}
          onChange={(e) => handleChange('serviceHighlights', e.target.value)}
          placeholder="例) マット, ディープキス, 共浴"
        />
      </FieldWrapper>
      <FieldWrapper label="評価 (0-5)">
        <TextField
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={form.rating}
          onChange={(e) => handleChange('rating', Number(e.target.value))}
        />
      </FieldWrapper>
      <FieldWrapper label="料金">
        <TextField
          value={form.damage}
          onChange={(e) => handleChange('damage', e.target.value)}
          placeholder="例) 90分 38,000円"
        />
      </FieldWrapper>
      {status !== 'idle' && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === 'success'
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
              : 'border-amber-400/40 bg-amber-400/10 text-amber-100'
          }`}
        >
          {message}
        </div>
      )}
      <div className="flex justify-center">
        <Button type="submit" loading={loading}>
          投稿する
        </Button>
      </div>
    </form>
  );
}
