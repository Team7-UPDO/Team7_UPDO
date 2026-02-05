import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useGatheringRedirect(options: {
  isCanceled: boolean;
  isError: boolean;
  isLoading: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!options.isLoading && (options.isCanceled || options.isError)) {
      const timer = setTimeout(() => router.push('/gathering'), 1500);
      return () => clearTimeout(timer);
    }
  }, [options.isCanceled, options.isError, options.isLoading, router]);
}
