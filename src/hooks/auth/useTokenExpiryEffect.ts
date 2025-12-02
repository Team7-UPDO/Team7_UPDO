// -----------------------------------------------------------------------------
// NOTE: 토큰 만료 자동 로그아웃 Effect
//       - 현재 시각과 tokenExpiry 비교 → 이미 만료이면 즉시 로그아웃
//       - 남은 시간만큼 타이머 예약 → 만료 시점에 자동 로그아웃
//       - storage 이벤트 구독 → 다른 탭에서 변경 시 동기화
// -----------------------------------------------------------------------------

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function useTokenExpiryEffect(onExpired?: () => void) {
  const tokenExpiry = useAuthStore(s => s.tokenExpiry);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const timerRef = useRef<number | null>(null);

  const stableOnExpired = useCallback(() => {
    onExpired?.();
  }, [onExpired]);

  useEffect(() => {
    // 기존 타이머 제거
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 로그인 상태가 아니면 아무 것도 하지 않음
    if (!isAuthenticated || !tokenExpiry) return;

    const now = Date.now();

    // 이미 만료됨 → 즉시 로그아웃
    if (now >= tokenExpiry) {
      logout();
      stableOnExpired?.();
      return;
    }

    // 남은 시간만큼 타이머 등록
    const remainMs = tokenExpiry - now;
    timerRef.current = window.setTimeout(() => {
      logout();
      onExpired?.();
    }, remainMs);

    // 정리
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [tokenExpiry, isAuthenticated, logout, stableOnExpired]);

  // 다른 탭(localStorage) 동기화
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'access_token' && !ev.newValue) {
        // 다른 탭에서 토큰이 삭제됨 → 현재 탭도 로그아웃
        logout();
        onExpired?.();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [logout, onExpired]);
}
