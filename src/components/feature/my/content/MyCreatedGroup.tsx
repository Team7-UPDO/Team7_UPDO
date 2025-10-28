'use client';

import { useMemo } from 'react';

import MyGroupCardList from '@/components/feature/my/ui/MyGroupCardList';

import { useMyCreatedGroupsQuery } from '@/hooks/useMyCreatedGroupsQuery';
import { useInfiniteScrollObserver } from '../../../../hooks/useInfiniteScrollObserver';

export default function MyCreatedGroup() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMyCreatedGroupsQuery();

  const items = useMemo(() => data?.pages?.flatMap(p => p.data) ?? [], [data]);

  // 무한 스크롤용 sentinel
  const sentinelRef = useInfiniteScrollObserver({ hasNextPage, isFetchingNextPage, fetchNextPage });

  return (
    <MyGroupCardList
      variant="created"
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      sentinelRef={sentinelRef}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      emptyMsg="아직 만든 모임이 없습니다."
    />
  );
}
