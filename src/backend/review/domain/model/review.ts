import type { User } from '../../../user/domain/model/user';

export type Review = {
  id: string;
  shopName: string;
  workerName: string;
  estimatedAge: string | null;
  bodyType: string | null;
  bustSize: string | null;
  heightCm: number | null;
  personality: string | null;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  rating: number;
  damage: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: User;
};
