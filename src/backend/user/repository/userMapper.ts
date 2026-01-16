import type { User as PrismaUser } from '@prisma/client';

import type { User } from '../domain/model/user';

export const mapUser = (user: PrismaUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  plan: user.plan,
  reviewsSubmitted: user.reviewsSubmitted,
  createdAt: user.createdAt,
});
