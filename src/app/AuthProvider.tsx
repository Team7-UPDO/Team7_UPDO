'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkTokenValidity, logout } = useAuthStore();
  const { user, fetchMe, clear } = useUserStore();

  useEffect(() => {
    // 토큰 유효성 검사
    const valid = checkTokenValidity();

    // 유효하지 않다면 logout(useAuthStore) & clear(useUserStore)
    if (!valid) {
      logout();
      clear();
      return;
    }

    // 유효하다면 사용자 정보 요청
    if (!user && isAuthenticated) fetchMe();
  }, [isAuthenticated, checkTokenValidity, fetchMe, logout, clear, user]);

  return <>{children}</>;
}
