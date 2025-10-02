// src/services/Service.ts
// 이 파일은 프로젝트에 이미 존재하는 HttpClient / PolymorphicHttpClient 싱글턴 인스턴스를
// 도메인 서비스에서 쉽게 사용하도록 추상 클래스로 감싼 것입니다.
//
// 기존 코드 구조와 호환되도록 다음 경로로 import 합니다:
// - HttpClient: @/services/HttpClient
// - PolymorphicHttpClient: @/services/PolymorphicHttpClient
//
// 파일을 생성한 뒤에 VSCode에서 TypeScript 서버를 재시작(TS: Restart TS Server) 하세요.

// src/services/Service.ts
import HttpClient from './HttpClient';
import PolymorphicHttpClient from './PolymorphicHttpClient';

export default abstract class Service {
  protected http = HttpClient.getInstance();
}

export abstract class ApiRouteService {
  protected http = PolymorphicHttpClient.getInstance();
}
