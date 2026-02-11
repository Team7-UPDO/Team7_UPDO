import { act } from '@testing-library/react';

import { LOCK_MS, LOCK_THRESHOLD, useAuthStore } from '@/stores/useAuthStore';

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();

  // Store를 초기 상태로 리셋
  act(() => {
    useAuthStore.setState({
      token: null,
      tokenExpiry: null,
      isAuthenticated: false,
      failedAttempts: 0,
      isLocked: false,
      lockExpiry: null,
    });
  });
});

afterEach(() => {
  jest.useRealTimers();
});

// 로그인 실패 잠금 메커니즘
describe('로그인 실패 잠금', () => {
  it('4회 실패해도 잠금되지 않는다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD - 1; i++) {
        increaseFailedAttempts();
      }
    });

    const state = useAuthStore.getState();
    expect(state.failedAttempts).toBe(LOCK_THRESHOLD - 1);
    expect(state.isLocked).toBe(false);
  });

  it('5회 실패하면 잠금된다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD; i++) {
        increaseFailedAttempts();
      }
    });

    const state = useAuthStore.getState();
    expect(state.failedAttempts).toBe(LOCK_THRESHOLD);
    expect(state.isLocked).toBe(true);
    expect(state.lockExpiry).not.toBeNull();
  });

  it('잠금 후 30초가 지나면 자동 해제된다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD; i++) {
        increaseFailedAttempts();
      }
    });

    expect(useAuthStore.getState().isLocked).toBe(true);

    // 30초 경과
    act(() => {
      jest.advanceTimersByTime(LOCK_MS);
    });

    const state = useAuthStore.getState();
    expect(state.isLocked).toBe(false);
    expect(state.failedAttempts).toBe(0);
    expect(state.lockExpiry).toBeNull();
  });
});

// setToken
describe('setToken', () => {
  it('토큰 설정 시 인증 상태가 활성화된다', () => {
    act(() => {
      useAuthStore.getState().setToken('test-token', 60000);
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
    expect(state.tokenExpiry).not.toBeNull();
  });

  it('토큰 설정 시 failedAttempts가 초기화된다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < 3; i++) {
        increaseFailedAttempts();
      }
    });

    expect(useAuthStore.getState().failedAttempts).toBe(3);

    act(() => {
      useAuthStore.getState().setToken('test-token', 60000);
    });

    expect(useAuthStore.getState().failedAttempts).toBe(0);
    expect(useAuthStore.getState().isLocked).toBe(false);
  });

  it('null 전달 시 인증이 해제된다', () => {
    act(() => {
      useAuthStore.getState().setToken('test-token', 60000);
    });

    act(() => {
      useAuthStore.getState().setToken(null);
    });

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

// resetFailedAttempts
describe('resetFailedAttempts', () => {
  it('실패 횟수와 잠금 상태를 초기화한다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD; i++) {
        increaseFailedAttempts();
      }
    });

    expect(useAuthStore.getState().isLocked).toBe(true);

    act(() => {
      useAuthStore.getState().resetFailedAttempts();
    });

    const state = useAuthStore.getState();
    expect(state.failedAttempts).toBe(0);
    expect(state.isLocked).toBe(false);
    expect(state.lockExpiry).toBeNull();
  });
});

// checkLockStatus
describe('checkLockStatus', () => {
  it('잠금 만료 전이면 true를 반환한다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD; i++) {
        increaseFailedAttempts();
      }
    });

    const result = useAuthStore.getState().checkLockStatus();
    expect(result).toBe(true);
  });

  it('잠금 만료 후이면 false를 반환하고 상태를 초기화한다', () => {
    const { increaseFailedAttempts } = useAuthStore.getState();

    act(() => {
      for (let i = 0; i < LOCK_THRESHOLD; i++) {
        increaseFailedAttempts();
      }
    });

    // 30초 경과 (타이머 콜백 없이 시간만 이동)
    jest.setSystemTime(Date.now() + LOCK_MS + 1);

    const result = useAuthStore.getState().checkLockStatus();
    expect(result).toBe(false);
    expect(useAuthStore.getState().failedAttempts).toBe(0);
  });
});

// checkTokenValidity
describe('checkTokenValidity', () => {
  it('토큰이 만료되면 false를 반환하고 정리한다', () => {
    act(() => {
      useAuthStore.getState().setToken('test-token', 1000); // 1초 후 만료
    });

    // 2초 경과
    jest.setSystemTime(Date.now() + 2000);

    const result = useAuthStore.getState().checkTokenValidity();
    expect(result).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('토큰이 유효하면 true를 반환한다', () => {
    act(() => {
      useAuthStore.getState().setToken('test-token', 60000);
    });

    const result = useAuthStore.getState().checkTokenValidity();
    expect(result).toBe(true);
  });
});

// logout
describe('logout', () => {
  it('토큰과 인증 상태를 초기화한다', () => {
    act(() => {
      useAuthStore.getState().setToken('test-token', 60000);
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.tokenExpiry).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
