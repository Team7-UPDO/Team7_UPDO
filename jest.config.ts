import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',

  // 절대경로(@/...) 매핑 추가
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // '@/components/...' → 'src/components/...'

    // CSS, 이미지 등 비JS 파일 mock 처리
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.ts',
  },

  // 테스트 실행 전 환경 설정 파일 (예: jest-dom 확장)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // transform 옵션 (ts-jest 대신 next/jest가 내부적으로 Babel 사용)
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],

  // 테스트 경로 (기본값으로도 충분하지만 명시해두면 명확)
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.(ts|tsx)', // src/ __tests__ 폴더 배치 허용
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)', // src/폴더/ __tests__ 폴더 배치 허용
    '<rootDir>/src/**/*.(test).(ts|tsx)', // 파일 옆 배치 허용
  ],

  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/setup/', // 헬퍼 폴더 무시
  ],
};

export default createJestConfig(config);
