'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import GroupCardSkeleton from '@/components/ui/Skeleton/GroupCardSkeleton';
import { queryKeys } from '@/constants/queryKeys';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { getCleanFilters } from '@/utils/filters';
import { FilterState } from '@/utils/mapping';
import { toGetGatheringsParams } from '@/utils/mapping';

import GroupCard from './GroupCard';

interface GroupCardListProps {
  filters: FilterState;
}

const SKELETON_COUNT = 6;

export default function GroupCardList({ filters }: GroupCardListProps) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px 0px' });
  const cleanFilters = getCleanFilters(filters);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: queryKeys.gatherings.infiniteList(cleanFilters),
      queryFn: async ({ pageParam = 1 }) => {
        return getGatheringInfiniteList(pageParam, toGetGatheringsParams(cleanFilters));
      },
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextPage,
    });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const gatherings = useMemo(
    () =>
      data?.pages
        .flatMap(page => page.data)
        .filter(item => {
          if (filters.main === '성장' && !filters.subType) {
            return item.type !== 'WORKATION';
          }
          return true;
        }) ?? [],
    [data, filters.main, filters.subType],
  );

  if (isLoading) {
    return (
      <div
        className="mx-auto flex flex-col items-center gap-6 md:grid md:grid-cols-2"
        aria-busy="true">
        <span className="sr-only">모임 목록을 불러오는 중입니다</span>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex h-[300px] flex-col items-center justify-center text-gray-500"
        role="alert">
        데이터를 불러오는 중 오류가 발생했습니다.
        <button
          onClick={() => refetch()}
          className="mt-2 rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
          다시 시도
        </button>
      </div>
    );
  }

  if (gatherings.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center text-gray-400">
        <Image src="/images/empty.webp" alt="모임이 없는 상태" width={180} height={100} />
        <p>현재 등록된 모임이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 flex flex-col gap-6 md:grid md:grid-cols-2">
      {gatherings.map((item, index) => (
        <m.div
          key={item.id}
          className="h-full w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}>
          <GroupCard data={item} isPriority={index === 0} />
        </m.div>
      ))}
      <div ref={ref} aria-live="polite" aria-busy={isFetchingNextPage}>
        {isFetchingNextPage && (
          <>
            <span className="sr-only">추가 모임을 불러오는 중입니다</span>
            <GroupCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
}
