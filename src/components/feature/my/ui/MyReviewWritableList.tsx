'use client';

import MyGroupCardList from '@/components/feature/my/ui/MyGroupCardList';
import { useMyReviewsWritableQuery } from '@/hooks/queries/reviews/useMyReviewsWritableQuery';
import { useInfiniteScrollObserver } from '@/hooks/ui/useInfiniteScrollObserver';

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
