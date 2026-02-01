import { print, type DocumentNode } from 'graphql';

import ReviewsDocument from '@/graphql/reviews.graphql';

const GRAPHQL_ENDPOINT = '/api/graphql';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function requestGraphQL<T>(
  document: DocumentNode,
  variables?: Record<string, unknown>,
  operationName?: string,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(document),
      variables,
      operationName,
    }),
  });

  const body = (await response.json()) as GraphQLResponse<T>;
  if (!response.ok || body.errors) {
    throw new Error(body.errors?.[0]?.message ?? 'GraphQL request failed');
  }
  if (!body.data) {
    throw new Error('No data returned from GraphQL request');
  }
  return body.data;
}

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
