// src/lib/mappings.ts

import { GatheringType, GatheringLocation } from "@/types/gatherings/models";

// 모임 종류 매핑 (계층형 구조)
// 성장 > 스킬업/챌린지, 성장(DALLAEMFIT)은 독립, 네트워킹은 단일 그룹
export const GatheringCategoryTree = [
  {
    label: "성장",
    children: [
      { label: "스킬업", type: "OFFICE_STRETCHING" as GatheringType },
      { label: "챌린지", type: "MINDFULNESS" as GatheringType },
    ],
  },
  {
    label: "네트워킹",
    children: [{ label: "네트워킹", type: "WORKATION" as GatheringType }],
  },
  {
    label: "성장(개별)", // DALLAEMFIT은 단일 카테고리로 별도 처리
    children: [{ label: "성장", type: "DALLAEMFIT" as GatheringType }],
  },
];

// 모임 종류 단일 매핑 (type → 한글 라벨)
// 리스트/상세 화면 등에서 label만 필요할 때 사용
export const GatheringTypeMap: Record<GatheringType, string> = {
  DALLAEMFIT: "성장",
  OFFICE_STRETCHING: "스킬업",
  MINDFULNESS: "챌린지",
  WORKATION: "네트워킹",
};

// 모임 위치 매핑
export type GatheringLocationLabel = "배움" | "도전" | "성장" | "연결";

export const GatheringLocationMap: Record<GatheringLocation, GatheringLocationLabel> = {
  건대입구: "배움",
  을지로3가: "도전",
  신림: "성장",
  홍대입구: "연결",
};
