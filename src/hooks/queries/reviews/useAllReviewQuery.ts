'use client';

import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import anonReviewService from '@/services/reviews/anonReviewService';
import type { IReviewWithRelations } from '@/types/reviews';

export type AllReviewPage = {
  data: IReviewWithRelations[];
  nextPage?: number | null;
};

export function useAllReviewQuery(params?: Record<string, string>) {
  // 공통 무한 스크롤 쿼리
  const query = useInfiniteListQuery<AllReviewPage>({
    queryKey: queryKeys.reviews.list(params),
    queryFn: page => anonReviewService.getReviewInfiniteList(page, params || {}),
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);

  return { ...query, items };
}
