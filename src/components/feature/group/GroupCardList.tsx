'use client';

import GroupCard from './GroupCard';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import Image from 'next/image';
import { FilterState } from '@/utils/mapping';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { toGetGatheringsParams } from '@/utils/mapping';
import GroupCardSkeleton from '@/components/ui/Skeleton/GroupCardSkeleton';
interface GroupCardListProps {
  filters: FilterState;
}

export default function GroupCardList({ filters }: GroupCardListProps) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px 0px' });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['gatherings', filters],
      queryFn: ({ pageParam = 1 }) =>
        getGatheringInfiniteList(pageParam, toGetGatheringsParams(filters)),
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextPage,
    });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const gatherings =
    data?.pages
      .flatMap(page => page.data)
      .filter(item => {
        if (filters.main === '성장' && !filters.subType) {
          return item.type !== 'WORKATION';
        }
        return true;
      }) ?? [];

  if (isLoading)
    return (
      <div className="mx-auto flex flex-col items-center gap-6 md:grid md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );

  if (isError)
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

  return (
    <>
      {gatherings.length === 0 ? (
        <span className="mt-16 flex flex-col items-center text-gray-400">
          <Image src="/images/empty.png" alt="empty" width={180} height={100} />
          현재 등록된 모임이 없습니다.
        </span>
      ) : (
        <div className="mx-auto flex flex-col gap-6 md:grid md:grid-cols-2">
          {gatherings.map(item => (
            <motion.div
              key={item.id}
              className="h-full w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}>
              <GroupCard data={item} />
            </motion.div>
          ))}
          <div ref={ref} className="text-gray-500">
            {isFetchingNextPage ? '불러오는 중...' : hasNextPage}
          </div>
        </div>
      )}
    </>
  );
}
