import { expect, test } from '@playwright/test';
import { setupApiMocks } from '../mocks/api-handlers';

test.describe('인증 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('회원가입 → 자동 로그인 → 홈 리다이렉트', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL('/signup');

    // 회원가입 폼 작성 (label 기반 접근)
    await page.getByLabel('이름').fill('테스트유저');
    await page.getByLabel('직업').fill('테스트회사');
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호', { exact: true }).fill('Password123!');
    await page.getByLabel('비밀번호 확인').fill('Password123!');

    // 회원가입 제출
    await page.getByRole('button', { name: '회원가입' }).click();

    // 회원가입 성공 → 자동 로그인 → 홈으로 리다이렉트
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('로그인 → 홈 리다이렉트', async ({ page }) => {
    await page.goto('/login');

    // 로그인 폼 작성
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호').fill('Password123!');

    // 로그인 제출
    await page.getByRole('button', { name: '로그인' }).click();

    // 홈페이지로 리다이렉트 확인
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('로그인 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await page.goto('/login');

    // 로그인 페이지 요소 확인 (label + role 기반)
    await expect(page.getByLabel('이메일')).toBeVisible();
    await expect(page.getByLabel('비밀번호')).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
  });

  test('회원가입 페이지에서 비밀번호 확인이 일치하지 않으면 에러 표시', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel('이름').fill('테스트유저');
    await page.getByLabel('직업').fill('테스트회사');
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호', { exact: true }).fill('Password123!');
    await page.getByLabel('비밀번호 확인').fill('DifferentPassword1!');

    // blur로 검증 트리거
    await page.getByLabel('이름').click();

    // 비밀번호 불일치 에러 메시지 확인 (Zod 스키마: '비밀번호가 일치하지 않습니다.')
    await expect(page.getByText('비밀번호가 일치하지 않습니다.')).toBeVisible({ timeout: 3000 });
  });
});
