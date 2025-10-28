'use client';

import { useEffect, useMemo } from 'react';
import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';

import type { IJoinedGathering } from '@/types/gatherings';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';

import { qk } from '@/constants/queryKeys';

export type ReviewablePage = {
  data: IJoinedGathering[];
  page?: number;
  nextPage?: number | null;
};

export function useMyReviewsWritableQuery(): UseInfiniteQueryResult<
  InfiniteData<ReviewablePage>,
  Error
> {
  const query = useInfiniteListQuery({
    queryKey: qk.myReviewsWritable(),
    queryFn: page =>
      getJoinedGatherings(page, {
        reviewed: false,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      }),
  });

  // 진입 시 cache refetch
  useEffect(() => {
    query.refetch();
  }, [query]);

  return query;
}

export function useMyReviewsWritableList() {
  const query = useMyReviewsWritableQuery();

  // 참여자가 5명 이상인 작성할 수 있는 모임 골라오기
  const items = useMemo(() => {
    const raw = query.data?.pages?.flatMap(p => p.data) ?? [];
    return raw.filter(g => {
      const cnt =
        typeof g.participantCount === 'number'
          ? g.participantCount
          : Number(g.participantCount ?? 0);
      return cnt >= 5;
    });
  }, [query.data]);

  return { ...query, items };
}
