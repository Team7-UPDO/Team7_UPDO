// src/types/gatherings/joined.ts
import { Gathering } from "./models";

// 참석한 모임 정렬 기준
export type JoinedSortBy = "dateTime" | "registrationEnd" | "joinedAt";

// 참석한 모임 목록 조회 요청
export interface GetJoinedGatheringsRequest {
  completed?: boolean;
  reviewed?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: JoinedSortBy; // 기본값: dateTime
  sortOrder?: "asc" | "desc"; // 기본값: asc
}

// 참석한 모임 아이템
export interface JoinedGathering extends Gathering {
  joinedAt: string; // ISO 8601
  isCompleted: boolean;
  isReviewed: boolean;
}

// 참석한 모임 목록 조회 성공
export type GetJoinedGatheringsResponse = JoinedGathering[];

// 요청 오류
export interface GetJoinedGatheringsErrorResponse {
  code: "VALIDATION_ERROR";
  parameter: string;
  message: string;
}

// 인증 오류
export interface GetJoinedGatheringsUnauthorizedResponse {
  code: "UNAUTHORIZED";
  message: string;
}
