// src/services/reviews/ReviewService.ts

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

  createReview(teamId: string, data: CreateReviewRequest) {
    return this.http.post<CreateReviewResponse>(`/${teamId}/reviews`, data);
  }

  getReviews(teamId: string, params?: GetReviewsParams) {
    return this.http.get<GetReviewsResponse>(`/${teamId}/reviews${this.toQuery(params)}`);
  }

  getReviewScores(teamId: string, params?: GetReviewScoresParams) {
    return this.http.get<GetReviewScoresResponse>(
      `/${teamId}/reviews/scores${this.toQuery(params)}`,
    );
  }
}

export const reviewService = new ReviewService();
