import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { reviewService } from '@/services/reviews/reviewService';
import { GetReviewsResponse } from '@/types/reviews';

const REVIEWS_PER_PAGE = 4;

export const useReviewsQuery = (gatheringId: number, page: number) => {
  const offset = (page - 1) * REVIEWS_PER_PAGE;

  /* eslint-disable @tanstack/query/exhaustive-deps -- offset은 page에서 계산됨 */
  return useQuery<GetReviewsResponse>({
    queryKey: queryKeys.reviews.byGathering(gatheringId, page),
    queryFn: () =>
      reviewService.getReviews({
        gatheringId,
        limit: REVIEWS_PER_PAGE,
        offset,
      }),
    enabled: !!gatheringId,
    placeholderData: prev => prev,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
  /* eslint-enable @tanstack/query/exhaustive-deps */
};
