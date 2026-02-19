# 기술 사용 문서

> UPDO 프로젝트에서 사용한 핵심 기술과 실제 적용 방식, 그리고 선택 근거를 정리한 문서

---

## 1. 문서 목적

- 기술 스택 나열이 아니라 "왜 선택했고, 어디에 적용했는지"를 공유한다.
- 리팩토링 시 유지해야 할 구조/품질 기준을 명확히 한다.

---

## 2. 구조 원칙

- **페이지 계층(App Router)**: 라우트 단위로 SSR/메타데이터 처리
- **UI/Feature 계층**: 화면 렌더링과 사용자 상호작용 담당
- **상태/데이터 계층**: 서버 상태(TanStack Query)와 클라이언트 상태(Zustand) 분리
- **서비스 계층**: API 호출 로직을 컴포넌트에서 분리해 재사용성과 테스트 용이성 확보

---

## 3. 핵심 기술과 실제 적용

### 3.1 Next.js 15 (App Router)

- `src/app` 기반 라우팅을 사용한다.
- `src/app/layout.tsx`에서 `QueryProvider`, `AuthProvider`, `AuthSessionWatcher`를 주입한다.
- `src/app/gathering/[id]/page.tsx`, `src/app/reviews/page.tsx`에서 `prefetch + HydrationBoundary`를 적용해 초기 로딩 UX를 개선한다.

### 3.2 TanStack Query

- 목록/상세/참가자/리뷰 등 서버 상태를 Query로 관리한다.
- Query Key를 `src/constants/queryKeys.ts`에 중앙화해 invalidate 기준을 통일한다.
- Mutation 성공 시 관련 쿼리를 무효화해 최신 화면 상태를 보장한다.

### 3.3 Zustand

- 클라이언트 전역 상태를 도메인별로 분리한다.
- `useAuthStore`: 토큰, 만료 시각, 로그인 잠금 상태
- `useUserStore`: 내 프로필, 로딩/에러 상태
- `useFavoriteStore`: 사용자별 찜 목록(`persist`)

### 3.4 Service Layer + HttpClient

- API 호출은 `src/services/*`에 분리한다.
- `HttpClient` 싱글톤에서 `API_BASE_URL`, `TEAM_ID`, `Authorization` 헤더, 에러 포맷을 공통 처리한다.
- 인증 서비스(`authService`, `gatheringService`, `reviewService`)와 익명 조회 서비스(`anonGatheringService`, `anonReviewService`)를 역할 기준으로 분리한다.

### 3.5 Tailwind CSS + CVA

- 스타일은 Tailwind 유틸리티를 기본으로 사용한다.
- 반복되는 UI 변형(버튼/배지)은 CVA로 관리해 컴포넌트 API를 단순화한다.
- 토큰 기반 스타일 규칙으로 색상/타이포/간격 일관성을 유지한다.

### 3.6 Framer Motion

- `LazyMotion`을 사용해 번들 크기 부담을 줄인다.
- 필요한 상호작용에만 모션을 적용해 피드백은 유지하고 과한 애니메이션은 피한다.

---

## 4. Storybook / Chromatic 운영

### 4.1 Storybook 설정 목적

- 공통 UI와 Feature 컴포넌트를 페이지와 분리해 독립 검증한다.
- 디자인 회귀를 코드 리뷰 단계에서 조기에 발견한다.

### 4.2 현재 설정 포인트

- 프레임워크: `@storybook/nextjs-vite`
- 애드온: `docs`, `a11y`, `vitest`, `@chromatic-com/storybook`
- 전역 Decorator에서 `QueryClientProvider`를 주입해 Query 의존 컴포넌트도 스토리에서 동작하도록 구성했다.
- `next/navigation` 훅을 스토리 환경에서 안전하게 동작하도록 보정했다.

### 4.3 Chromatic 연동 방식

- PR 체크에서 Storybook 빌드 산출물을 아티팩트로 업로드 후 Chromatic에 게시한다.
- `--only-changed` 옵션으로 변경된 스토리 중심 검증을 수행한다.
- 시각 변화가 있어도 CI를 막지 않도록 `--exit-zero-on-changes` 정책을 사용한다.

---

## 5. 접근성/품질 게이트

### 5.1 접근성 기준

- 마크업은 semantic HTML과 ARIA 속성 사용을 기본 원칙으로 한다.
- Storybook `addon-a11y`를 사용하며, 현재 설정은 `test: 'todo'`로 리포트 중심으로 운영한다.

### 5.2 정적 품질 기준

- ESLint Flat Config 기반으로 `next/core-web-vitals`, `next/typescript`를 적용한다.
- `@tanstack/eslint-plugin-query`, `eslint-plugin-storybook`, `unused-imports`, `simple-import-sort`를 함께 사용한다.
- Prettier를 포함해 스타일 충돌 없이 일관된 포맷을 유지한다.

### 5.3 커밋/PR 게이트

- `pre-commit`: `lint-staged` + `test:changed`
- `commit-msg`: `commitlint`로 Conventional Commit 규칙 적용
- PR 체크: `lint`, `typecheck`, `unit/integration test`, `build-storybook`, `next build`, `chromatic`, `e2e`

테스트 상세 전략은 `docs/TEST_STRATEGY.md`를 기준으로 관리한다.

---

## 6. 운영/배포

- 프론트엔드는 Vercel에 배포한다.
- GitHub Actions로 PR 품질 검증과 E2E를 자동화한다.
- E2E는 브랜치 기준으로 실행 범위를 조정한다.
  - `dev` 대상 PR: Chromium/모바일 중심
  - `main` 대상 PR: WebKit까지 확장 실행

---

## 7. 기술 선택 트레이드오프

### 7.1 TanStack Query + Zustand 분리

- 장점: 서버 상태와 UI 상태의 책임이 분리되어 캐시 정책/화면 상태 추적이 명확하다.
- 단점: 초기에 어떤 상태를 어디에 둘지 설계 비용이 든다.

### 7.2 anon 서비스 분리

- 장점: SSR prefetch와 공개 조회 API를 인증 흐름과 독립적으로 다루기 쉽다.
- 단점: 서비스 파일 수가 늘어나 구조를 모르면 진입 장벽이 생길 수 있다.

### 7.3 Storybook + Chromatic

- 장점: 시각 회귀를 PR 단계에서 빠르게 감지할 수 있다.
- 단점: 스토리/스냅샷 유지 보수 비용이 발생한다.

---

## 8. 업데이트 규칙

- 기술 선택 이유나 구조가 바뀌면 이 문서를 먼저 갱신한다.
- 새 도구를 도입할 때는 아래 3가지를 함께 기록한다.
  - 도입 이유
  - 대안 대비 차이
  - 실제 적용 범위와 운영 비용
