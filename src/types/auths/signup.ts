// ✅ 회원가입 요청
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

// ✅ 회원가입 성공 응답 (201)
export interface SignupResponse {
  message: string; // "사용자 생성 성공"
}

// ✅ 회원가입 실패 응답 (400)
export interface SignupErrorResponse {
  code: string;       // "VALIDATION_ERROR"
  parameter?: string; // "email" (어떤 필드에서 오류 났는지)
  message: string;    // "유효한 이메일 주소를 입력하세요"
}
