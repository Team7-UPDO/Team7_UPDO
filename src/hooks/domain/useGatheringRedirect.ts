import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useGatheringRedirect(isCanceled: boolean, isLoading: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (isCanceled && !isLoading) {
      setTimeout(() => {
        router.push('/gathering');
      }, 1500);
    }
  }, [isCanceled, isLoading, router]);
}
