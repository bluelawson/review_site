import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

type ReviewFilterInput = {
  keyword?: string | null;
  shopName?: string | null;
  workerName?: string | null;
  bodyType?: string | null;
  personality?: string | null;
  bustSize?: string | null;
  heightMin?: number | null;
  heightMax?: number | null;
  ratingMin?: number | null;
};

type ReviewInput = {
  shopName: string;
  workerName: string;
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

const buildWhere = (filter?: ReviewFilterInput | null): Prisma.ReviewWhereInput => {
  if (!filter) return {};
  const where: Prisma.ReviewWhereInput = {};

  if (filter.keyword) {
    where.OR = [
      { headline: { contains: filter.keyword } },
      { detail: { contains: filter.keyword } },
      { shopName: { contains: filter.keyword } },
      { workerName: { contains: filter.keyword } },
    ];
  }
  if (filter.shopName) where.shopName = filter.shopName;
  if (filter.workerName) where.workerName = { contains: filter.workerName };
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
  if (filter.ratingMin) {
    where.rating = { gte: filter.ratingMin };
  }
  return where;
};

const resolvers = {
  Query: {
    reviews: async (_parent: unknown, args: { filter?: ReviewFilterInput | null }) => {
      return prisma.review.findMany({
        where: buildWhere(args.filter),
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      });
    },
    review: async (_parent: unknown, args: { id: string }) => {
      return prisma.review.findUnique({
        where: { id: args.id },
        include: { author: true },
      });
    },
  },
  Mutation: {
    createReview: async (_parent: unknown, args: { input: ReviewInput }) => {
      const { authorEmail, serviceHighlights, rating, heightCm, ...rest } = args.input;

      const serviceHighlightsValue: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
        serviceHighlights == null
          ? Prisma.JsonNull
          : (serviceHighlights as Prisma.InputJsonValue);

      const user = await prisma.user.upsert({
        where: { email: authorEmail },
        update: {},
        create: {
          name: authorEmail.split('@')[0],
          email: authorEmail,
          password: 'changeme',
        },
      });

      const review = await prisma.review.create({
        data: {
          ...rest,
          rating,
          heightCm: heightCm ?? null,
          serviceHighlights: serviceHighlightsValue,
          author: {
            connect: { id: user.id },
          },
        },
        include: { author: true },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          reviewsSubmitted: {
            increment: 1,
          },
        },
      });

      return review;
    },
    deleteReview: async (_parent: unknown, args: { id: string }) => {
      await prisma.review.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
  Review: {
    serviceHighlights: (parent: { serviceHighlights: Prisma.JsonValue | null }) => {
      if (!parent.serviceHighlights) {
        return [];
      }
      if (Array.isArray(parent.serviceHighlights)) {
        return parent.serviceHighlights as string[];
      }
      return [];
    },
  },
};

export default resolvers;
