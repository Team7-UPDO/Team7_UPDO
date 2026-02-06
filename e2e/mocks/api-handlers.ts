import { Page, Route } from '@playwright/test';

const API_BASE = 'https://fe-adv-project-together-dallaem.vercel.app';

// Mock 사용자 데이터
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: '테스트유저',
  companyName: '테스트회사',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock 모임 데이터
export const mockGatherings = [
  {
    id: 1,
    type: 'MINDFULNESS',
    name: '성장 모임 테스트',
    dateTime: '2027-12-31T10:00:00Z',
    registrationEnd: '2027-12-30T23:59:59Z',
    location: '건대입구',
    participantCount: 5,
    capacity: 20,
    image: '/test-image.jpg',
    createdBy: 100,
    canceledAt: null,
  },
  {
    id: 2,
    type: 'WORKATION',
    name: '네트워킹 모임 테스트',
    dateTime: '2027-12-31T14:00:00Z',
    registrationEnd: '2027-12-30T23:59:59Z',
    location: '홍대입구',
    participantCount: 8,
    capacity: 15,
    image: '/test-image2.jpg',
    createdBy: 101,
    canceledAt: null,
  },
];

// Mock 리뷰 데이터
export const mockReviews = [
  {
    id: 1,
    score: 5,
    comment: '정말 좋은 모임이었습니다!',
    createdAt: '2024-06-01T10:00:00Z',
    Gathering: mockGatherings[0],
    User: { id: 1, name: '테스트유저', image: null },
  },
];

// Mock 참여한 모임 데이터
export const mockJoinedGatherings = [
  {
    ...mockGatherings[0],
    joinedAt: '2024-05-01T10:00:00Z',
    isCompleted: true,
    isReviewed: false,
  },
];

/**
 * 모든 API 요청을 Mock으로 처리하는 함수
 */
export async function setupApiMocks(page: Page) {
  // 인증 API Mock
  await page.route(`${API_BASE}/**/auths/signup`, async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'success' }),
      });
    }
  });

  await page.route(`${API_BASE}/**/auths/signin`, async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          user: mockUser,
        }),
      });
    }
  });

  await page.route(`${API_BASE}/**/auths/signout`, async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'success' }),
      });
    }
  });

  await page.route(`${API_BASE}/**/auths/user`, async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    }
  });

  // 모임 API Mock
  await page.route(`${API_BASE}/**/gatherings?*`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGatherings),
    });
  });

  await page.route(`${API_BASE}/**/gatherings/joined*`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockJoinedGatherings),
    });
  });

  await page.route(new RegExp(`${API_BASE}/.*/gatherings/\\d+$`), async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGatherings[0]),
    });
  });

  await page.route(
    new RegExp(`${API_BASE}/.*/gatherings/\\d+/participants`),
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            userId: 1,
            gatheringId: 1,
            joinedAt: '2024-05-01T10:00:00Z',
            User: {
              id: 1,
              email: 'user1@test.com',
              name: '참여자1',
              companyName: '회사1',
              image: null,
            },
          },
          {
            userId: 2,
            gatheringId: 1,
            joinedAt: '2024-05-02T10:00:00Z',
            User: {
              id: 2,
              email: 'user2@test.com',
              name: '참여자2',
              companyName: '회사2',
              image: null,
            },
          },
        ]),
      });
    },
  );

  // 리뷰 API Mock
  await page.route(`${API_BASE}/**/reviews?*`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockReviews),
    });
  });

  await page.route(`${API_BASE}/**/reviews/scores*`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        averageScore: 4.5,
        totalCount: 10,
        scoreDistribution: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 },
      }),
    });
  });

  await page.route(`${API_BASE}/**/reviews`, async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 999, ...JSON.parse(route.request().postData() || '{}') }),
      });
    }
  });
}

/**
 * 인증된 상태를 시뮬레이션하기 위한 localStorage 설정
 *
 * useAuthStore: 개별 키(access_token, token_expiry)로 직접 저장
 * useUserStore: localStorage 미사용 (fetchMe → API mock /auths/user 응답으로 설정)
 */
export async function setupAuthenticatedState(page: Page) {
  await page.addInitScript(() => {
    // useAuthStore는 localStorage.getItem('access_token') / ('token_expiry')로 읽음
    localStorage.setItem('access_token', 'mock-jwt-token');
    localStorage.setItem('token_expiry', String(Date.now() + 60 * 60 * 1000)); // 1시간 후 만료
  });
}
