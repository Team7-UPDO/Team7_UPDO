// 테스트 환경에서 필요한 환경변수 기본값 설정 (CI 등 .env 없는 환경 대응)
process.env.NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// DOM 요소를 테스트할 때 매우 유용한 커스텀 매처(matcher)들을 제공
// toBeInTheDocument(), toHaveTextContent(), toBeVisible() 등
// 1. 전역 설정: 모든 테스트 파일에서 이 매처들을 별도로 import 하지 않고도 사용할 수 있습니다.
// 2. 코드 중복 방지: 각 테스트 파일마다 동일한 import문을 반복하지 않아도 됩니다.
// 3. 일관성 유지: 모든 테스트에 동일한 확장 기능이 적용되므로 테스트 코드가 일관성을 유지합니다.
// 4. 설정 집중화: 테스트 환경 설정을 한 곳에서 관리할 수 있어 나중에 변경이 필요할 때 편리합니다.
import '@testing-library/jest-dom';

beforeEach(() => {
  localStorage.clear(); // persist 미들웨어 방지
});

afterEach(() => {
  jest.restoreAllMocks(); // 스파이/목 원복
  jest.clearAllMocks(); // 목 초기화
});
