module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals', // Next.js 기본 권장 규칙
    'plugin:@typescript-eslint/recommended', // TS 권장 규칙
    'plugin:prettier/recommended', // Prettier와 충돌하는 규칙 꺼주기
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'unused-imports',
    '@tanstack/query',
  ],
  rules: {
    // OS 라인엔딩 차이 → ESLint linebreak-style 규칙을 비활성화한다.
    // (OS 별 줄바꿈(LF/CRLF)으로 인한 불필요한 에러 방지)
    'linebreak-style': 'off',
    // Prettier와 불일치 시 경고 (LF 기준 강제)
    'prettier/prettier': ['warn', { endOfLine: 'lf' }],
    // 사용하지 않는 변수 → 경고만
    '@typescript-eslint/no-unused-vars': 'warn',
    // unused-imports 플러그인: import 정리
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    // queryKey는 배열 형태로만 사용
    '@tanstack/query/prefer-query-object-syntax': 'error',
    // QueryClient는 전역에서 한 번만 생성해야 함
    '@tanstack/query/stable-query-client': 'error',
    // queryKey에 필요한 의존성 빠뜨리지 않도록 강제
    '@tanstack/query/exhaustive-deps': 'error',

    // ⚠️ queryKey를 구조분해 할당할 때 rest (...) 쓰지 않기
    '@tanstack/query/no-rest-destructuring': 'warn',
    // JSX에서 빈 태그는 self-closing 권장
    'react/self-closing-comp': 'warn',
    // console.log 허용
    'no-console': 'off',
    // any 타입 사용 가능
    '@typescript-eslint/no-explicit-any': 'off',
    // import 정렬
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    // storybook/react 직접 import 허용
    'storybook/no-renderer-packages': 'off',
  },
};
