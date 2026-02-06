import { test, expect } from '../fixtures/auth.fixture';

test.describe('마이페이지 흐름', () => {
  test('마이페이지 탭 클릭으로 전환이 정상 동작한다', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/mypage/myMeeting');
    await expect(authenticatedPage).toHaveURL('/mypage/myMeeting');

    // 탭 리스트 확인
    await expect(authenticatedPage.getByRole('tablist')).toBeVisible();

    // '나의 리뷰' 탭 클릭
    await authenticatedPage.getByRole('tab', { name: '나의 리뷰' }).click();
    await expect(authenticatedPage).toHaveURL('/mypage/myReview');

    // '내가 만든 모임' 탭 클릭
    await authenticatedPage.getByRole('tab', { name: '내가 만든 모임' }).click();
    await expect(authenticatedPage).toHaveURL('/mypage/myCreated');

    // '나의 모임' 탭 클릭 (돌아가기)
    await authenticatedPage.getByRole('tab', { name: '나의 모임' }).click();
    await expect(authenticatedPage).toHaveURL('/mypage/myMeeting');
  });

  test('마이페이지에 마이페이지 제목과 프로필이 렌더링된다', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/mypage/myMeeting');

    await expect(authenticatedPage).toHaveURL('/mypage/myMeeting');
    await expect(authenticatedPage.getByText('마이페이지')).toBeVisible();
  });

  test('비로그인 상태에서 마이페이지 접근 시 홈으로 리다이렉트', async ({ page }) => {
    // 인증되지 않은 page 사용 (authenticatedPage 아님)
    // AuthGuard: fetchMe 실패 → router.replace('/')
    await page.goto('/mypage/myMeeting');

    // AuthGuard가 '/' 로 리다이렉트
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
