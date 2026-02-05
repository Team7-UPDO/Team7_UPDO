import {
  GetUserResponse,
  SigninRequest,
  SigninResponse,
  SignoutResponse,
  SignupRequest,
  SignupResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/types/auths';

import HttpClient from '../httpClient';

class AuthService {
  private http = HttpClient.getInstance();

  signup(data: SignupRequest) {
    return this.http.post<SignupResponse>('/auths/signup', data);
  }

  signin(data: SigninRequest) {
    return this.http.post<SigninResponse>('/auths/signin', data);
  }

  signout() {
    return this.http.post<SignoutResponse>('/auths/signout');
  }

  getUser() {
    return this.http.get<GetUserResponse>('/auths/user');
  }

  updateUser(data: UpdateUserRequest) {
    // ✅ 브라우저 환경에서만 FormData 사용
    if (typeof window === 'undefined' || typeof FormData === 'undefined') {
      // SSR / 테스트 환경에서는 안전하게 빈 객체 반환
      return Promise.resolve({} as UpdateUserResponse);
    }

    const formData = new FormData();
    if (data.companyName) formData.append('companyName', data.companyName);
    if (data.image) formData.append('image', data.image);
    return this.http.put<UpdateUserResponse>('/auths/user', formData);
  }
}

// ✅ 그대로 export 유지 (import 수정 불필요)
export const authService = new AuthService();
