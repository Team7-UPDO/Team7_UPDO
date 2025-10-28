'use client';

import { useRouter } from 'next/navigation';
import { useTokenExpiryEffect } from '@/hooks/useTokenExpiryEffect';

export default function AuthSessionWatcher() {
  const router = useRouter();

  // 만료 시 → 로그인 페이지로 이동
  useTokenExpiryEffect(() => {
    router.replace('/login');
  });

  return null; // UI 렌더링은 없음
}
