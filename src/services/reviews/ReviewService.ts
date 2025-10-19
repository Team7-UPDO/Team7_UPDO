import PolymorphicHttpClient from '../PolymorphicHttpClient';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsParams,
  GetReviewsResponse,
  GetReviewScoresParams,
  GetReviewScoresResponse,
} from '@/types/reviews';

export class ReviewService {
  private http = PolymorphicHttpClient.getInstance();

  private toQuery<T extends object>(params?: T) {
    if (!params) return '';
    return (
      '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    );
  }

  createReview(data: CreateReviewRequest) {
    return this.http.post<CreateReviewResponse>(`/reviews`, data);
  }

  getReviews(params?: GetReviewsParams) {
    return this.http.get<GetReviewsResponse>(`/reviews${this.toQuery(params)}`);
  }

  getReviewScores(params?: GetReviewScoresParams) {
    return this.http.get<GetReviewScoresResponse>(`/reviews/scores${this.toQuery(params)}`);
  }
}

export const reviewService = new ReviewService();

export const createReview = reviewService.createReview.bind(reviewService);
export const getReviews = reviewService.getReviews.bind(reviewService);
export const getReviewScores = reviewService.getReviewScores.bind(reviewService);
