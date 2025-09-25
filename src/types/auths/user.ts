// 공통: 회원 정보 모델
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  companyName: string;
  image: string;
  createdAt: string; // ISO 8601 날짜
  updatedAt: string; // ISO 8601 날짜
  teamId?: number;   // GET 응답에만 포함됨
}

// GET /auths/user - 회원 정보 반환 성공 (200)
export type UserInfoResponse = UserInfo & { teamId: number };

// PUT /auths/user - 회원 정보 수정 요청 (multipart/form-data)
export interface UpdateUserRequest {
  companyName?: string;
  image?: File; // multipart/form-data 업로드
}

// PUT /auths/user - 회원 정보 수정 성공 (200)
export type UpdateUserResponse = UserInfo;

// 공통 에러 응답 (401, 404, 400)
export interface UserErrorResponse {
  code: "UNAUTHORIZED" | "USER_NOT_FOUND" | "VALIDATION_ERROR";
  parameter?: string; // VALIDATION_ERROR 에서만 사용
  message: string;
}