import ReviewList from '@/components/ReviewList';

export default function ReviewSearchPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Review Search
        </p>
        <h1 className="text-3xl font-semibold text-white">レビュー検索</h1>
        <p className="mt-2 text-sm text-slate-400">
          条件を指定して口コミを検索できます。
        </p>
      </header>
      <ReviewList />
    </div>
  );
}
