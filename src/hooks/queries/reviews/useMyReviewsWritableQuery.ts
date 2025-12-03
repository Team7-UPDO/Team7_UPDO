'use client';

import { useMemo } from 'react';

import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';

import type { IJoinedGathering } from '@/types/gatherings';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';
import { useUserStore } from '@/stores/useUserStore';
import { queryKeys } from '@/constants/queryKeys';

export type ReviewablePage = {
  data: IJoinedGathering[];
  page?: number;
  nextPage?: number | null;
};

export function useMyReviewsWritableQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery({
    queryKey: queryKeys.reviews.my.writable(userId ?? null),
    queryFn: page =>
      getJoinedGatherings(page, {
        reviewed: false,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      }),
    enabled: !!userId,
  });

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
