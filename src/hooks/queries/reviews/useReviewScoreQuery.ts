import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { reviewService } from '@/services/reviews/reviewService';
import { GetReviewScoresParams, GetReviewScoresResponse } from '@/types/reviews';

export const useReviewScoresQuery = (params?: GetReviewScoresParams) => {
  return useQuery<GetReviewScoresResponse>({
    queryKey: queryKeys.reviews.scores(params),
    queryFn: () => reviewService.getReviewScores(params),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
