import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export function useGatheringRedirect(isCanceled: boolean, isLoading: boolean) {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (isCanceled && !isLoading) {
      showToast('삭제된 모임입니다.', 'error');
      setTimeout(() => {
        router.push('/gathering');
      }, 1500);
    }
  }, [isCanceled, isLoading, router, showToast]);
}
