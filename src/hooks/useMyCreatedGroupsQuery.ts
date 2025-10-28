import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import { useInfiniteListQuery } from '@/hooks/useInfiniteListQuery';

import { useUserStore } from '@/stores/useUserStore';
import type { IJoinedGathering } from '@/types/gatherings';
import { getGatheringInfiniteList } from '@/services/gatherings/anonGatheringService';

export type CreatedGroupPage = { data: IJoinedGathering[]; nextPage?: number | null };

export function useMyCreatedGroupsQuery(): UseInfiniteQueryResult<
  InfiniteData<CreatedGroupPage>,
  Error
> {
  const userId = useUserStore(state => state.user?.id);

  return useInfiniteListQuery<CreatedGroupPage>({
    queryKey: ['gatherings', 'createdGroups', userId ?? 'anon'],
    queryFn: page =>
      getGatheringInfiniteList(page, {
        createdBy: userId as number,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      }),
    enabled: !!userId, // 로그인된 사용자만
  });
}
