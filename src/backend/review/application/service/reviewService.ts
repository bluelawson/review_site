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
    if (review.status !== 'APPROVED') {
      if (!viewerEmail) return null;
      const viewer = await this.userRepository.upsertByEmail(viewerEmail);
      const isAuthor = viewer.email === review.author.email;
      const isAdmin = viewer.plan === 'admin';
      if (!isAuthor && !isAdmin) return null;
    }
    if (!viewerEmail) {
      return { ...review, likedByMe: false };
    }
    const user = await this.userRepository.upsertByEmail(viewerEmail);
    const likedByMe = await this.reviewRepository.hasUserLiked(id, user.id);
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

  async setReviewVisibility(input: UpdateReviewVisibilityDto): Promise<Review> {
    const review = await this.reviewRepository.findById(input.id);
    if (!review) {
      throw new Error('レビューが見つかりませんでした。');
    }
    if (review.status !== 'APPROVED') {
      throw new Error('審査中のレビューは公開状態を変更できません。');
    }
    return this.reviewRepository.setVisibility(input.id, input.isPublished);
  }

  async listModerationReviews(viewerEmail: string): Promise<Review[]> {
    const viewer = await this.userRepository.upsertByEmail(viewerEmail);
    const statuses = ['PENDING', 'REJECTED'] as const;
    if (viewer.plan === 'admin') {
      return this.reviewRepository.findByStatuses([...statuses]);
    }
    return this.reviewRepository.findByStatuses([...statuses], viewer.id);
  }

  async setReviewStatus(input: {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewerEmail: string;
  }): Promise<Review> {
    const reviewer = await this.userRepository.upsertByEmail(
      input.reviewerEmail,
    );
    if (reviewer.plan !== 'admin') {
      throw new Error('この操作は管理者のみ実行できます。');
    }
    return this.reviewRepository.setStatus(input.id, input.status);
  }

  async likeReview(input: LikeReviewDto): Promise<Review> {
    const user = await this.userRepository.upsertByEmail(input.userEmail);
    const review = await this.reviewRepository.toggleLike(input.id, user.id);
    const likedByMe = await this.reviewRepository.hasUserLiked(
      input.id,
      user.id,
    );
    return { ...review, likedByMe };
  }
}
