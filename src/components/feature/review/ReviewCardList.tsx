'use client';
import Image from 'next/image';

import React, { useEffect, useRef } from 'react';

import ReviewCard from '@/components/feature/review/ReviewCard';
import ReviewCardSkeleton from '@/components/ui/Skeleton/ReviewCardSkeleton';

import { cn } from '@/utils/cn';
import { IReviewWithRelations } from '@/types/reviews';

import { useInfiniteScrollObserver } from '@/hooks/useInfiniteScrollObserver';

interface ReviewCardListProps {
  variants: 'my' | 'all';
  items: IReviewWithRelations[];
  filters?: Record<string, string>; // 모든 리뷰 페이지

  isLoading?: boolean;
  isError?: boolean;

  onRetry?: () => void;

  emptyMsg?: string;

  infinite?: {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    rootMargin?: string;
    disabled?: boolean;
  };

  sentinelRef?: React.RefObject<HTMLDivElement>;

  /** MyPage 전용: 리스트 영역만 스크롤되도록 고정 */
  constrainedScroll?: boolean; // true면 내부 컨테이너에 overflow-y-auto 적용
  scrollMaxHeightClassName?: string; // 예: 'max-h-[calc(100vh-240px)]'
}

export default function ReviewCardList({
  variants,
  items,
  isLoading = false,
  isError = false,
  onRetry,
  emptyMsg = '아직 등록된 리뷰가 없어요.',
  infinite,

  sentinelRef: externalSentinelRef,
  constrainedScroll,
  scrollMaxHeightClassName,
}: ReviewCardListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const internalContainerSentinelRef = useRef<HTMLDivElement | null>(null);

  const usingExternal = !!externalSentinelRef;

  const useContainerObserver =
    !!infinite && !infinite.disabled && !usingExternal && !!constrainedScroll;

  const internalSentinelRef = useInfiniteScrollObserver({
    hasNextPage: !!infinite?.hasNextPage && !usingExternal && !constrainedScroll,
    isFetchingNextPage: !!infinite?.isFetchingNextPage,
    fetchNextPage: infinite?.fetchNextPage ?? (() => {}),
    rootMargin: infinite?.rootMargin,
  });

  const sentinelRef = (externalSentinelRef ??
    (useContainerObserver
      ? (internalContainerSentinelRef as React.RefObject<HTMLDivElement>)
      : internalSentinelRef)) as React.RefObject<HTMLDivElement> | undefined;

  useEffect(() => {
    if (!useContainerObserver) return;
    const root = scrollRef.current;
    const target = internalContainerSentinelRef.current;
    if (!root || !target) return;
    const io = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        if (!infinite?.hasNextPage || infinite?.isFetchingNextPage) return;
        infinite.fetchNextPage();
      },
      { root, rootMargin: infinite?.rootMargin ?? '0px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [
    useContainerObserver,
    infinite,
    infinite?.hasNextPage,
    infinite?.isFetchingNextPage,
    infinite?.rootMargin,
    infinite?.fetchNextPage,
  ]);

  const containerClassname = cn(
    'mx-auto w-full bg-white p-6 rounded-lg sm:rounded-xl',
    variants === 'my' ? 'mt-4 sm:mt-8 md:mt-8 md:px-7' : 'mt-6 md:p-8',
  );

  if (isLoading) {
    return (
      <div className={containerClassname}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full">
            <ReviewCardSkeleton variant={variants} />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-gray-500">
        데이터를 불러오는 중 오류가 발생했습니다.
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <Image src="/images/empty.png" alt="리뷰 빈화면 이미지" width={171} height={115} />
        <span className="card-title text-gray-400">{emptyMsg}</span>
      </div>
    );
  }

  return (
    <div className={containerClassname}>
      <div
        className={cn(
          constrainedScroll
            ? cn(
                'scroll flex flex-col items-center gap-6 rounded-lg sm:gap-0',
                'max-h-full w-full overflow-y-auto p-0',
                scrollMaxHeightClassName ?? 'max-h-[calc(100vh-240px)]',
              )
            : undefined,
        )}
        ref={constrainedScroll ? scrollRef : undefined}>
        {items.map(review => (
          <div key={review.id} className="w-full">
            <ReviewCard variant={variants} item={review} />
          </div>
        ))}
      </div>

      {sentinelRef && items && items.length > 0 && (
        <div ref={sentinelRef} className="my-4 text-gray-500" aria-live="polite" role="status">
          {infinite?.isFetchingNextPage ? '불러오는 중…' : infinite?.hasNextPage ? '' : ''}
        </div>
      )}
    </div>
  );
}
