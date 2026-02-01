'use client';
import { useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import {
  FieldWrapper,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/ui/Input';
import PanelMessage from '@/components/ui/PanelMessage';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchReviewByIdWithViewer, updateReview } from '@/lib/reviewApi';
import { bodyTypes, personalityTones } from '@/types';
import type { Review } from '@/types';

const shopOptions = [
  '水色りぼん',
  'fantasy',
  '女帝',
  'Velvet Garden',
  'Secret Lagoon',
];

type Props = {
  id: string;
};

type ReviewEditFormState = {
  shopName: string;
  castName: string;
  estimatedAge: string;
  bodyType: string;
  bustSize: string;
  heightCm: string;
  personality: string;
  headline: string;
  detail: string;
  serviceHighlights: string;
  castRating: number;
  damage: string;
};

export default function ReviewEditForm({ id }: Props) {
  const { user } = useAuthState();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ReviewEditFormState>({
    shopName: shopOptions[0],
    castName: '',
    estimatedAge: '',
    bodyType: bodyTypes[0],
    bustSize: '',
    heightCm: '',
    personality: personalityTones[0],
    headline: '',
    detail: '',
    serviceHighlights: '',
    castRating: 4.5,
    damage: '',
  });

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    fetchReviewByIdWithViewer(id, user.email)
      .then((data) => {
        if (!active) return;
        setReview(data);
        if (!data) return;
        setForm({
          shopName: data.shopName,
          castName: data.castName,
          estimatedAge: data.estimatedAge ?? '',
          bodyType: data.bodyType ?? bodyTypes[0],
          bustSize: data.bustSize ?? '',
          heightCm: data.heightCm ? String(data.heightCm) : '',
          personality: data.personality ?? personalityTones[0],
          headline: data.headline,
          detail: data.detail,
          serviceHighlights: data.serviceHighlights.join(', '),
          castRating: data.castRating,
          damage: data.damage ?? '',
        });
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        setStatus('error');
        setMessage(
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
  }, [id, user]);

  const highlightList = useMemo(
    () =>
      form.serviceHighlights
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [form.serviceHighlights],
  );

  const handleChange = (
    key: keyof ReviewEditFormState,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return (
      <PanelMessage>
        修正にはログインが必要です。{' '}
        <a href="/auth/login" className="text-white underline">
          ログイン
        </a>
      </PanelMessage>
    );
  }

  if (loading) {
    return <PanelMessage>読み込み中...</PanelMessage>;
  }

  if (!review) {
    return <PanelMessage>該当するレビューが見つかりません。</PanelMessage>;
  }

  if (review.author.email !== user.email) {
    return <PanelMessage>このレビューは修正できません。</PanelMessage>;
  }

  if (review.status !== 'REJECTED') {
    return (
      <PanelMessage>
        差し戻しされたレビューのみ修正して再申請できます。
      </PanelMessage>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');
    setMessage('');
    try {
      await updateReview({
        id: review.id,
        ...form,
        serviceHighlights: highlightList.length ? highlightList : ['丁寧'],
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        authorEmail: user.email,
      });
      setStatus('success');
      setMessage('再申請が完了しました。審査結果をお待ちください。');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : '更新に失敗しました。',
      );
    } finally {
      setSaving(false);
    }
  };

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
        <FieldWrapper label="キャスト名" description="伏字可">
          <TextField
            required
            value={form.castName}
            onChange={(e) => handleChange('castName', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="推定年齢">
          <TextField
            placeholder="例) 23-25"
            value={form.estimatedAge}
            onChange={(e) => handleChange('estimatedAge', e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="体型">
          <SelectField
            value={form.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            options={bodyTypes.map((type) => ({ label: type, value: type }))}
          />
        </FieldWrapper>
        <FieldWrapper label="バスト">
          <TextField
            placeholder="例) D"
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
        <FieldWrapper label="性格">
          <SelectField
            value={form.personality}
            onChange={(e) => handleChange('personality', e.target.value)}
            options={personalityTones.map((tone) => ({
              label: tone,
              value: tone,
            }))}
          />
        </FieldWrapper>
        <FieldWrapper label="キャスト評価">
          <TextField
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={form.castRating}
            onChange={(e) => handleChange('castRating', Number(e.target.value))}
          />
        </FieldWrapper>
      </div>
      <FieldWrapper label="見出し" description="50字以内で印象をまとめてください">
        <TextField
          required
          maxLength={50}
          value={form.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper
        label="本文"
        description="体験の流れや印象を詳しく書いてください"
      >
        <TextAreaField
          required
          rows={8}
          value={form.detail}
          onChange={(e) => handleChange('detail', e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="サービスの特徴 (カンマ区切り)">
        <TextField
          placeholder="例) マット, 会話◎, 丁寧"
          value={form.serviceHighlights}
          onChange={(e) => handleChange('serviceHighlights', e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="料金">
        <TextField
          placeholder="例) 90分 38,000円"
          value={form.damage}
          onChange={(e) => handleChange('damage', e.target.value)}
        />
      </FieldWrapper>
      <Button type="submit" disabled={saving}>
        {saving ? '再申請中...' : '修正して再申請'}
      </Button>
      {status !== 'idle' && (
        <PanelMessage tone={status === 'success' ? 'info' : 'error'}>
          {message}
        </PanelMessage>
      )}
    </form>
  );
}
