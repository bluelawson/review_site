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
  setVisibility(id: string, isPublished: boolean): Promise<Review>;
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
  if (filter.bodyType) where.bodyType = filter.bodyType;
  if (filter.personality) where.personality = filter.personality;
  if (filter.bustSize) where.bustSize = filter.bustSize;
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
      where: buildWhere(filter),
      orderBy: [{ reviewRating: 'desc' }, { createdAt: 'desc' }],
      include: { author: true },
    });
    return reviews.map(mapReview);
  },
  async findById(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { author: true },
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
        reviewRating: input.castRating,
        heightCm: input.heightCm ?? null,
        serviceHighlights: serviceHighlightsValue,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });
    return mapReview(review);
  },
  async setVisibility(id: string, isPublished: boolean) {
    const review = await prisma.review.update({
      where: { id },
      data: { isPublished },
      include: { author: true },
    });
    return mapReview(review);
  },
  async deleteById(id: string) {
    await prisma.review.delete({
      where: { id },
    });
  },
};
