// src/types/gatherings/models.ts

// 모임 종류
export type GatheringType =
  | "DALLAEMFIT"
  | "OFFICE_STRETCHING"
  | "MINDFULNESS"
  | "WORKATION";

// 모임 위치
export type GatheringLocation = "건대입구" | "을지로3가" | "신림" | "홍대입구";

// 정렬 기준
export type GatheringSortBy = "dateTime" | "registrationEnd" | "participantCount";

// 정렬 순서
export type SortOrder = "asc" | "desc";

// 모임 공통 모델
export interface Gathering {
  teamId: number;
  id: number;
  type: GatheringType | string; // 일부 스펙 예시가 string으로만 표기되어 있어 유연하게 처리
  name: string;
  dateTime: string; // ISO 8601
  registrationEnd?: string; // ISO 8601
  location: GatheringLocation;
  participantCount: number;
  capacity: number;
  image: string;
  createdBy: number;
  canceledAt?: string | null; // 목록에는 존재, 생성 응답에는 미표기
}

// 참가자에 포함되는 사용자 요약 정보
export interface ParticipantUser {
  id: number;
  email: string;
  name: string;
  companyName: string;
  image: string;
}

// 참가자 모델
export interface Participant {
  teamId: number;
  userId: number;
  gatheringId: number;
  joinedAt: string; // ISO 8601
  User: ParticipantUser;
}
