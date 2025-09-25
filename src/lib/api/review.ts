// src/lib/api/reviews.ts
import { apiClient } from "./client";
import {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  GetReviewScoresRequest,
  GetReviewScoresResponse,
} from "@/types/reviews";

// 리뷰 추가
export async function createReview(teamId: string, data: CreateReviewRequest) {
  return apiClient<CreateReviewResponse>(`/${teamId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 리뷰 목록 조회
export async function getReviews(teamId: string, params?: GetReviewsRequest) {
  const query = params
    ? "?" +
      new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiClient<GetReviewsResponse>(`/${teamId}/reviews${query}`);
}

// 리뷰 평점 목록 조회
export async function getReviewScores(
  teamId: string,
  params?: GetReviewScoresRequest
) {
  const query = params
    ? "?" +
      new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiClient<GetReviewScoresResponse>(
    `/${teamId}/reviews/scores${query}`
  );
}
