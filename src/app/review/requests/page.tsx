import ReviewRequestsList from '@/components/ReviewRequestsList';

export default function ReviewRequestsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Review Requests
        </p>
        <h1 className="text-3xl font-semibold text-white">レビュー審査</h1>
        <p className="mt-2 text-sm text-slate-400">
          審査中・差し戻しレビューの状況を確認できます。
        </p>
      </header>
      <ReviewRequestsList />
    </div>
  );
}
