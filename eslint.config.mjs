// ESLint 9 Flat Config for Next.js + TypeScript
import storybook from 'eslint-plugin-storybook';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 기본 권장 규칙 + TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // 글로벌 ignores
  {
    ignores: [
      // 빌드 결과물
      '.next/**',
      'dist/**',
      'out/**',
      'build/**',
      'storybook-static/**',
      // 의존성
      'node_modules/**',
      '.pnpm-store/**',
      // 환경 변수 파일
      '.env',
      '*.env',
      // 캐시 파일
      '.swc/**',
      '.turbo/**',
      // 테스트 결과
      'coverage/**',
      // E2E 테스트 (Playwright — React 규칙 적용 대상 아님)
      'e2e/**',
      // 설정 파일
      'prettier.config.mjs',
      'next-env.d.ts',
    ],
  },

  // Storybook 플러그인
  ...storybook.configs['flat/recommended'],

  // TanStack Query 플러그인 (v5 recommended preset)
  ...tanstackQuery.configs['flat/recommended'],

  // Prettier 충돌 방지 (마지막에 위치)
  prettier,

  // 메인 룰 설정
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // === Prettier 연동 ===
      'linebreak-style': 'off',
      'prettier/prettier': ['warn', { endOfLine: 'lf' }],

      // === TypeScript ===
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',

      // === Import 정리 ===
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'none', ignoreRestSiblings: true },
      ],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // === React ===
      'react/self-closing-comp': 'warn',

      // === 일반 ===
      'no-console': 'off',
    },
  },

  // Storybook 파일 전용 룰
  {
    files: ['**/*.stories.@(ts|tsx)'],
    rules: {
      'storybook/no-renderer-packages': 'off',
    },
  },
];

export default eslintConfig;
