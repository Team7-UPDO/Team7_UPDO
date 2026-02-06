# 🪶 UPDO (업두)

> ‘UPDO’는 ‘자기계발’ 모임을 관리하고 확장할 수 있는 **모임 플랫폼**입니다.
> 
> 
> 사용자는 직접 모임을 개설하거나 참여하고, 리뷰를 통해 경험을 공유할 수 있습니다.


## 🗂️ 목차

1. [프로젝트 개요]()


---

## 🧭 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | **UPDO (업두)** |
| 주제 | 실시간 오프라인 모임 관리 플랫폼 |
| 기간 | 2025.09 ~ 2025.11 |
| 참여 인원 | Frontend 4명 |
| 배포 | [https://updo.site](https://updo.site/) |
| Backend | [fe-adv-project-together-dallaem.vercel.app](https://fe-adv-project-together-dallaem.vercel.app/) |
| 노션 | [링크](https://ablaze-stage-db7.notion.site/7-UP-DO-26bcf2d3796180afb7c3eb754591ac35?source=copy_link) |

---

## 🧑‍💻 팀 구성

| 이름 | 주요 담당 | 깃허브 |
| --- | --- | --- |
| 김채원 | 팀장 | [링크]() |
| 김선기 |  | [링크]() |
| 서민수 |  | [링크]() |
| 홍성현 |  | [링크]() |

---

## 🌟 주요 기능

| 구분 | 기능 설명 |
| --- | --- |
| 🧑‍🤝‍🧑 모임 기능 | 모임 생성, 수정, 삭제, 참가 및 취소 |
| 🔍 모임 탐색 | 검색, 필터, 정렬 기능을 통한 모임 탐색 |
| ❤️ 찜 기능 | 관심 모임 찜/취소 및 찜한 모임 목록 조회 |
| 🗓️ 마이페이지 | 내가 만든 모임, 참여 중인 모임, 작성한 리뷰 통합 관리 |
| 📝 리뷰 시스템 | 모임 종료 후 후기 작성 및 전체 리뷰 열람 |
| 🧾 인증 | CSR Token 기반 로그인 / 회원가입 / 토큰 만료 처리 |
| 💬 실시간 반응형 UI | 반응형 레이아웃 및 모션 기반 UX 제공 |


---

## 🧰 기술 스택

| Category | Tech |
| --- | --- |
| **Framework** | Next.js 15 (App Router / Turbopack) |
| **Language** | TypeScript |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query |
| **Style** | Tailwind CSS / CVA / Custom Tokens |
| **Animation** | Framer Motion (LazyMotion 기반) |
| **Testing** | Jest / React Testing Library / Playwright |
| **Testing (Design)** | Storybook / Chromatic |
| **Lint & Format** | ESLint / Prettier / Husky / Lint-Staged |
| **Version Control** | Git / GitHub Flow |
| **CI/CD** | Vercel / GitHub Actions (PR Checks · E2E · Chromatic) |


---

## 📂 폴더 구조

📁 src/

```markdown
UPDO
├ src/
|    ├─ app/
|    |    ├─ global.css
|    |    ├─ layout.tsx
|    |    ├─ page.tsx
|    |    ├─ gathering/
|    |    ├─ login/
|    |    ├─ reviews/
|    |    └─ mypage/
|    ├─ assets/        # image, fonts 관리 폴더
|    ├─ components/    # ui 컴포넌트, auth 컴포넌트 등의 공통 컴포넌트
|    |    ├─ features/
|    |    |   ├─ auth/
|    |    |   ├─ favorites/
|    |    |   └─ ...도메인 컴포넌트..
|    |    ├─ layout/
|    |    ├─ providers/
|    |    └─ ui/
|    |        ├─ test/
|    |        ├─ stories/
|    |        ├─ Button.tsx
|    |        ├─ Badge.tsx
|    |        └─ ...공통 컴포넌트..
|    ├─ constants/     # form, div등에 기본으로 넣어야 할 value 저장
|    ├─ hooks/         # 커스텀 훅
|    ├─ lib/           # twMerge, clsx 사용 utils.ts 파일
|    ├─ schemas/       # zod를 사용한 validation 파일
|    ├─ services/      # fetch를 사용한 API 파일
|    ├─ stores/        # zustand를 사용한 저장소 파일
|    ├─ types/         # 타입 지정
|    └─ utils/         # 보조 함수, 보조 UI
├─ e2e/
|    ├─ tests/          # Playwright E2E 테스트
|    ├─ fixtures/       # 인증 상태 등 테스트 픽스처
|    └─ mocks/          # API Mock 핸들러
├─ docs/                # 테스트 전략 등 프로젝트 문서
├─ public/
├─ .github/
├─ .storybook/
├─ .husky/
├─ .gitignore
├─ next.config.js
├─ package.json
└─ README.md
```

---

## 🔧 기술 사용
[기술 사용 README]()

---

## 🧪 리팩토링

### 🧩 구조적 개선

- **Atomic** 아키텍처 적용 → 컴포넌트 의존성 명확화, 재사용성 향상
- **Design System** 기반으로 공통 UI 컴포넌트 체계 구축
- **CVA(Class Variance Authority)**로 Variants 기반 토큰 시스템 구성 (color, typography, spacing 등)

### ⚡ 성능 최적화

- **Lighthouse 기반 성능 분석**을 통해 메인 페이지 렌더링 속도 **1.9ms → 1.3ms (-0.6ms)** 개선
- **Framer Motion**을 **LazyMotion + m import** 형태로 최적화하여 번들 크기 감소
- 웹 접근성을 위해 **ARIA 속성**과 **semantic HTML 구조** 준수
- 메타 데이터 및 사이트맵 구성을 통해 검색 엔진 인덱싱 최적화  
- 이미지 최적화, 코드 스플리팅, React.memo를 활용해 LCP 점수 개선

### 🧠 테스트 전략

> 상세 설계 근거와 도구 선택 이유는 [테스트 전략 문서](docs/TEST_STRATEGY.md) 참고

**Frontend Test Trophy** 전략을 채택하여 Integration 테스트 중심으로 회귀 방지 체계를 구축했다.

- **Jest + React Testing Library** (138개)
    - 사용자 행동 중심 Integration 테스트: 폼 검증, 탭 전환, 모달, 찜 토글
    - 순수 함수 Unit 테스트: 날짜 포맷팅, 필터 정규화, 모임 상태 판단 로직
    - Factory 패턴으로 테스트 데이터 표준화
- **Playwright E2E** (17개 × 3 브라우저)
    - 핵심 사용자 플로우 검증: 인증, 모임 탐색, 찜, 마이페이지, 리뷰 작성
    - 크로스 브라우저: Chromium · WebKit · Mobile Chrome (Pixel 5)
    - CI에서 브랜치별 차등 실행 (dev: Chromium만, main: +WebKit)

### 🪄 Storybook 도입

- **UI 단위 테스트 환경 구성**
- **Chromatic CI 연동**을 통해 PR 시 자동 시각 리뷰 플로우 구축
- 디자이너 없이도 Storybook에서 즉시 UI 확인 가능



---

## 🤝 협업 환경

| 항목 | 내용 |
| --- | --- |
| **Git 전략** | Gitflow 기반 (`dev` 중심, `Feature/#번호-설명` 브랜치 네이밍) |
| **코드 리뷰** | PR Template / Reviewer 지정 / Label 관리 |
| **CI/CD** | Vercel 자동 배포 / GitHub Actions (PR Checks · E2E · Chromatic) |
| **Issue 관리** | GitHub Projects + Issue Template로 업무 트래킹 |
| **커밋 규칙** | Conventional Commits / Commitlint로 일관성 유지 |

---

## 🐞 트러블슈팅 사례

| 문제 상황 | 해결 방법 |
| --- | --- |
| **Storybook 무한 로딩 / Provider 누락** | Decorator로 `QueryClientProvider` 및 `Zustand` store 주입 |
| **Token 만료 후 캐시 유지 문제** | Zustand에서 Token 상태 관리 + Query 캐시 초기화 로직 추가 |
| **Framer Motion 번들 크기 과다** | LazyMotion + 경량화된 `m` import 구조로 개선 |
| **LCP 점수 저하** | 이미지 lazy load, motion 경량화, 코드 스플리팅 적용 |

---

## ✨ 성과 및 회고

- **개발 프로세스 전반을 경험**하며 설계 → 구현 → 테스트 → 배포를 일원화
- 성능 개선과 디자인 시스템의 일관성을 통해 ‘사용자 중심의 개발’**을** 실현
- GitHub 이슈/PR 자동화, Chromatic 리뷰 등 협업 효율화 경험
- Lighthouse와 Jest로 **데이터 흐름 검증 기반의 안정성 확보**

