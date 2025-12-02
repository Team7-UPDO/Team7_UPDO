'use client';

import { useMemo } from 'react';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import type { IReviewWithRelations } from '@/types/reviews';
import anonReviewService from '@/services/reviews/anonReviewService';
import { queryKey } from '@/constants/queryKeys';

export type AllReviewPage = {
  data: IReviewWithRelations[];
  nextPage?: number | null;
};

export function useAllReviewQuery(params?: Record<string, string>) {
  // 공통 무한 스크롤 쿼리
  const query = useInfiniteListQuery<AllReviewPage>({
    queryKey: queryKey.allReviews(params),
    queryFn: page => anonReviewService.getReviewInfiniteList(page, params || {}),
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);

  return { ...query, items };
}
