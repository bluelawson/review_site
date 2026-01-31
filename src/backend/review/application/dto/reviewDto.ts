export type ReviewFilterDto = {
  keyword?: string | null;
  shopName?: string | null;
  castName?: string | null;
  bodyType?: string | null;
  personality?: string | null;
  bustSize?: string | null;
  heightMin?: number | null;
  heightMax?: number | null;
  ratingMin?: number | null;
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
  rating: number;
  damage?: string | null;
  authorEmail: string;
};

export type CreateReviewData = Omit<CreateReviewDto, 'authorEmail'>;

export type UpdateReviewVisibilityDto = {
  id: string;
  isPublished: boolean;
};
