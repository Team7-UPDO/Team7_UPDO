'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { useToast } from '@/components/ui/Toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useUserStore(s => s.user);
  const fetchMe = useUserStore(s => s.fetchMe);

  useEffect(() => {
    if (user) return; // 로그인된 상태이면 return
    (async () => {
      await fetchMe();
      if (!useUserStore.getState().user) {
        showToast('로그인이 필요한 서비스입니다.', 'error');
        router.replace('/');
      }
    })();
  }, [user, fetchMe, router, showToast]);

  if (!user) return null; // 깜빡임 최소화
  return <>{children}</>;
}
