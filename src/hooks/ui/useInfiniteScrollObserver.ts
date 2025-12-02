import { useEffect, useRef } from 'react';

interface UseInfiniteScrollObserverOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
  threshold?: number;
}

/**
 * 무한스크롤용 IntersectionObserver 공통 훅
 * - ref를 컴포넌트 하단 sentinel에 연결해두면 자동으로 다음 페이지 fetch
 */
export function useInfiniteScrollObserver({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px 0px 0px 0px',
  threshold = 0.1,
}: UseInfiniteScrollObserverOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin, threshold]);

  return sentinelRef;
}
