// src/types/reviews/create.ts
import { Review } from "./models";

// 리뷰 추가 요청
export interface CreateReviewRequest {
  gatheringId: number;
  score: number;
  comment: string;
}

// 리뷰 추가 성공
export type CreateReviewResponse = Review;

// 권한 오류
export interface CreateReviewForbiddenResponse {
  code: "FORBIDDEN";
  message: string;
}

// 모임 없음
export interface CreateReviewNotFoundResponse {
  code: "NOT_FOUND";
  message: string;
}
