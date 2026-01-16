import ReviewForm from '@/components/forms/ReviewForm';

export default function ReviewRegisterPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Create Review
        </p>
        <h1 className="text-3xl font-semibold text-white">
          口コミ投稿フォーム
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          サービス内容・料金・印象など詳細に記述するほど審査が早く完了します。
        </p>
      </header>
      <ReviewForm />
    </div>
  );
}
