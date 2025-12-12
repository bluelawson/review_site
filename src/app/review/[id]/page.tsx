import ReviewDetail from '@/components/ReviewDetail';

export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ReviewDetail id={params.id} />;
}
