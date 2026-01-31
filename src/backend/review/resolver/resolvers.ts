import type {
  CreateReviewDto,
  ReviewFilterDto,
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
    review: async (_parent: unknown, args: { id: string }) => {
      return reviewService.getReview(args.id);
    },
  },
  Mutation: {
    createReview: async (
      _parent: unknown,
      args: { input: CreateReviewDto },
    ) => {
      return reviewService.createReview(args.input);
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
  },
};

export default resolvers;
