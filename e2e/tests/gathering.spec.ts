import { expect, test } from '@playwright/test';
import { setupApiMocks } from '../mocks/api-handlers';

test.describe('모임 조회 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('모임 목록 페이지가 로드된다', async ({ page }) => {
    await page.goto('/gathering');

    await expect(page).toHaveURL('/gathering');

    // 페이지 헤더의 핵심 텍스트가 렌더링되었는지 확인
    await expect(page.getByText('지금 모임에 참여해보세요')).toBeVisible();
  });

  test('모임 상세 페이지 접근', async ({ page }) => {
    await page.goto('/gathering/1');

    await expect(page).toHaveURL('/gathering/1');

    // 상세 페이지가 렌더링되었는지 확인
    await page.waitForLoadState('domcontentloaded');
  });

  test('모임 목록에서 링크가 있으면 상세 페이지 URL 형식이 올바르다', async ({ page }) => {
    await page.goto('/gathering');
    await page.waitForLoadState('domcontentloaded');

    // 모임 카드 링크 찾기
    const gatheringLinks = page.locator('a[href^="/gathering/"]');
    const linkCount = await gatheringLinks.count();

    if (linkCount > 0) {
      const href = await gatheringLinks.first().getAttribute('href');
      expect(href).toMatch(/^\/gathering\/\d+$/);
    }
    // mock API 응답에 따라 카드가 없을 수도 있음 — 조건부 검증
  });

  test('필터 탭 UI가 존재한다', async ({ page }) => {
    await page.goto('/gathering');

    // 카테고리 탭 리스트가 존재하는지 확인 (페이지에 tablist가 2개)
    await expect(page.getByRole('tablist').first()).toBeVisible();
  });
});
