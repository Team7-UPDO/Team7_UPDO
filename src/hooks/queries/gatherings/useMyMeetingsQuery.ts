'use client';

import { useMemo } from 'react';

import type { IJoinedGathering } from '@/types/gatherings';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import { useUserStore } from '@/stores/useUserStore';
import { queryKeys } from '@/constants/queryKeys';

export type JoinedPage = { data: IJoinedGathering[]; page?: number; nextPage?: number | null };

export function useMyMeetingsQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery({
    queryKey: userId
      ? queryKeys.gatherings.my.joinedGatherings(userId)
      : ['gatherings', 'my', null, 'joined'],
    queryFn: page => getJoinedGatherings(page, { sortBy: 'dateTime', sortOrder: 'asc' }),
    enabled: !!userId,
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
