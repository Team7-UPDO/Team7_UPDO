// src/services/auths/AuthService.ts

import {
  SignupRequest,
  SignupResponse,
  SigninRequest,
  SigninResponse,
  SignoutResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/types/auths';
import PolymorphicHttpClient from '../PolymorphicHttpClient';

export class AuthService {
  private http = PolymorphicHttpClient.getInstance();

  signup(teamId: string, data: SignupRequest) {
    return this.http.post<SignupResponse>(`/${teamId}/auths/signup`, data);
  }

  signin(teamId: string, data: SigninRequest) {
    return this.http.post<SigninResponse>(`/${teamId}/auths/signin`, data);
  }

  signout(teamId: string) {
    return this.http.post<SignoutResponse>(`/${teamId}/auths/signout`);
  }

  getUser(teamId: string) {
    return this.http.get<GetUserResponse>(`/${teamId}/auths/user`);
  }

  updateUser(teamId: string, data: UpdateUserRequest) {
    const formData = new FormData();
    if (data.companyName) formData.append('companyName', data.companyName);
    if (data.image) formData.append('image', data.image);
    return this.http.put<UpdateUserResponse>(`/${teamId}/auths/user`, formData);
  }
}

export const authService = new AuthService();
