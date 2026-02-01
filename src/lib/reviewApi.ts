import { print, type DocumentNode } from 'graphql';

import ReviewsDocument from '@/graphql/reviews.graphql';
import type { Review } from '@/types';

const GRAPHQL_ENDPOINT = '/api/graphql';

export type CreateReviewInput = {
  shopName: string;
  castName: string;
  estimatedAge?: string;
  bodyType?: string;
  bustSize?: string;
  heightCm?: number;
  personality?: string;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  castRating: number;
  damage?: string;
  authorEmail: string;
};

export type UpdateReviewInput = CreateReviewInput & {
  id: string;
};

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

export async function fetchReviews(): Promise<Review[]> {
  const data = await requestGraphQL<{ reviews: Review[] }>(
    ReviewsDocument,
    undefined,
    'Reviews',
  );
  return data.reviews;
}

export async function fetchReviewById(id: string): Promise<Review | null> {
  return fetchReviewByIdWithViewer(id);
}

export async function createReview(
  input: CreateReviewInput,
): Promise<Review> {
  const data = await requestGraphQL<{ createReview: Review }>(
    ReviewsDocument,
    { input },
    'CreateReview',
  );
  return data.createReview;
}

export async function updateReview(
  input: UpdateReviewInput,
): Promise<Review> {
  const data = await requestGraphQL<{ updateReview: Review }>(
    ReviewsDocument,
    { input },
    'UpdateReview',
  );
  return data.updateReview;
}

export async function removeReview(id: string): Promise<void> {
  await requestGraphQL<{ deleteReview: boolean }>(
    ReviewsDocument,
    { id },
    'DeleteReview',
  );
}

export async function setReviewVisibility(
  id: string,
  isPublished: boolean,
): Promise<Review> {
  const data = await requestGraphQL<{ setReviewVisibility: Review }>(
    ReviewsDocument,
    { id, isPublished },
    'SetReviewVisibility',
  );
  return data.setReviewVisibility;
}

export async function fetchReviewByIdWithViewer(
  id: string,
  viewerEmail?: string,
): Promise<Review | null> {
  const data = await requestGraphQL<{ review: Review | null }>(
    ReviewsDocument,
    { id, viewerEmail },
    'Review',
  );
  return data.review;
}

export async function likeReview(
  id: string,
  userEmail: string,
): Promise<{ id: string; likesCount: number; likedByMe: boolean }> {
  const data = await requestGraphQL<{
    likeReview: { id: string; likesCount: number; likedByMe: boolean };
  }>(
    ReviewsDocument,
    { id, userEmail },
    'LikeReview',
  );
  return data.likeReview;
}

export async function fetchReviewRequests(
  viewerEmail: string,
): Promise<Review[]> {
  const data = await requestGraphQL<{ reviewRequests: Review[] }>(
    ReviewsDocument,
    { viewerEmail },
    'ReviewRequests',
  );
  return data.reviewRequests;
}

export async function setReviewStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  reviewerEmail: string,
  remandReason?: string,
): Promise<Review> {
  const data = await requestGraphQL<{ setReviewStatus: Review }>(
    ReviewsDocument,
    { id, status, reviewerEmail, remandReason },
    'SetReviewStatus',
  );
  return data.setReviewStatus;
}
