'use client';

import { create } from 'zustand';

interface AuthState {
  token: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;

  // 🔒 임시 잠금 관련 상태
  failedAttempts: number;
  isLocked: boolean;
  lockExpiry: number | null; // 잠금 만료 시각(ms)

  // 인증 관련 메서드
  setToken: (token: string | null, expiryMs?: number) => void;
  logout: () => void;
  checkTokenValidity: () => boolean;

  // 잠금 관련 메서드
  increaseFailedAttempts: () => void;
  resetFailedAttempts: () => void;
  checkLockStatus: () => boolean; // 만료 여부 확인
}

// ✅ 브라우저 환경에서만 localStorage 접근
const readFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      token: null as string | null,
      tokenExpiry: null as number | null,
      failedAttempts: 0,
      isLocked: false,
      lockExpiry: null,
    };
  }

  const token = localStorage.getItem('access_token');
  const expiryStr = localStorage.getItem('token_expiry');
  const lockExpiryStr = localStorage.getItem('lock_expiry');
  const failedAttemptsStr = localStorage.getItem('failed_attempts');

  const tokenExpiry = expiryStr ? Number(expiryStr) : null;
  const lockExpiry = lockExpiryStr ? Number(lockExpiryStr) : null;
  const failedAttempts = failedAttemptsStr ? Number(failedAttemptsStr) : 0;

  const isLocked = !!lockExpiry && Date.now() < lockExpiry;

  return { token, tokenExpiry, failedAttempts, isLocked, lockExpiry };
};

// -----------------------------------------------------------------------------
// ✅ Zustand 스토어 정의
// -----------------------------------------------------------------------------

// ✅ 순환참조 없이 get() 사용
export const useAuthStore = create<AuthState>((set, get) => {
  const { token, tokenExpiry, failedAttempts, isLocked, lockExpiry } = readFromStorage();

  return {
    token,
    tokenExpiry,
    isAuthenticated: !!token && !!tokenExpiry && Date.now() < tokenExpiry,
    failedAttempts,
    isLocked,
    lockExpiry,

    // -------------------------------------------------------------------------
    // 🧩 토큰 설정 / 삭제
    // -------------------------------------------------------------------------

    setToken: (newToken, expiryMs) => {
      if (typeof window !== 'undefined') {
        if (newToken) {
          const expiry =
            typeof expiryMs === 'number' ? Date.now() + expiryMs : Date.now() + 60 * 60 * 1000;
          localStorage.setItem('access_token', newToken);
          localStorage.setItem('token_expiry', String(expiry));
          set({
            token: newToken,
            tokenExpiry: expiry,
            isAuthenticated: true,
            failedAttempts: 0, // 로그인 성공 시 실패횟수 초기화
          });
          localStorage.removeItem('failed_attempts');
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_expiry');
          set({ token: null, tokenExpiry: null, isAuthenticated: false });
        }
      } else {
        set({ token: newToken, tokenExpiry: null, isAuthenticated: !!newToken });
      }
    },

    // -------------------------------------------------------------------------
    // 🧩 로그인 실패 횟수 증가
    // -------------------------------------------------------------------------
    increaseFailedAttempts: () => {
      const { failedAttempts } = get();
      const nextAttempts = failedAttempts + 1;

      // 5회 이상이면 잠금
      if (nextAttempts >= 5) {
        const lockUntil = Date.now() + 0.5 * 60 * 1000; // 30초 잠금

        if (typeof window !== 'undefined') {
          localStorage.setItem('lock_expiry', String(lockUntil));
        }

        set({
          failedAttempts: nextAttempts,
          isLocked: true,
          lockExpiry: lockUntil,
        });

        // ✅ 30초 후 자동 해제
        setTimeout(
          () => {
            const { lockExpiry } = get();
            if (lockExpiry && Date.now() >= lockExpiry) {
              set({ isLocked: false, failedAttempts: 0, lockExpiry: null });
              localStorage.removeItem('lock_expiry');
              localStorage.removeItem('failed_attempts');
            }
          },
          0.5 * 60 * 1000,
        ); // 30초
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('failed_attempts', String(nextAttempts));
        }
        set({ failedAttempts: nextAttempts });
      }
    },

    // -------------------------------------------------------------------------
    // 🧩 실패 횟수 초기화
    // -------------------------------------------------------------------------
    resetFailedAttempts: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('failed_attempts');
        localStorage.removeItem('lock_expiry');
      }
      set({ failedAttempts: 0, isLocked: false, lockExpiry: null });
    },

    // -------------------------------------------------------------------------
    // 🧩 잠금 상태 확인 및 자동 해제
    // -------------------------------------------------------------------------
    checkLockStatus: () => {
      const { isLocked, lockExpiry } = get();
      if (isLocked && lockExpiry && Date.now() >= lockExpiry) {
        // 잠금 만료됨 → 초기화
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lock_expiry');
        }
        set({ isLocked: false, failedAttempts: 0, lockExpiry: null });
        return false;
      }
      return isLocked;
    },

    // -------------------------------------------------------------------------
    // 🧩 토큰 유효성 검사
    // -------------------------------------------------------------------------
    checkTokenValidity: () => {
      const state = get(); // ✅ 안전하게 상태 접근
      if (state.token && state.tokenExpiry && Date.now() >= state.tokenExpiry) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_expiry');
        }
        set({ token: null, tokenExpiry: null, isAuthenticated: false });
        return false;
      }

      // 잠금 상태 검사
      const locked = state.checkLockStatus();
      if (locked) return false;

      return !!state.token && !!state.isAuthenticated;
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiry');
      }
      set({ token: null, tokenExpiry: null, isAuthenticated: false });
    },
  };
});
