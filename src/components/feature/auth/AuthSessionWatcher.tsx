// -----------------------------------------------------------------------------
// NOTE: 전역 세션 워처 컴포넌트
//       - 앱 상단(예: src/app/layout.tsx)에서 한 번만 장착하면
//         토큰 만료 시 자동으로 로그아웃을 트리거한다.
//       - onExpired 콜백에서 /login으로 리다이렉트 등의 후속 처리 가능
// -----------------------------------------------------------------------------

'use client';

// import React from 'react';
import { useRouter } from 'next/navigation';

import { useTokenExpiryEffect } from '@/hooks/auth/useTokenExpiryEffect';

export default function AuthSessionWatcher() {
  const router = useRouter();

  // 만료 시 → 로그인 페이지로 이동
  useTokenExpiryEffect(() => {
    router.replace('/login');
  });

  return null; // UI 렌더링은 없음
}
