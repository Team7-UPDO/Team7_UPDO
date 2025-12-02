'use client';

import ReviewCardList from '@/components/feature/review/ReviewCardList';
import { useMyReviewsWrittenQuery } from '@/hooks/queries/reviews/useMyReviewsWrittenQuery';

export default function MyReviewWrittenList() {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMyReviewsWrittenQuery();

  return (
    <ReviewCardList
      variants="my"
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      infinite={{ hasNextPage: !!hasNextPage, isFetchingNextPage, fetchNextPage }}
      emptyMsg="작성한 리뷰가 없습니다."
      constrainedScroll
      scrollMaxHeightClassName="max-h-[calc(100vh-260px)]"
    />
  );
}
