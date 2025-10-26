'use client';
import Image from 'next/image';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { useMounted } from '@/hooks/useMounted';

import ReviewCard from './ReviewCard';
import ReviewCardSkeleton from '@/components/ui/Skeleton/ReviewCardSkeleton';

import { cn } from '@/utils/cn';
import anonReviewService from '@/services/reviews/anonReviewService';
import { IReviewWithRelations } from '@/types/reviews';

interface ReviewCardListProps {
  variants: 'my' | 'all';
  userId?: number;
  emptyMsg: string;
  filters?: Record<string, string>;
}

type Page = { data: IReviewWithRelations[]; nextPage?: number };

export default function ReviewCardList({
  variants,
  userId,
  emptyMsg,
  filters,
}: ReviewCardListProps) {
  const containerClassname = cn(
    'mx-auto flex w-full flex-col items-center gap-4 rounded-xl bg-white p-6 sm:rounded-2xl md:gap-6',
    variants === 'my' ? 'mt-4 sm:mt-8 md:mt-9' : 'mt-6',
    variants === 'my' ? 'md:px-8' : 'md:p-8',
  );
  const mounted = useMounted();

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px 0px' });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery<Page, Error, Page, readonly unknown[], number>({
      queryKey: ['reviews', variants, userId ?? null, JSON.stringify(filters || {})],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const page = typeof pageParam === 'number' ? pageParam : 1;

        const params: Record<string, string | number | boolean> = {};

        // filters 병합
        if (filters) {
          Object.assign(params, filters);
        }

        // userId 추가 (my일 때만)
        if (variants === 'my' && userId != null) {
          params.userId = userId;
        }

        return anonReviewService.getReviewInfiniteList(page, params);
      },
      getNextPageParam: lastPage => lastPage.nextPage,
    });

  const pages = (data as InfiniteData<Page, number> | undefined)?.pages;
  const list: IReviewWithRelations[] = pages?.flatMap(p => p.data) ?? [];

  // useMounted 훅
  useEffect(() => {
    if (mounted) refetch();
  }, [mounted, refetch]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
          다시 시도
        </button>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center" ref={ref}>
        <Image src="/images/empty.png" alt="리뷰 빈화면 이미지" width={171} height={115} />
        <span className="card-title text-gray-400">{emptyMsg}</span>
      </div>
    );
  }

  return (
    <div>
      <div className={containerClassname}>
        {list.map(review => (
          <div key={review.id} className="w-full">
            <ReviewCard variant={variants} item={review} />
          </div>
        ))}
      </div>
      {/* sentinel */}
      <div ref={ref} className="my-4 text-gray-500">
        {isFetchingNextPage ? '불러오는 중...' : hasNextPage ? '' : ''}
      </div>
    </div>
  );
}
