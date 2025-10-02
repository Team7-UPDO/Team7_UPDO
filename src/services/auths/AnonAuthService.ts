// src/services/auths/AnonAuthService.ts
import Service from '../Service';
import { SigninRequest, SignupRequest, SigninResponse, SignupResponse } from '@/types/auths';

class AnonAuthService extends Service {
  login(formData: SigninRequest) {
    return this.http.post<SigninResponse>('/auths/signin', formData);
  }

  join(formData: SignupRequest) {
    return this.http.post<SignupResponse>('/auths/signup', formData);
  }
}

const anonAuthService = new AnonAuthService();
export default anonAuthService;
