'use client';

import ReviewCardList from '@/components/feature/review/ReviewCardList';
import { useAllReviewQuery } from '@/hooks/queries/reviews/useAllReviewQuery';
import { useInfiniteScrollObserver } from '@/hooks/ui/useInfiniteScrollObserver';

type AllReviewListProps = {
  params?: Record<string, string>;
};

export default function AllReviewList({ params }: AllReviewListProps) {
  const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useAllReviewQuery(params);

  const sentinelRef = useInfiniteScrollObserver({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <ReviewCardList
      variants="all"
      items={items}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      // 외부 제어 모드로 전달
      sentinelRef={sentinelRef}
      // 아래 두 값은 푸터 문구 표시에 사용됨
      infinite={{ hasNextPage: !!hasNextPage, isFetchingNextPage, fetchNextPage }}
      emptyMsg={'아직 등록된 리뷰가 없어요.'}
    />
  );
}
