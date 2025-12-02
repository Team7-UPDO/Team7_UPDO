'use client';

import { useMemo } from 'react';

import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import anonReviewService from '@/services/reviews/anonReviewService';
import type { IReviewWithRelations } from '@/types/reviews';

import { queryKey } from '@/constants/queryKeys';
import { useUserStore } from '@/stores/useUserStore';

export type MyWrittenReviewPage = {
  data: IReviewWithRelations[];
  nextPage?: number | null;
};

export function useMyReviewsWrittenQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery<MyWrittenReviewPage>({
    queryKey: queryKey.myReviewsWritten(userId ?? null),
    queryFn: page =>
      anonReviewService.getReviewInfiniteList(page, userId != null ? { userId } : undefined),
    enabled: !!userId,
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
