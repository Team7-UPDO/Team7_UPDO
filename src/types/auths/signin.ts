// ✅ 로그인 요청
export interface SigninRequest {
  email: string;
  password: string;
}

// ✅ 로그인 성공 응답 (200)
export interface SigninResponse  {
  token: string;
}

// ✅ 로그인 실패 응답 (400, 401, 500)
export interface SigninErrorResponse {
  code: "INVALID_CREDENTIALS" | "USER_NOT_FOUND" | "SERVER_ERROR";
  message: string;
}
