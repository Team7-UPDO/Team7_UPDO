// src/types/gatherings/list.ts
import { Gathering, GatheringType, GatheringSortBy, SortOrder } from "./models";

// 모임 목록 조회 요청 (Query Parameters)
export interface GetGatheringsRequest {
  id?: string; // "1,2,3"
  type?: GatheringType;
  location?: "건대입구" | "을지로3가" | "신림" | "홍대입구";
  date?: string; // YYYY-MM-DD
  createdBy?: number;
  sortBy?: GatheringSortBy;
  sortOrder?: SortOrder;
  limit?: number; // 최소 1
  offset?: number; // 최소 0
}

// 모임 목록 조회 성공
export type GetGatheringsResponse = Gathering[];

// 요청 오류
export interface GetGatheringsErrorResponse {
  code: "VALIDATION_ERROR";
  parameter: string;
  message: string;
}
