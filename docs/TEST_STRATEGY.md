# 테스트 전략 문서

> UPDO 프로젝트의 프론트엔드 테스트 전략과 설계 근거를 정리한 문서

---

## 1. 전략 개요

### 1.1 목표

테스트의 목적은 커버리지 수치 달성이 아니라 **리팩토링과 기능 추가 시 기존 동작이 깨지지 않는다는 확신**을 확보하는 것이다.

### 1.2 Frontend Test Trophy 채택

전통적인 Test Pyramid(Unit > Integration > E2E)가 아닌 **Test Trophy** 전략을 따른다.

```
        ╭───────╮
        │  E2E  │          ← 핵심 플로우만 최소 유지 (17개)
      ╭─┴───────┴─╮
      │Integration │        ← 최우선: 렌더 + 사용자 상호작용 (81개)
    ╭─┴────────────┴─╮
    │   Unit Tests   │      ← 순수 함수 / 복잡한 조건 로직 (57개)
    ╰────────────────╯
    ╭────────────────╮
    │  Static Types  │      ← TypeScript strict mode
    ╰────────────────╯
```

**선택 근거**: 프론트엔드에서 버그의 대부분은 컴포넌트 간 상호작용, 상태 변화, 조건부 렌더링에서 발생한다. 단위 테스트만으로는 이를 잡지 못하고, E2E만으로는 피드백 루프가 느리다. Integration 테스트가 비용 대비 회귀 방지 효과가 가장 높다.

---

## 2. 테스트 아키텍처

### 2.1 계층 구조

| 계층 | 도구 | 테스트 수 | 역할 |
| --- | --- | --- | --- |
| Unit | Jest | 57개 | 순수 함수, 복잡한 상태 로직 검증 |
| Integration | Jest + Testing Library | 81개 | 컴포넌트 렌더 + 사용자 상호작용 검증 |
| E2E | Playwright | 17개 (× 3 브라우저) | 핵심 사용자 플로우 검증 |
| Static | TypeScript (strict) | - | 타입 안전성 보장 |

### 2.2 파일 구조

```
src/__tests__/
├── setup/
│   └── renderWithProviders.tsx    # 테스트용 Provider 래퍼
├── factories/
│   ├── gathering.ts               # 모임 테스트 데이터 팩토리
│   └── review.ts                  # 리뷰 테스트 데이터 팩토리
├── FavoriteButton.test.tsx        # Integration
├── Gathering.test.tsx             # Integration
├── GroupFilters.test.tsx          # Integration
├── LoginForm.test.tsx             # Integration
├── Mypage.test.tsx                # Integration
├── SignupForm.test.tsx            # Integration
├── WriteReviewModal.test.tsx      # Integration
├── date.test.ts                   # Unit
├── filters.test.ts                # Unit
├── gatheringState.test.ts         # Unit
├── mapping.test.ts                # Unit
├── useAuthStore.test.ts           # Store
└── useFavoriteStore.test.ts       # Store

e2e/
├── tests/
│   ├── auth.spec.ts               # 인증 플로우
│   ├── favorite.spec.ts           # 찜 기능
│   ├── gathering.spec.ts          # 모임 탐색
│   ├── mypage.spec.ts             # 마이페이지
│   └── review.spec.ts             # 리뷰 작성
├── fixtures/
│   └── auth.fixture.ts            # 인증 상태 픽스처
└── mocks/
    └── api-handlers.ts            # API 목 핸들러
```

---

## 3. 도구 선택 근거

### 3.1 Jest + Testing Library

| 기준 | Jest + Testing Library | Vitest + Testing Library |
| --- | --- | --- |
| Next.js 호환성 | 공식 지원 (next/jest) | 별도 설정 필요 |
| 생태계 성숙도 | 풍부한 레퍼런스 | 상대적으로 적음 |
| 실행 속도 | 충분 (138개 < 10초) | 더 빠르지만 체감 차이 미미 |

현재 테스트 규모(138개)에서는 Vitest의 속도 이점이 크지 않고, Next.js의 공식 Jest 지원을 활용하는 것이 안정적이라 판단했다.

### 3.2 Playwright (E2E)

| 기준 | Playwright | Cypress |
| --- | --- | --- |
| 크로스 브라우저 | Chromium, WebKit, Firefox 네이티브 | Chromium 중심 (WebKit 실험적) |
| 병렬 실행 | 기본 지원 | 유료 플랜 필요 |
| 모바일 에뮬레이션 | 디바이스 프로파일 기본 제공 | 뷰포트 리사이즈만 가능 |
| CI 실행 속도 | headless 기본, 빠름 | 상대적으로 느림 |

크로스 브라우저 + 모바일 반응형 테스트가 필요했기 때문에 Playwright를 선택했다.

### 3.3 Mock 전략: jest.mock vs MSW

| 계층 | 전략 | 이유 |
| --- | --- | --- |
| Jest (Unit/Integration) | `jest.mock()` | 서비스 함수 단위로 목킹. HTTP 레이어까지 통과할 필요 없음 |
| Playwright (E2E) | `page.route()` | 브라우저 네트워크 레벨 인터셉션. 실제 앱 동작과 동일한 환경 |

MSW는 도입하지 않았다. Jest에서는 서비스 함수를 직접 목킹하면 충분하고, E2E에서는 Playwright의 route 인터셉션이 MSW와 동일한 역할을 하기 때문이다. 도구를 하나 더 추가하는 복잡성 대비 이점이 없었다.

---

## 4. 테스트 범위 정책

### 4.1 반드시 테스트하는 것

- 사용자 인터랙션이 있는 Client Component (폼, 버튼, 탭, 모달)
- 조건 분기 UI (로그인 상태별, 에러 상태별 렌더링)
- 입력 → 결과 변화 흐름 (폼 제출, 필터 적용)
- 복잡한 비즈니스 로직 (모임 상태 판단, 날짜 포맷팅)
- 핵심 사용자 플로우 (인증, 모임 탐색, 리뷰 작성)

### 4.2 테스트하지 않는 것

- Tailwind CSS 클래스 존재 여부
- 단순 정적 마크업 (헤더, 푸터 텍스트)
- 외부 라이브러리 내부 동작 (framer-motion 애니메이션)
- Next.js 프레임워크 자체 기능 (라우팅, SSR)
- Server Component 직접 테스트

### 4.3 쿼리 우선순위

Testing Library 쿼리는 접근성 기반으로 사용한다:

1. `getByRole` — 버튼, 링크, 탭 등 의미론적 역할
2. `getByLabelText` — 폼 필드
3. `getByText` — 표시 텍스트 확인
4. `data-testid` — 위 방법으로 특정 불가능할 때만 (최후 수단)

---

## 5. Mock 아키텍처

### 5.1 컴포넌트 Mock

외부 의존성은 테스트 환경에서 단순화한다:

| 모듈 | Mock 방식 |
| --- | --- |
| `framer-motion` | 애니메이션 속성 제거, 일반 HTML 렌더링 |
| `next/navigation` | `useRouter`, `useParams`, `useSearchParams` 목 함수 제공 |
| `next/image` | `<img>` 태그로 대체 |
| `next/link` | `<a>` 태그로 대체 |
| `react-intersection-observer` | `{ ref, inView: false }` 고정 반환 |

### 5.2 API Mock

**Jest**: 서비스 함수를 `jest.fn()`으로 대체하여 반환값 제어

```typescript
jest.mock('@/services/gatheringService');
const mockGetList = getGatheringInfiniteList as jest.Mock;
mockGetList.mockResolvedValue({ data: mockGatherings, hasNext: false });
```

**Playwright**: `page.route()`로 네트워크 요청 인터셉션

```typescript
await page.route('**/api/gatherings?*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockGatherings),
  });
});
```

### 5.3 Factory 패턴

테스트 데이터 생성을 팩토리 함수로 표준화하여 중복을 제거한다:

```typescript
// factories/gathering.ts
export const createGathering = (overrides?: Partial<Gathering>): Gathering => ({
  id: 1,
  type: 'OFFICE_STRETCHING',
  name: '테스트 모임',
  location: 'HONGDAE',
  participantCount: 5,
  capacity: 20,
  ...overrides,
});
```

### 5.4 E2E 인증 상태

Playwright의 `addInitScript`로 브라우저 localStorage에 토큰을 주입한다:

```typescript
export async function setupAuthenticatedState(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('access_token', 'mock-jwt-token');
    localStorage.setItem('token_expiry', String(Date.now() + 3600000));
  });
}
```

이를 Playwright Fixture로 확장하여 `authenticatedPage`를 테스트 전체에서 재사용한다.

---

## 6. CI 파이프라인 설계

### 6.1 전체 흐름

```
PR 생성/업데이트
    │
    ├── PR Quality Checks (pr-checks.yml)
    │     ├── ESLint
    │     ├── TypeScript (tsc --noEmit)
    │     ├── Jest 테스트 (138개)
    │     ├── Storybook 빌드
    │     ├── Next.js 프로덕션 빌드
    │     └── Chromatic 시각적 회귀 검사
    │
    └── E2E Tests (e2e.yml)
          ├── Playwright 브라우저 설치
          ├── Next.js 프로덕션 빌드
          └── E2E 테스트 실행 (브랜치별 차등)
```

### 6.2 브랜치별 차등 실행

| PR 대상 | 브라우저 | 테스트 수 | 실행 시간 |
| --- | --- | --- | --- |
| `dev` | Chromium + Mobile Chrome | 34개 | ~2분 |
| `main` | Chromium + WebKit + Mobile Chrome | 51개 | ~3분 |

**설계 근거**: dev 브랜치 PR은 빈번하게 생성되므로 빠른 피드백이 중요하다. main 브랜치 PR은 릴리스 직전이므로 WebKit까지 포함하여 크로스 브라우저 안정성을 검증한다.

### 6.3 CI 최적화

- **Concurrency Group**: 같은 브랜치의 이전 실행을 자동 취소하여 리소스 절약
- **pnpm 캐시**: `~/.pnpm-store` 캐싱으로 의존성 설치 시간 단축
- **CI 전용 설정**: 재시도 2회, 워커 4개, 실패 시에만 스크린샷/trace 저장
- **타임아웃**: 15분 제한으로 무한 대기 방지

---

## 7. 크로스 브라우저 전략

### 7.1 브라우저 매트릭스

| 브라우저 | 엔진 | 디바이스 | 선택 이유 |
| --- | --- | --- | --- |
| Chromium | Blink | Desktop Chrome | 시장 점유율 1위 (~65%) |
| WebKit | WebKit | Desktop Safari | macOS/iOS 사용자 대응 |
| Mobile Chrome | Blink | Pixel 5 (393×851) | 모바일 반응형 레이아웃 검증 |

### 7.2 Firefox 제외 근거

- 현재 Blink(Chromium) + WebKit 조합으로 엔진 다양성 확보
- Firefox 시장 점유율이 약 3%로 낮음
- 추가 시 CI 시간 ~30% 증가 대비 발견 가능한 버그가 제한적
- CSS/JS 호환성 이슈는 대부분 WebKit에서 먼저 발견됨

### 7.3 모바일 테스트

Pixel 5 디바이스 프로파일(393×851, deviceScaleFactor: 2.75)을 사용하여 모바일 뷰포트에서의 레이아웃, 터치 이벤트, 반응형 동작을 검증한다. 별도의 모바일 전용 테스트가 아니라 동일한 E2E 시나리오를 모바일 환경에서 실행하는 방식이다.

---

## 8. 품질 원칙

### 8.1 결정론적 테스트만 허용

모든 테스트는 동일한 입력에 대해 항상 동일한 결과를 반환해야 한다.

**금지 항목**:

- `Date.now()` 직접 사용 → `jest.useFakeTimers()` + `jest.setSystemTime()` 사용
- `Math.random()` 의존 → 고정값 사용
- 실제 네트워크 요청 → Mock으로 대체
- `setTimeout` 의존 어서션 → `waitFor` / `findBy` 사용

### 8.2 Flaky 테스트 정책

Flaky 테스트(비결정적으로 성공/실패하는 테스트)는 **즉시 수정하거나 삭제**한다. Flaky 테스트가 존재하면 테스트 스위트 전체에 대한 신뢰가 무너지고, 실패 알림을 무시하는 습관이 생긴다.

### 8.3 Behavior-Driven 검증

테스트는 **구현이 아닌 사용자 행동**을 검증한다.

| 잘못된 예 | 올바른 예 |
| --- | --- |
| `expect(setState).toHaveBeenCalled()` | `expect(screen.getByText('결과')).toBeVisible()` |
| `expect(component.state.count).toBe(1)` | `expect(screen.getByRole('button')).toHaveTextContent('1')` |
| `expect(div.className).toContain('active')` | `expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true')` |

이 원칙 덕분에 내부 리팩토링(상태 관리 변경, CSS 구조 변경 등)을 해도 테스트가 깨지지 않는다.

### 8.4 커버리지 정책

커버리지는 KPI가 아닌 **참고 지표**로 활용한다. PR 리뷰 시 변경 파일의 테스트 존재 여부를 확인하며, 전역 커버리지 게이트는 의도적으로 배제했다.

**배제 근거**:

- 커버리지 임계값 강제 시 수치 달성 목적의 의미 없는 테스트가 생긴다
- 커버리지 100%라도 엣지 케이스를 놓칠 수 있어 수치가 품질을 보장하지 않는다
- 대신 **"핵심 사용자 플로우에 회귀 방지 테스트가 존재하는가"**를 기준으로 판단한다

로컬에서 필요 시 확인:

```bash
pnpm test:coverage  
```

---

## 9. 현황 요약

### 9.1 Integration 테스트 (81개)

| 파일 | 테스트 수 | 테스트 대상 |
| --- | --- | --- |
| LoginForm.test.tsx | 11 | 폼 검증, 5회 잠금, 서버 에러, 라우팅 |
| Mypage.test.tsx | 11 | 탭 전환, 스켈레톤, 인증 가드 |
| Gathering.test.tsx | 9 | 목록 렌더링, 탭 전환, 캐싱, 빈 상태 |
| WriteReviewModal.test.tsx | 9 | 모달 라이프사이클, 별점 + 댓글 검증 |
| SignupForm.test.tsx | 8 | 폼 검증, 비밀번호 일치, 자동 로그인 |
| GroupFilters.test.tsx | 7 | 드롭다운 필터, 캘린더 연동 |
| FavoriteButton.test.tsx | 6 | 찜 토글, 하이드레이션 |
| useAuthStore.test.ts | 13 | 인증 상태, 로그인 잠금, 토큰 만료 |
| useFavoriteStore.test.ts | 7 | 찜 토글, 다중 사용자, 게스트 모드 |

### 9.2 Unit 테스트 (57개)

| 파일 | 테스트 수 | 테스트 대상 |
| --- | --- | --- |
| gatheringState.test.ts | 40 | 모임 상태 판단 (버튼 상태, 완료, 잠금, 리뷰) |
| mapping.test.ts | 15 | UI 매핑 (필터, 태그, 지역, 정렬) |
| date.test.ts | 10 | 날짜 포맷팅 (마감, 종료 판단, ISO 변환) |
| filters.test.ts | 6 | 필터 정규화 및 정리 |

### 9.3 E2E 테스트 (17개 × 3 브라우저)

| 파일 | 테스트 수 | 사용자 플로우 |
| --- | --- | --- |
| auth.spec.ts | 4 | 회원가입 → 자동 로그인, 로그인, 비밀번호 검증 |
| gathering.spec.ts | 4 | 목록 페이지, 상세 이동, 링크 검증, 필터 UI |
| favorite.spec.ts | 3 | 찜 페이지, localStorage 영속성, 목록 표시 |
| mypage.spec.ts | 3 | 탭 전환, 인증 가드 리다이렉트 |
| review.spec.ts | 3 | 리뷰 페이지, 모달 열기, 폼 검증 |
