// src/lib/api/auths.ts
import { apiClient } from "./client";
import {
  SignupRequest,
  SignupResponse,
  SigninRequest,
  SigninResponse,
  SignoutResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/types/auths";

export async function signup(teamId: string, data: SignupRequest) {
  return apiClient<SignupResponse>(`/${teamId}/auths/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signin(teamId: string, data: SigninRequest) {
  return apiClient<SigninResponse>(`/${teamId}/auths/signin`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signout(teamId: string) {
  return apiClient<SignoutResponse>(`/${teamId}/auths/signout`, {
    method: "POST",
  });
}

export async function getUser(teamId: string) {
  return apiClient<GetUserResponse>(`/${teamId}/auths/user`);
}

export async function updateUser(teamId: string, data: UpdateUserRequest) {
  // multipart/form-data 업로드 처리 필요 (FormData 변환)
  const formData = new FormData();
  if (data.companyName) formData.append("companyName", data.companyName);
  if (data.image) formData.append("image", data.image);

  return apiClient<UpdateUserResponse>(`/${teamId}/auths/user`, {
    method: "PUT",
    body: formData,
    headers: {}, // fetch가 자동으로 multipart 헤더 설정
  });
}
