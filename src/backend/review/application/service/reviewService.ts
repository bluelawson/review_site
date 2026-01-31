import type {
  CreateReviewDto,
  LikeReviewDto,
  ReviewFilterDto,
  UpdateReviewVisibilityDto,
} from '../dto/reviewDto';
import type { Review } from '../../domain/model/review';
import type { ReviewRepository } from '../../repository/reviewRepository';
import type { UserRepository } from '../../../user/repository/userRepository';

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async listReviews(filter?: ReviewFilterDto | null): Promise<Review[]> {
    return this.reviewRepository.findMany(filter);
  }

  async getReview(id: string): Promise<Review | null> {
    return this.reviewRepository.findById(id);
  }

  async getReviewWithViewer(
    id: string,
    viewerEmail?: string | null,
  ): Promise<Review | null> {
    const review = await this.reviewRepository.findById(id);
    if (!review) return null;
    if (!viewerEmail) {
      return { ...review, likedByMe: false };
    }
    const user = await this.userRepository.upsertByEmail(viewerEmail);
    const likedByMe = await this.reviewRepository.hasUserLiked(
      id,
      user.id,
    );
    return { ...review, likedByMe };
  }

  async createReview(input: CreateReviewDto): Promise<Review> {
    const { authorEmail, ...data } = input;
    const user = await this.userRepository.upsertByEmail(authorEmail);
    const review = await this.reviewRepository.create(data, user.id);
    await this.userRepository.incrementReviews(user.id);
    return review;
  }

  async deleteReview(id: string): Promise<boolean> {
    await this.reviewRepository.deleteById(id);
    return true;
  }

  async setReviewVisibility(
    input: UpdateReviewVisibilityDto,
  ): Promise<Review> {
    return this.reviewRepository.setVisibility(input.id, input.isPublished);
  }

  async likeReview(input: LikeReviewDto): Promise<Review> {
    if (input.userEmail === 'guest@seren.jp') {
      throw new Error('ゲストユーザーはいいねできません。');
    }
    const user = await this.userRepository.upsertByEmail(input.userEmail);
    const review = await this.reviewRepository.toggleLike(
      input.id,
      user.id,
    );
    const likedByMe = await this.reviewRepository.hasUserLiked(
      input.id,
      user.id,
    );
    return { ...review, likedByMe };
  }
}
