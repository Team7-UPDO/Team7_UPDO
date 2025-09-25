// src/types/gatherings/create.ts
import { Gathering, GatheringType } from "./models";

// 모임 생성 요청 (multipart/form-data)
export interface CreateGatheringRequest {
  location: string;
  type: GatheringType;
  name: string;
  dateTime: string; // YYYY-MM-DDTHH:MM:SS
  capacity: number; // 최소 5
  image?: File;
  registrationEnd?: string; // YYYY-MM-DDTHH:MM:SS
}

// 모임 생성 성공
export type CreateGatheringResponse = Gathering;

// 요청 오류
export interface CreateGatheringErrorResponse {
  code: "VALIDATION_ERROR";
  parameter: string;
  message: string;
}

// 인증 오류
export interface CreateGatheringUnauthorizedResponse {
  code: "UNAUTHORIZED";
  message: string;
}
