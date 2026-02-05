'use client';

import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';
import { useUserStore } from '@/stores/useUserStore';
import type { IJoinedGathering } from '@/types/gatherings';

export type JoinedPage = { data: IJoinedGathering[]; page?: number; nextPage?: number | null };

export function useMyMeetingsQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery({
    queryKey: queryKeys.gatherings.my.joinedGatheringsInfinite(userId ?? null),
    queryFn: page => getJoinedGatherings(page, { sortBy: 'dateTime', sortOrder: 'asc' }),
    enabled: !!userId,
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
