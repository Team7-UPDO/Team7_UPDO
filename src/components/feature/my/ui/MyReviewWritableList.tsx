'use client';

import MyGroupCardList from '@/components/feature/my/ui/MyGroupCardList';

import { useInfiniteScrollObserver } from '@/hooks/useInfiniteScrollObserver';
import { useMyReviewsWritableQuery } from '@/hooks/useMyReviewsWritableQuery';

export default function MyReviewWritableList() {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMyReviewsWritableQuery();

  const sentinelRef = useInfiniteScrollObserver({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <MyGroupCardList
      variant="myReviews"
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      sentinelRef={sentinelRef}
      hasNextPage={!!hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      emptyMsg="작성 가능한 모임이 없어요."
      reviewFilter="writable"
    />
  );
}
