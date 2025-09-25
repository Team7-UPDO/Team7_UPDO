// src/types/gatherings/participants.ts
import { Participant } from "./models";

// 참가자 목록 조회 요청
export interface GetParticipantsRequest {
  limit?: number; // 기본값 5
  offset?: number; // 기본값 0
  sortBy?: "joinedAt"; // 기본값 joinedAt
  sortOrder?: "asc" | "desc"; // 기본값 asc
}

// 참가자 목록 조회 성공
export type GetParticipantsResponse = Participant[];

// 요청 오류
export interface GetParticipantsErrorResponse {
  code: "VALIDATION_ERROR";
  parameter: string;
  message: string;
}

// 모임 없음
export interface GetParticipantsNotFoundResponse {
  code: "NOT_FOUND";
  message: string;
}
