import type { User } from '../../../user/domain/model/user';

export type Review = {
  id: string;
  shopName: string;
  castName: string;
  estimatedAge: string | null;
  bodyType: string | null;
  bustSize: string | null;
  heightCm: number | null;
  personality: string | null;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  rating: number;
  reviewRating: number;
  isPublished: boolean;
  damage: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
};
