'use client';

import { useMemo } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { useInfiniteListQuery } from '@/hooks/queries/common/useInfiniteListQuery';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';
import { useUserStore } from '@/stores/useUserStore';
import type { IJoinedGathering } from '@/types/gatherings';

export type CreatedGroupPage = { data: IJoinedGathering[]; nextPage?: number | null };

export function useMyCreatedGroupsQuery() {
  const userId = useUserStore(state => state.user?.id);

  /* eslint-disable @tanstack/query/exhaustive-deps -- userId는 queryKey에 이미 포함됨 */
  const query = useInfiniteListQuery<CreatedGroupPage>({
    queryKey: userId
      ? queryKeys.gatherings.my.createdGatherings(userId)
      : ['gatherings', 'my', 'created', null],
    queryFn: page =>
      getGatheringInfiniteList(page, {
        createdBy: userId as number,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      }),
    enabled: !!userId, // 로그인된 사용자만
  });
  /* eslint-enable @tanstack/query/exhaustive-deps */

  const items = useMemo(() => query.data?.pages?.flatMap(p => p.data) ?? [], [query.data]);
  return { ...query, items };
}
