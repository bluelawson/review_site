import type {
  Review as PrismaReview,
  User as PrismaUser,
} from '@prisma/client';

import type { Review } from '../domain/model/review';
import { normalizeServiceHighlights } from '../domain/service/reviewDomainService';
import { mapUser } from '../../user/repository/userMapper';

export const mapReview = (
  review: PrismaReview & { author: PrismaUser },
): Review => ({
  id: review.id,
  shopName: review.shopName,
  workerName: review.workerName,
  estimatedAge: review.estimatedAge,
  bodyType: review.bodyType,
  bustSize: review.bustSize,
  heightCm: review.heightCm,
  personality: review.personality,
  headline: review.headline,
  detail: review.detail,
  serviceHighlights: normalizeServiceHighlights(review.serviceHighlights),
  rating: review.rating,
  damage: review.damage,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  author: mapUser(review.author),
});
