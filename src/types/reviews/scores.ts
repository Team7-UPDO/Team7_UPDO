// src/types/reviews/scores.ts
import { ReviewScore } from "./models";

// 리뷰 평점 목록 조회 요청
export interface GetReviewScoresRequest {
  gatheringId?: string; // 쉼표 목록
  type?: "DALLAEMFIT" | "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";
}

// 리뷰 평점 목록 조회 성공
export type GetReviewScoresResponse = ReviewScore[];

// 요청 오류
export interface GetReviewScoresErrorResponse {
  code: "VALIDATION_ERROR";
  parameter: string;
  message: string;
}
