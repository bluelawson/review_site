import type { User } from '../domain/model/user';
import prisma from '../../shared/prismaClient';
import { mapUser } from './userMapper';

export type UserRepository = {
  upsertByEmail(email: string): Promise<User>;
  incrementReviews(id: string): Promise<void>;
  setReviewStatusEmailEnabled(email: string, enabled: boolean): Promise<User>;
};

export const userRepository: UserRepository = {
  async upsertByEmail(email: string) {
    const userName = email.split('@')[0];
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        userName,
      },
      create: {
        name: userName,
        userName,
        email,
        password: 'changeme',
        reviewStatusEmailEnabled: true,
      },
    });
    return mapUser(user);
  },
  async incrementReviews(id: string) {
    await prisma.user.update({
      where: { id },
      data: {
        reviewsSubmitted: {
          increment: 1,
        },
      },
    });
  },
  async setReviewStatusEmailEnabled(email: string, enabled: boolean) {
    const userName = email.split('@')[0];
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        reviewStatusEmailEnabled: enabled,
      },
      create: {
        name: userName,
        userName,
        email,
        password: 'changeme',
        reviewStatusEmailEnabled: enabled,
      },
    });
    return mapUser(user);
  },
};
