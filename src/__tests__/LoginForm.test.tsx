// -----------------------------------------------------------------------------
// TEST: LoginForm.test.tsx
// TARGET: RHF + Zod 검증, Debounce, 서버 통신(Mock), Toast 및 Router 동작 검증
// -----------------------------------------------------------------------------

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/feature/auth/LoginForm';
import { authService } from '@/services/auths/authService';

// ✅ Mock 정의
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
    signin: jest.fn(),
  },
}));

describe('🧩 LoginForm — 폼 유효성 검증', () => {
  afterEach(() => jest.clearAllMocks());

  test('이메일과 비밀번호를 비운 채 제출하면 에러 메시지가 표시된다', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() =>
      expect(screen.getAllByText(/입력해주세요|입력 가능합니다|이상 입력/i).length).toBeGreaterThan(
        0,
      ),
    );
  });

  test('잘못된 이메일 형식이면 에러 메시지가 표시된다', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'wrongemail' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => expect(screen.getByText(/유효한 이메일 주소를 입력/i)).toBeInTheDocument());
  });

  test('비밀번호에 동일 문자가 3번 이상 연속되면 에러 메시지가 표시된다', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'repeat@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'aaabbb1234' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() =>
      expect(screen.getByText(/같은 문자가 3회 이상 반복될 수 없습니다\./i)).toBeInTheDocument(),
    );
  });
});

describe('🧩 LoginForm — 서버 및 라우팅 시나리오', () => {
  afterEach(() => jest.clearAllMocks());

  test('로그인 성공 시 토큰 저장, 토스트 표시, 홈(/)으로 이동한다', async () => {
    (authService.signin as jest.Mock).mockResolvedValueOnce({ token: 'mocked-jwt' });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'success@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(authService.signin).toHaveBeenCalledWith({
        email: 'success@test.com',
        password: 'abcd1234',
      });
      expect(mockSetToken).toHaveBeenCalledWith('mocked-jwt');
      expect(mockShowToast).toHaveBeenCalledWith('로그인에 성공하였습니다. 환영합니다!', 'success');
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  test('존재하지 않는 이메일이면 해당 필드 하단에 에러 메시지를 표시한다', async () => {
    (authService.signin as jest.Mock).mockRejectedValueOnce({
      parameter: 'email',
      message: '존재하지 않는 이메일입니다.',
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'notfound@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() =>
      expect(screen.getByText('존재하지 않는 이메일입니다.')).toBeInTheDocument(),
    );
  });

  test('비밀번호 오류 시 해당 필드 하단에 에러 메시지를 표시한다', async () => {
    (authService.signin as jest.Mock).mockRejectedValueOnce({
      parameter: 'password',
      message: '비밀번호가 일치하지 않습니다.',
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'wrongpw12' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() =>
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument(),
    );
  });

  test('서버 오류 발생 시 전역 에러 메시지가 표시된다', async () => {
    (authService.signin as jest.Mock).mockRejectedValueOnce({
      message: '서버 오류가 발생했습니다.',
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'error@test.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'abcd1234' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText(/서버 오류가 발생했습니다/i)).toBeInTheDocument();

    expect(mockShowToast).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test.skip('비밀번호를 3회 연속 잘못 입력하면 계정이 잠기고 전역 에러 메시지가 표시된다', async () => {
    (authService.signin as jest.Mock)
      .mockRejectedValueOnce({ parameter: 'password', message: '비밀번호가 일치하지 않습니다.' })
      .mockRejectedValueOnce({ parameter: 'password', message: '비밀번호가 일치하지 않습니다.' })
      .mockRejectedValueOnce({
        message: '로그인 시도 횟수가 초과되었습니다. 계정이 잠겼습니다.',
      });

    render(<LoginForm />);

    const submit = async (pw: string) => {
      fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'lock@test.com' } });
      fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: pw } });
      fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    };

    await submit('wrong1');
    await waitFor(() => screen.getByText('비밀번호가 일치하지 않습니다.'));
    await submit('wrong2');
    await waitFor(() => screen.getByText('비밀번호가 일치하지 않습니다.'));
    await submit('wrong3');

    await waitFor(() =>
      expect(
        screen.getByText(/로그인 시도 횟수가 초과되었습니다\. 계정이 잠겼습니다\./),
      ).toBeInTheDocument(),
    );

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockShowToast).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
