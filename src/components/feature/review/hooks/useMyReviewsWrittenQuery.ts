'use client';

import { useEffect, useMemo } from 'react';
import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';
import anonReviewService from '@/services/reviews/anonReviewService';
import type { IReviewWithRelations } from '@/types/reviews';

import { qk } from '@/constants/queryKeys';
import { useUserStore } from '@/stores/useUserStore';

export type MyWrittenReviewPage = {
  data: IReviewWithRelations[];
  nextPage?: number | null;
};

export function useMyReviewsWrittenQuery(): UseInfiniteQueryResult<
  InfiniteData<MyWrittenReviewPage>,
  Error
> {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery<MyWrittenReviewPage>({
    queryKey: qk.myReviewsWritten(userId ?? null),
    queryFn: page =>
      anonReviewService.getReviewInfiniteList(page, userId != null ? { userId } : undefined),
    enabled: !!userId,
  });

  // 진입 시 cache refetch
  useEffect(() => {
    if (!userId) return;
    query.refetch();
  }, [userId, query]);

  return query;
}

export function useMyReviewsWrittenList() {
  const query = useMyReviewsWrittenQuery();
  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
