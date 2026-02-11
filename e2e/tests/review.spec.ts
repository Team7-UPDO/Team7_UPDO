import { test, expect } from '../fixtures/auth.fixture';

test.describe('리뷰 흐름', () => {
  test('리뷰 목록 페이지가 로드된다', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/reviews');

    await expect(authenticatedPage).toHaveURL('/reviews');
    await authenticatedPage.waitForLoadState('domcontentloaded');
  });

  test('마이페이지에서 리뷰 작성 버튼 클릭 시 모달이 열린다', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/mypage/myMeeting');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    // 리뷰 작성하기 버튼 (WriteReviewControl: '리뷰 작성하기')
    const reviewButton = authenticatedPage.getByRole('button', { name: /리뷰 작성하기/i });

    // mock API가 isCompleted: true, isReviewed: false인 모임을 반환하므로 버튼이 보여야 함
    await expect(reviewButton.first()).toBeVisible({ timeout: 10000 });
    await reviewButton.first().click();

    // 모달 헤더 확인 (WriteReviewModal: title="리뷰 쓰기")
    await expect(authenticatedPage.getByText('리뷰 쓰기')).toBeVisible({ timeout: 5000 });
  });

  test('리뷰 작성 시 별점과 코멘트가 모두 필요하다', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/mypage/myMeeting');
    await authenticatedPage.waitForLoadState('domcontentloaded');

    const reviewButton = authenticatedPage.getByRole('button', { name: /리뷰 작성하기/i });
    await expect(reviewButton.first()).toBeVisible({ timeout: 10000 });
    await reviewButton.first().click();

    // 모달 열림 확인
    await expect(authenticatedPage.getByText('리뷰 쓰기')).toBeVisible();

    // 등록 버튼이 초기에 비활성화되어 있는지 확인
    const submitButton = authenticatedPage.getByRole('button', { name: /^등록$/i });
    await expect(submitButton).toBeDisabled();

    // 별점 선택 (ReviewScore: aria-label="4점 평가")
    await authenticatedPage.getByRole('radio', { name: '4점 평가' }).click();

    // 여전히 비활성화 (코멘트 필요)
    await expect(submitButton).toBeDisabled();

    // 코멘트 입력 (label: '경험에 대해 남겨주세요.')
    await authenticatedPage.getByLabel('경험에 대해 남겨주세요.').fill('좋은 모임이었습니다');

    // 이제 활성화
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
  });
});
