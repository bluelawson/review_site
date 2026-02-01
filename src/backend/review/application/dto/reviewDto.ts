export type ReviewFilterDto = {
  keyword?: string | null;
  shopName?: string | null;
  castName?: string | null;
  bodyTypes?: string[] | null;
  personalities?: string[] | null;
  bustSizes?: string[] | null;
  heightMin?: number | null;
  heightMax?: number | null;
  castRatingMin?: number | null;
};

export type CreateReviewDto = {
  shopName: string;
  castName: string;
  estimatedAge?: string | null;
  bodyType?: string | null;
  bustSize?: string | null;
  heightCm?: number | null;
  personality?: string | null;
  headline: string;
  detail: string;
  serviceHighlights?: string[] | null;
  castRating: number;
  damage?: string | null;
  authorEmail: string;
};

export type CreateReviewData = Omit<CreateReviewDto, 'authorEmail'>;

export type UpdateReviewVisibilityDto = {
  id: string;
  isPublished: boolean;
};

export type LikeReviewDto = {
  id: string;
  userEmail: string;
};

export type SetReviewStatusDto = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerEmail: string;
};
