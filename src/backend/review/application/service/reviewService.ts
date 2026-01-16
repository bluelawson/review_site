import type { CreateReviewDto, ReviewFilterDto } from '../dto/reviewDto';
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
}
