import type {
  Review as PrismaReview,
  User as PrismaUser,
} from '@prisma/client';

import type { Review } from '../domain/model/review';
import { normalizeServiceHighlights } from '../domain/service/reviewDomainService';
import { mapUser } from '../../user/repository/userMapper';

type ReviewWithRelations = PrismaReview & {
  author: PrismaUser;
  _count?: { likes: number };
};

export const mapReview = (
  review: ReviewWithRelations,
): Review => ({
  id: review.id,
  shopName: review.shopName,
  castName: review.castName,
  estimatedAge: review.estimatedAge,
  bodyType: review.bodyType,
  bustSize: review.bustSize,
  heightCm: review.heightCm,
  personality: review.personality,
  headline: review.headline,
  detail: review.detail,
  serviceHighlights: normalizeServiceHighlights(review.serviceHighlights),
  castRating: review.castRating,
  likesCount: review._count?.likes ?? 0,
  likedByMe: false,
  isPublished: review.isPublished,
  status: review.status,
  remandReason: review.remandReason ?? null,
  damage: review.damage,
  createdAt: review.createdAt.toISOString(),
  updatedAt: review.updatedAt.toISOString(),
  author: mapUser(review.author),
});
