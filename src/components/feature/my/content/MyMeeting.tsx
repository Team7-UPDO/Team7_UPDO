'use client';

import { useMyMeetingsQuery } from '@/hooks/queries/gatherings/useMyMeetingsQuery';
import { useInfiniteScrollObserver } from '@/hooks/ui/useInfiniteScrollObserver';

import MyGroupCardList from '@/components/feature/my/ui/MyGroupCardList';

export default function MyMeeting() {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMyMeetingsQuery();

  // 무한 스크롤용 sentinel
  const sentinelRef = useInfiniteScrollObserver({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <MyGroupCardList
      variant="myMeetings"
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      sentinelRef={sentinelRef}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      emptyMsg="아직 참여한 모임이 없습니다."
    />
  );
}
