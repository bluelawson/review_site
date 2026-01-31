export const personalityTones = ['明るい', 'おとなしい', '積極的', '癒やし系'] as const;
export type PersonalityTone = (typeof personalityTones)[number];

export const bodyTypes = [
  'スレンダー',
  '標準',
  'グラマラス',
  'メリハリ',
  '小柄',
  '長身',
] as const;
export type BodyType = (typeof bodyTypes)[number];

export type Review = {
  id: string;
  shopName: string;
  castName: string;
  estimatedAge?: string | null;
  bodyType?: BodyType | string | null;
  bustSize?: string | null;
  heightCm?: number | null;
  personality?: PersonalityTone | string | null;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  castRating: number;
  reviewRating: number;
  isPublished: boolean;
  damage?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type ReviewFilter = {
  search?: string;
  shop?: string;
  castName?: string;
  bodyTypes?: string[];
  personalities?: string[];
  bustSizes?: string[];
  heightMin?: number;
  heightMax?: number;
  minCastRating?: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: 'guest' | 'premium' | 'admin';
  reviewsSubmitted: number;
};
