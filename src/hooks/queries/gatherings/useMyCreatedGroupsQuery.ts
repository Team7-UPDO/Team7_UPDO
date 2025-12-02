'use client';

import { useMemo } from 'react';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';

import { useUserStore } from '@/stores/useUserStore';
import type { IJoinedGathering } from '@/types/gatherings';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { queryKey } from '@/constants/queryKeys';

export type CreatedGroupPage = { data: IJoinedGathering[]; nextPage?: number | null };

export function useMyCreatedGroupsQuery() {
  const userId = useUserStore(state => state.user?.id);

  const query = useInfiniteListQuery<CreatedGroupPage>({
    queryKey: [queryKey.myCreatedGroups(userId)],
    queryFn: page =>
      getGatheringInfiniteList(page, {
        createdBy: userId as number,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      }),
    enabled: !!userId, // 로그인된 사용자만
  });

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
