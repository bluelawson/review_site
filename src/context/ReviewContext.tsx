'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { print, type DocumentNode } from 'graphql';

import ReviewsDocument from '@/graphql/reviews.graphql';
import type { Review } from '@/types';

const GRAPHQL_ENDPOINT = '/api/graphql';

type CreateReviewInput = {
  shopName: string;
  workerName: string;
  estimatedAge?: string;
  bodyType?: string;
  bustSize?: string;
  heightCm?: number;
  personality?: string;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  rating: number;
  damage?: string;
  authorEmail: string;
};

type ReviewContextState = {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addReview: (review: CreateReviewInput) => Promise<Review>;
  deleteReview: (id: string) => Promise<void>;
  getReviewById: (id: string) => Review | null;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const ReviewContext = createContext<ReviewContextState | undefined>(undefined);

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

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestGraphQL<{ reviews: Review[] }>(
        ReviewsDocument,
        undefined,
        'Reviews',
      );
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'レビューの取得に失敗しました。',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = useCallback(async (input: CreateReviewInput) => {
    const data = await requestGraphQL<{ createReview: Review }>(
      ReviewsDocument,
      { input },
      'CreateReview',
    );
    setReviews((prev) => [data.createReview, ...prev]);
    return data.createReview;
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    await requestGraphQL<{ deleteReview: boolean }>(
      ReviewsDocument,
      { id },
      'DeleteReview',
    );
    setReviews((prev) => prev.filter((review) => review.id !== id));
  }, []);

  const getReviewById = useCallback(
    (id: string) => reviews.find((review) => review.id === id) ?? null,
    [reviews],
  );

  const value = useMemo<ReviewContextState>(
    () => ({
      reviews,
      loading,
      error,
      refetch: fetchReviews,
      addReview,
      deleteReview,
      getReviewById,
    }),
    [reviews, loading, error, fetchReviews, addReview, deleteReview, getReviewById],
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider');
  }
  return context;
};
