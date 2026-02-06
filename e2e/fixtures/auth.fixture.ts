import { test as base, Page } from '@playwright/test';
import { setupApiMocks, setupAuthenticatedState } from '../mocks/api-handlers';

/**
 * 인증된 페이지를 제공하는 커스텀 fixture
 */
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // API Mock 설정
    await setupApiMocks(page);

    // 인증 상태 설정 (localStorage)
    await setupAuthenticatedState(page);

    // 페이지 제공
    await use(page);
  },
});

export { expect } from '@playwright/test';
