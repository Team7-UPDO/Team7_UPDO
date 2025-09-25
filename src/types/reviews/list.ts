// src/types/reviews/list.ts
import { ReviewWithRelations } from "./models";

// 리뷰 목록 조회 요청
export interface GetReviewsRequest {
  gatheringId?: number;
  userId?: number;
  type?: "DALLAEMFIT" | "OFFICE_STRETCHING" | "MINDFULNESS" | "WORKATION";
  location?: "건대입구" | "을지로3가" | "신림" | "홍대입구";
  date?: string; // YYYY-MM-DD
  registrationEnd?: string; // YYYY-MM-DD
  sortBy?: "createdAt" | "score" | "participantCount";
  sortOrder?: "asc" | "desc";
  limit?: number; // 기본값 10
  offset?: number; // 기본값 0
}

// 리뷰 목록 조회 성공
export interface GetReviewsResponse {
  data: ReviewWithRelations[];
  totalItemCount: number;
  currentPage: number;
  totalPages: number;
}

// 요청 오류
export interface GetReviewsErrorResponse {
  code: "VALIDATION_ERROR";
  errors: Array<{
    parameter: string;
    message: string;
  }>;
}
