import type {
  CreateReviewDto,
  LikeReviewDto,
  ReviewFilterDto,
  SetReviewStatusDto,
  UpdateReviewDto,
  UpdateReviewVisibilityDto,
} from '../application/dto/reviewDto';
import { ReviewService } from '../application/service/reviewService';
import { reviewRepository } from '../repository/reviewRepository';
import { userRepository } from '../../user/repository/userRepository';

const reviewService = new ReviewService(reviewRepository, userRepository);

const resolvers = {
  Query: {
    reviews: async (
      _parent: unknown,
      args: { filter?: ReviewFilterDto | null },
    ) => {
      return reviewService.listReviews(args.filter);
    },
    review: async (
      _parent: unknown,
      args: { id: string; viewerEmail?: string | null },
    ) => {
      return reviewService.getReviewWithViewer(args.id, args.viewerEmail);
    },
    reviewRequests: async (
      _parent: unknown,
      args: { viewerEmail: string },
    ) => {
      return reviewService.listModerationReviews(args.viewerEmail);
    },
  },
  Mutation: {
    createReview: async (
      _parent: unknown,
      args: { input: CreateReviewDto },
    ) => {
      return reviewService.createReview(args.input);
    },
    updateReview: async (
      _parent: unknown,
      args: { input: UpdateReviewDto },
    ) => {
      return reviewService.updateReview(args.input);
    },
    deleteReview: async (_parent: unknown, args: { id: string }) => {
      return reviewService.deleteReview(args.id);
    },
    setReviewVisibility: async (
      _parent: unknown,
      args: UpdateReviewVisibilityDto,
    ) => {
      return reviewService.setReviewVisibility(args);
    },
    likeReview: async (_parent: unknown, args: LikeReviewDto) => {
      return reviewService.likeReview(args);
    },
    setReviewStatus: async (_parent: unknown, args: SetReviewStatusDto) => {
      return reviewService.setReviewStatus(args);
    },
    updateReviewStatusEmailPreference: async (
      _parent: unknown,
      args: { userEmail: string; enabled: boolean },
    ) => {
      return userRepository.setReviewStatusEmailEnabled(
        args.userEmail,
        args.enabled,
      );
    },
  },
};

export default resolvers;
