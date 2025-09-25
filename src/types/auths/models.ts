// src/types/auths/models.ts
// 공통 사용자 모델
export interface IAuthUser {
  id: number;
  email: string;
  name: string;
  companyName: string;
  image: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  teamId?: number;   // 일부 API에서만 존재
}
