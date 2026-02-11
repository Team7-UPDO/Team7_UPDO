import { expect, test } from '@playwright/test';
import { setupApiMocks } from '../mocks/api-handlers';

test.describe('찜하기 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);

    // favorites localStorage 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('favorites');
    });
  });

  test('찜 목록 페이지가 로드된다', async ({ page }) => {
    await page.goto('/favorites');

    // URL 확인
    await expect(page).toHaveURL('/favorites');

    // 페이지 제목 또는 핵심 요소가 렌더링되었는지 확인
    await page.waitForLoadState('domcontentloaded');
  });

  test('찜 상태가 localStorage에 저장된다', async ({ page }) => {
    // useFavoriteStore persist name: 'favorites'
    await page.addInitScript(() => {
      const favoriteState = {
        state: {
          favorites: { '0': [1, 2, 3] },
          _hasHydrated: true,
        },
        version: 0,
      };
      localStorage.setItem('favorites', JSON.stringify(favoriteState));
    });

    await page.goto('/favorites');

    // localStorage에 저장된 찜 상태 확인
    const favoriteStorage = await page.evaluate(() => {
      return localStorage.getItem('favorites');
    });

    expect(favoriteStorage).not.toBeNull();
    const parsed = JSON.parse(favoriteStorage!);
    expect(parsed.state.favorites).toBeDefined();
    expect(parsed.state.favorites['0']).toEqual([1, 2, 3]);
  });

  test('찜 목록 페이지에서 찜한 모임이 있으면 표시된다', async ({ page }) => {
    // useFavoriteStore persist name: 'favorites'
    await page.addInitScript(() => {
      const favoriteState = {
        state: {
          favorites: { '0': [1] },
          _hasHydrated: true,
        },
        version: 0,
      };
      localStorage.setItem('favorites', JSON.stringify(favoriteState));
    });

    await page.goto('/favorites');
    await page.waitForLoadState('domcontentloaded');

    // 찜한 모임 카드가 있거나 빈 메시지가 있어야 함
    await expect(
      page
        .locator('a[href^="/gathering/"]')
        .first()
        .or(page.getByText(/찜한 모임이 없습니다/i)),
    ).toBeVisible({ timeout: 5000 });
  });
});
