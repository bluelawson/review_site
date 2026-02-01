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
  castRating: number;
  likesCount: number;
  likedByMe?: boolean;
  isPublished: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  damage: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
};
