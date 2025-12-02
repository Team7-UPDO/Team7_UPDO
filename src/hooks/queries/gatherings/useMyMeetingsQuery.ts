'use client';

import { useMemo } from 'react';

import type { IJoinedGathering } from '@/types/gatherings';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';

import { queryKey } from '@/constants/queryKeys';

export type JoinedPage = { data: IJoinedGathering[]; page?: number; nextPage?: number | null };

export function useMyMeetingsQuery() {
  const query = useInfiniteListQuery({
    queryKey: queryKey.myMeetings(),
    queryFn: page => getJoinedGatherings(page, { sortBy: 'dateTime', sortOrder: 'asc' }),
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
