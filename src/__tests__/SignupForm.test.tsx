// -----------------------------------------------------------------------------
// TEST: SignupForm.test.tsx
// TARGET: RHF+Zod 유효성 검증 + 회원가입 성공 시 자동 로그인/토큰 저장/토스트/라우팅
// -----------------------------------------------------------------------------

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/components/feature/auth/SignupForm';
import { authService } from '@/services/auths/authService';

const mockReplace = jest.fn();
const mockShowToast = jest.fn();
const mockSetToken = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
}));
jest.mock('@/components/ui/Toast', () => ({
  useToast: jest.fn(selector => selector({ showToast: mockShowToast })),
}));
jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(selector => selector({ setToken: mockSetToken })),
}));
jest.mock('@/services/auths/authService', () => ({
  authService: {
    signup: jest.fn(),
    signin: jest.fn(),
  },
}));

describe('🧩 SignupForm — 폼 유효성 검증', () => {
  afterEach(() => jest.clearAllMocks());

  test('모든 필드를 비운 채 제출하면 에러 메시지가 표시된다', async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() =>
      expect(screen.getAllByText(/입력해주세요|입력 가능합니다|이상 입력/i).length).toBeGreaterThan(
        0,
      ),
    );
  });

  test('비밀번호와 비밀번호 확인이 일치하지 않으면 에러 메시지가 표시된다', async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'abcd9999' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() =>
      expect(screen.getByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument(),
    );
  });

  test('비밀번호에 동일 문자가 3번 이상 연속되면 에러 메시지가 표시된다', async () => {
    render(<SignupForm />);

    // 동일 문자가 3번 이상 포함된 비밀번호 입력
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('직업'), { target: { value: '테스트회사' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'repeat@example.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'aaabbb1234' } });
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'aaabbb1234' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    // Zod 스키마의 오류 메시지 문구에 맞게 검증
    await waitFor(() => {
      expect(screen.getByText(/같은 문자가 3회 이상 반복될 수 없습니다./i)).toBeInTheDocument();
    });
  });
});

describe('🧩 SignupForm — 서버/라우팅 시나리오', () => {
  afterEach(() => jest.clearAllMocks());

  test('회원가입 성공 시 자동 로그인, 토큰 저장, 토스트 표시, 홈 이동', async () => {
    (authService.signup as jest.Mock).mockResolvedValueOnce({ message: 'ok' });
    (authService.signin as jest.Mock).mockResolvedValueOnce({ token: 'mocked-jwt' });

    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('직업'), { target: { value: '달램컴퍼니' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'signup@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith({
        email: 'signup@test.com',
        password: 'abcd1234',
        name: '홍길동',
        companyName: '달램컴퍼니',
      });
      expect(authService.signin).toHaveBeenCalledWith({
        email: 'signup@test.com',
        password: 'abcd1234',
      });
      expect(mockSetToken).toHaveBeenCalledWith('mocked-jwt');
      expect(mockShowToast).toHaveBeenCalledWith(
        'UPDO의 회원이 되신 것을 환영합니다! 자동으로 로그인 되었습니다.',
        'success',
      );
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  test('이메일이 중복되면 해당 필드에 에러 메시지가 표시된다', async () => {
    (authService.signup as jest.Mock).mockRejectedValueOnce({
      parameter: 'email',
      message: '이미 사용 중인 이메일입니다.',
    });

    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('직업'), { target: { value: '테스트' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'dup@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() =>
      expect(screen.getByText('이미 사용 중인 이메일입니다.')).toBeInTheDocument(),
    );
  });

  test('서버 오류 발생 시 필드나 전역 에러 메시지가 표시된다', async () => {
    (authService.signup as jest.Mock).mockRejectedValueOnce({
      message: '서버 오류가 발생했습니다.',
    });

    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText('이름'), { target: { value: '홍길동' } });
    fireEvent.change(screen.getByLabelText('직업'), { target: { value: '달램' } });
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'error@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText('비밀번호 확인'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() =>
      expect(
        screen.getByText(/회원가입에 실패했습니다|서버 오류가 발생했습니다/i),
      ).toBeInTheDocument(),
    );
  });
});
