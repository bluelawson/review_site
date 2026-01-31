import type { User } from '../domain/model/user';
import prisma from '../../shared/prismaClient';
import { mapUser } from './userMapper';

export type UserRepository = {
  upsertByEmail(email: string): Promise<User>;
  incrementReviews(id: string): Promise<void>;
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
};
