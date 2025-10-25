'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

import MyGroupCardSkeleton from '@/components/ui/Skeleton/MyGroupCardSkeleton';
import MyGroupCard from './MyGroupCard';

import { TabVariant } from '@/app/mypage/page';
import type { IJoinedGathering } from '@/types/gatherings';
import { useMounted } from '@/hooks/useMounted';
import { isClosed } from '@/utils/date';
import { useToast } from '@/components/ui/Toast';
import { leaveGathering } from '@/services/gatherings/gatheringService';

interface MyGroupCardListProps {
  emptyMsg: string;
  queryKey: (string | number | object)[];
  getPage: (pageParam: number) => Promise<{ data: IJoinedGathering[]; nextPage?: number }>;
  variant: TabVariant;
  reviewFilter?: 'writable' | 'written';
  enabled?: boolean;
}

type PageResponse = { data: IJoinedGathering[]; nextPage?: number };

export default function MyGroupCardList({
  emptyMsg,
  queryKey,
  getPage,
  variant,
  reviewFilter,
  enabled = true,
}: MyGroupCardListProps) {
  const mounted = useMounted();

  const queryClient = useQueryClient();
  const toast = useToast();
  const [leavingId, setLeavingId] = useState<number | null>(null);

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '100px 0px' });

  // tanStackQuery로 무한 스크롤 구현하기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 1 }) => getPage(pageParam),
      initialPageParam: 1,
      getNextPageParam: lastPage => lastPage.nextPage,
      enabled: mounted && enabled,
    });

  // useMounted 훅으로 mounted(CSR 환경)되었으며,
  useEffect(() => {
    if (mounted && enabled) refetch();
  }, [mounted, enabled, refetch]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const leaveMutation = useMutation({
    mutationFn: (gatheringId: number) => leaveGathering(gatheringId),
    onMutate: async (gatheringId: number) => {
      setLeavingId(gatheringId);
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<InfiniteData<PageResponse>>(queryKey);
      queryClient.setQueryData<InfiniteData<PageResponse>>(queryKey, old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            data: page.data.map(it =>
              it.id === gatheringId
                ? {
                    ...it,
                    participantCount: Math.max(0, (it.participantCount ?? 0) - 1),
                    isJoined: false,
                  }
                : it,
            ),
          })),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
      toast.showToast('모임 참여 취소가 실패했습니다.', 'error');
    },
    onSuccess: () => {
      toast.showToast('모임 참여를 취소했습니다.', 'info');
    },
    onSettled: () => {
      setLeavingId(null);
      queryClient.invalidateQueries({ queryKey });
      // 공통(연관) 쿼리키도 함께 무효화 (있으면 적용됨)
      const relatedKeys = [['myGroups'], ['joinedGatherings']];
      relatedKeys.forEach(k => queryClient.invalidateQueries({ queryKey: k }));
    },
  });

  const handleLeave = (gatheringId: number) => {
    leaveMutation.mutate(gatheringId);
  };

  const list: IJoinedGathering[] = data?.pages?.flatMap(p => p.data) ?? [];

  const filtered =
    variant === 'myReviews' && reviewFilter
      ? list.filter(item => {
          const completed = (item.isCompleted ?? false) || isClosed(item.dateTime);
          const reviewed = !!item.isReviewed;
          if (reviewFilter === 'writable') return completed && !reviewed;
          if (reviewFilter === 'written') return completed && reviewed;
          return true;
        })
      : list;

  if (isLoading) {
    return (
      <div className="mx-auto mt-6 flex w-full flex-col items-center gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MyGroupCardSkeleton key={i} />
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

  if (filtered.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center" ref={ref}>
        <Image src="/images/empty.png" alt="모임 빈화면 이미지" width={171} height={115} />
        <span className="card-title text-gray-400">{emptyMsg}</span>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 flex w-full flex-col items-center gap-4 sm:mt-8 md:gap-6">
      {filtered.map(item => (
        <div key={item.id} className="w-full">
          <MyGroupCard
            variant={variant}
            item={item}
            onLeave={() => handleLeave(Number(item.id))}
            isLeaving={leavingId === Number(item.id)}
          />
        </div>
      ))}
      {/* sentinel */}
      <div ref={ref} className="my-4 text-gray-500">
        {isFetchingNextPage ? '불러오는 중...' : hasNextPage ? '' : ''}
      </div>
    </div>
  );
}
