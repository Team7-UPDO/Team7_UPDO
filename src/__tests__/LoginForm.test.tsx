// -----------------------------------------------------------------------------
// TEST: LoginForm.test.tsx
// TARGET: RHF + Zod 검증, Debounce, 서버 통신(Mock), Toast 및 Router 동작 검증
// -----------------------------------------------------------------------------

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/feature/auth/LoginForm';
import { authService } from '@/services/auths/authService';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
const mockShowToast = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
}));
jest.mock('@/components/ui/Toast', () => ({
  useToast: jest.fn(selector => selector({ showToast: mockShowToast })),
}));

// ✅ selector 패턴용 Zustand mock (실제 스토어 로직은 건드리지 않음)
let mockFailedAttempts = 0;
let mockIsLocked = false;

const mockIncreaseFailedAttempts = jest.fn(() => {
  mockFailedAttempts += 1;
  if (mockFailedAttempts >= 5) mockIsLocked = true; // 5번째 시도에서 잠금
});
const mockResetFailedAttempts = jest.fn(() => {
  mockFailedAttempts = 0;
  mockIsLocked = false;
});
const mockCheckLockStatus = jest.fn(() => mockIsLocked);
const mockSetToken = jest.fn();

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(selector =>
    selector({
      // ✅ getter로 현재 상태를 매번 반영
      get failedAttempts() {
        return mockFailedAttempts;
      },
      get isLocked() {
        return mockIsLocked;
      },

      // actions
      setToken: mockSetToken,
      increaseFailedAttempts: mockIncreaseFailedAttempts,
      resetFailedAttempts: mockResetFailedAttempts,
      checkLockStatus: mockCheckLockStatus,
    }),
  ),
}));

jest.mock('@/services/auths/authService', () => ({
  authService: {
    signin: jest.fn(),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
const submit = async (email: string, password: string) => {
  if (screen.queryByLabelText('이메일')) {
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: email } });
  }
  if (screen.queryByLabelText('비밀번호')) {
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: password } });
  }
  fireEvent.click(screen.getByRole('button', { name: '로그인' }));
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFailedAttempts = 0;
  mockIsLocked = false;
});

describe('🧩 LoginForm — 폼 유효성 검증', () => {
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

  test('비밀번호 오류 시 Toast로 실패 횟수(1~4/5)가 표시된다', async () => {
    // 모든 시도 실패(비밀번호 불일치)
    (authService.signin as jest.Mock).mockRejectedValue({
      parameter: 'password',
      message: '비밀번호가 일치하지 않습니다.',
    });

    render(<LoginForm />);

    // 1~4회 실패 시 각각 (i/5회) 토스트 확인
    for (let i = 1; i <= 4; i++) {
      await submit('user@test.com', `12wrongpass${i}`);
      await waitFor(() =>
        expect(mockShowToast).toHaveBeenLastCalledWith(
          expect.stringMatching(new RegExp(`\\(${i}/5회\\)`)),
          'error',
        ),
      );
    }
  });

  test('5회 연속 실패 시 즉시 "30초 잠금" 토스트가 표시된다', async () => {
    (authService.signin as jest.Mock).mockRejectedValue({
      parameter: 'password',
      message: '비밀번호가 일치하지 않습니다.',
    });

    render(<LoginForm />);

    // 먼저 4회 실패하여 누적을 4로 만든다
    for (let i = 1; i <= 4; i++) {
      await submit('lock@test.com', `12wrongpass${i}`);
      // 각 실패 토스트가 호출되므로 대기
      // (엄격히 확인하려면 위 테스트처럼 (i/5회) 패턴 검사 추가 가능)
      // 여기선 5회차 확인이 핵심이므로 생략
      await waitFor(() => expect(mockShowToast).toHaveBeenCalled());
    }
    mockShowToast.mockClear(); // 5회차 메시지 검증을 위해 초기화

    // ▶ 5번째 실패: 바로 잠금 토스트가 나와야 함
    await submit('lock@test.com', 'wrongpass5');
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenLastCalledWith(
        '비밀번호를 5회 이상 잘못 입력하셔서 30초간 로그인할 수 없습니다.',
        'error',
      ),
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
});
