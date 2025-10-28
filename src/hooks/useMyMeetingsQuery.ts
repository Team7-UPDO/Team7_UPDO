'use client';

import { useEffect, useMemo } from 'react';
import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import type { IJoinedGathering } from '@/types/gatherings';
import { getJoinedGatherings } from '@/services/gatherings/anonGatheringService';
import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';

export type JoinedPage = { data: IJoinedGathering[]; page?: number; nextPage?: number | null };

export function useMyMeetingsQuery(): UseInfiniteQueryResult<InfiniteData<JoinedPage>, Error> {
  const query = useInfiniteListQuery({
    queryKey: ['gatherings', 'myMeetings'],
    queryFn: page => getJoinedGatherings(page, { sortBy: 'dateTime', sortOrder: 'asc' }),
  });

  // 진입 시 cache refetch
  useEffect(() => {
    query.refetch();
  }, [query]);

  return query;
}

export function useMyMeetingsList() {
  const query = useMyMeetingsQuery();

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);

  return { ...query, items };
}
