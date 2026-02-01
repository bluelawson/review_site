import ReviewEditForm from '@/components/forms/ReviewEditForm';

type Params = Promise<{ id: string }>;

export default async function ReviewEditPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Review Edit
        </p>
        <h1 className="text-3xl font-semibold text-white">レビュー修正</h1>
        <p className="mt-2 text-sm text-slate-400">
          差し戻しされたレビューを修正して再申請できます。
        </p>
      </header>
      <ReviewEditForm id={id} />
    </div>
  );
}
