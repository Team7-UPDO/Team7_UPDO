'use client';

import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import anonReviewService from '@/services/reviews/anonReviewService';
import { useUserStore } from '@/stores/useUserStore';
import type { IReviewWithRelations } from '@/types/reviews';

export type MyWrittenReviewPage = {
  data: IReviewWithRelations[];
  nextPage?: number | null;
};

export function useMyReviewsWrittenQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery<MyWrittenReviewPage>({
    queryKey: queryKeys.reviews.my.written(userId ?? null),
    queryFn: page =>
      anonReviewService.getReviewInfiniteList(page, userId != null ? { userId } : undefined),
    enabled: !!userId,
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
