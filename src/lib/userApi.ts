import ReviewsDocument from '@/graphql/reviews.graphql';
import { requestGraphQL } from '@/lib/graphqlClient';

export async function updateReviewStatusEmailPreference(
  userEmail: string,
  enabled: boolean,
): Promise<{
  id: string;
  name: string;
  userName: string;
  email: string;
  reviewStatusEmailEnabled: boolean;
}> {
  const data = await requestGraphQL<{
    updateReviewStatusEmailPreference: {
      id: string;
      name: string;
      userName: string;
      email: string;
      reviewStatusEmailEnabled: boolean;
    };
  }>(
    ReviewsDocument,
    { userEmail, enabled },
    'UpdateReviewStatusEmailPreference',
  );
  return data.updateReviewStatusEmailPreference;
}
