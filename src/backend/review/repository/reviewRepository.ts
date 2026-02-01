import { Prisma } from '@prisma/client';

import type {
  CreateReviewData,
  ReviewFilterDto,
} from '../application/dto/reviewDto';
import type { Review } from '../domain/model/review';
import prisma from '../../shared/prismaClient';
import { mapReview } from './reviewMapper';

export type ReviewRepository = {
  findMany(filter?: ReviewFilterDto | null): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
  create(input: CreateReviewData, authorId: string): Promise<Review>;
  update(
    id: string,
    input: CreateReviewData,
    authorId: string,
  ): Promise<Review>;
  setVisibility(id: string, isPublished: boolean): Promise<Review>;
  setStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    remandReason?: string | null,
  ): Promise<Review>;
  findByStatuses(
    statuses: Array<'PENDING' | 'APPROVED' | 'REJECTED'>,
    authorId?: string,
  ): Promise<Review[]>;
  toggleLike(reviewId: string, userId: string): Promise<Review>;
  hasUserLiked(reviewId: string, userId: string): Promise<boolean>;
  deleteById(id: string): Promise<void>;
};

const buildWhere = (
  filter?: ReviewFilterDto | null,
): Prisma.ReviewWhereInput => {
  if (!filter) return {};
  const where: Prisma.ReviewWhereInput = {};

  if (filter.keyword) {
    where.OR = [
      { headline: { contains: filter.keyword } },
      { detail: { contains: filter.keyword } },
      { shopName: { contains: filter.keyword } },
      { castName: { contains: filter.keyword } },
    ];
  }
  if (filter.shopName) where.shopName = filter.shopName;
  if (filter.castName) where.castName = { contains: filter.castName };
  if (filter.bodyTypes?.length) where.bodyType = { in: filter.bodyTypes };
  if (filter.personalities?.length) {
    where.personality = { in: filter.personalities };
  }
  if (filter.bustSizes?.length) where.bustSize = { in: filter.bustSizes };
  if (filter.heightMin || filter.heightMax) {
    where.heightCm = {};
    if (filter.heightMin) {
      where.heightCm.gte = filter.heightMin;
    }
    if (filter.heightMax) {
      where.heightCm.lte = filter.heightMax;
    }
  }
  if (filter.castRatingMin) {
    where.castRating = { gte: filter.castRatingMin };
  }
  return where;
};

export const reviewRepository: ReviewRepository = {
  async findMany(filter?: ReviewFilterDto | null) {
    const reviews = await prisma.review.findMany({
      where: { ...buildWhere(filter), status: 'APPROVED' },
      orderBy: [{ likes: { _count: 'desc' } }, { createdAt: 'desc' }],
      include: { author: true, _count: { select: { likes: true } } },
    });
    return reviews.map(mapReview);
  },
  async findById(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { author: true, _count: { select: { likes: true } } },
    });
    return review ? mapReview(review) : null;
  },
  async create(input: CreateReviewData, authorId: string) {
    const serviceHighlightsValue:
      | Prisma.NullableJsonNullValueInput
      | Prisma.InputJsonValue =
      input.serviceHighlights == null
        ? Prisma.JsonNull
        : (input.serviceHighlights as Prisma.InputJsonValue);

    const review = await prisma.review.create({
      data: {
        ...input,
        heightCm: input.heightCm ?? null,
        serviceHighlights: serviceHighlightsValue,
        status: 'PENDING',
        isPublished: false,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true, _count: { select: { likes: true } } },
    });
    return mapReview(review);
  },
  async update(id: string, input: CreateReviewData, authorId: string) {
    const serviceHighlightsValue:
      | Prisma.NullableJsonNullValueInput
      | Prisma.InputJsonValue =
      input.serviceHighlights == null
        ? Prisma.JsonNull
        : (input.serviceHighlights as Prisma.InputJsonValue);

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...input,
        heightCm: input.heightCm ?? null,
        serviceHighlights: serviceHighlightsValue,
        status: 'PENDING',
        isPublished: false,
        remandReason: null,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true, _count: { select: { likes: true } } },
    });
    return mapReview(review);
  },
  async setVisibility(id: string, isPublished: boolean) {
    const review = await prisma.review.update({
      where: { id },
      data: { isPublished },
      include: { author: true, _count: { select: { likes: true } } },
    });
    return mapReview(review);
  },
  async setStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    remandReason?: string | null,
  ) {
    const review = await prisma.review.update({
      where: { id },
      data: {
        status,
        isPublished: status === 'APPROVED',
        remandReason: status === 'REJECTED' ? remandReason ?? null : null,
      },
      include: { author: true, _count: { select: { likes: true } } },
    });
    return mapReview(review);
  },
  async findByStatuses(
    statuses: Array<'PENDING' | 'APPROVED' | 'REJECTED'>,
    authorId?: string,
  ) {
    const reviews = await prisma.review.findMany({
      where: {
        status: { in: statuses },
        ...(authorId ? { authorId } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
      include: { author: true, _count: { select: { likes: true } } },
    });
    return reviews.map(mapReview);
  },
  async toggleLike(reviewId: string, userId: string) {
    const existing = await prisma.reviewLike.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });
    await prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.reviewLike.delete({
          where: { reviewId_userId: { reviewId, userId } },
        });
      } else {
        await tx.reviewLike.create({
          data: { reviewId, userId },
        });
      }
    });
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { author: true, _count: { select: { likes: true } } },
    });
    if (!review) {
      throw new Error('レビューが見つかりませんでした。');
    }
    return mapReview(review);
  },
  async hasUserLiked(reviewId: string, userId: string) {
    const existing = await prisma.reviewLike.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });
    return !!existing;
  },
  async deleteById(id: string) {
    await prisma.review.delete({
      where: { id },
    });
  },
};
