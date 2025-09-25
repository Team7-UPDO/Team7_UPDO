// src/types/gatherings/leave.ts
// 모임 참여 취소 성공
export interface LeaveGatheringResponse {
  message: "모임을 참여 취소했습니다";
}

// 잘못된 요청
export interface LeaveGatheringBadRequestResponse {
  code: "PAST_GATHERING";
  message: string;
}

// 인증 오류
export interface LeaveGatheringUnauthorizedResponse {
  code: "UNAUTHORIZED";
  message: string;
}

// 모임 없음
export interface LeaveGatheringNotFoundResponse {
  code: "NOT_FOUND";
  message: string;
}
