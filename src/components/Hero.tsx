'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { fetchReviews } from '@/lib/reviewApi';
import type { Review } from '@/types';

export default function Hero() {
  const router = useRouter();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((data) => {
        if (!active) return;
        setReviews(data);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      active = false;
    };
  }, []);

  const recentCount = useMemo(() => {
    return reviews.filter((review) => {
      const created = new Date(review.createdAt).getTime();
      return now - created <= 1000 * 60 * 60 * 24 * 7;
    }).length;
  }, [reviews, now]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="glass-panel rounded-3xl border border-white/10 px-8 py-12 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
          体験者限定コミュニティ
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
          ソープランドのリアルを
          <span className="block text-slate-300">
            投稿と課金でシェアする時代
          </span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-300">
          SERENは体験者本人のみが参加できるクローズドなレビューネットワーク。料金を払うか、あなた自身の体験談を投稿すると、他の全レビューが解錠されます。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => router.push('/review/register')}>
            投稿して解錠
          </Button>
          <Button variant="ghost" onClick={() => router.push('/#access')}>
            ルールを見る
          </Button>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: '登録レビュー', value: reviews.length },
            { label: '直近7日に追加', value: recentCount },
            {
              label: '平均評価',
              value: averageRating,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center"
            >
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          CURRENT STATUS
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {user ? `${user.name} さんの状態` : 'ゲストモード'}
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          {user
            ? user.reviewsSubmitted > 0
              ? 'すでに投稿済みのため、全てのレビューがアンロックされています。'
              : 'まだレビュー未投稿。自分の体験談を1本書くと即時で解錠されます。'
            : 'ログインまたは新規登録で閲覧履歴を保存し、レビューを書き込めるようになります。'}
        </p>
        <div className="divider my-6"></div>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-center gap-3">
            <span className="text-lg text-emerald-300">●</span>
            投稿は暗号化され、本人だけが編集可能。
          </li>
          <li className="flex items-center gap-3">
            <span className="text-lg text-amber-300">●</span>
            すべてのレビュアーは事前審査済み。
          </li>
          <li className="flex items-center gap-3">
            <span className="text-lg text-slate-200">●</span>
            プレミアムプランは近日公開予定。
          </li>
        </ul>
        <div className="mt-6 text-xs text-slate-500">
          <p>ゲスト: 閲覧プレビューのみ</p>
          <p>投稿/課金済み: 全レビュー閲覧・削除権限</p>
        </div>
      </div>
    </section>
  );
}
