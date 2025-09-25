// src/types/gatherings/cancel.ts
import { Gathering } from "./models";

// 모임 취소 성공
export type CancelGatheringResponse = Gathering;

// 인증 오류
export interface CancelGatheringUnauthorizedResponse {
  code: "UNAUTHORIZED";
  message: string;
}

// 권한 오류
export interface CancelGatheringForbiddenResponse {
  code: "FORBIDDEN";
  message: string;
}

// 모임 없음
export interface CancelGatheringNotFoundResponse {
  code: "NOT_FOUND";
  message: string;
}
