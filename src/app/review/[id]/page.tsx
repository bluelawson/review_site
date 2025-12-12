import ReviewDetail from '@/components/ReviewDetail';

type Params = Promise<{ id: string }>;

export default async function ReviewDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return <ReviewDetail id={id} />;
}
