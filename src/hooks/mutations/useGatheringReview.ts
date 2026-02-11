'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { reviewService } from '@/services/reviews/reviewService';
import { IReviewWithRelations } from '@/types/reviews/models';

interface UseGatheringReviewParams {
  gatheringId: string | number;
  userId: number | null;
}

interface UseGatheringReviewReturn {
  myReviews: IReviewWithRelations[];
  isReviewed: boolean;
  isLoading: boolean;
  isError: boolean;
  isReviewModalOpen: boolean;
  handleOpenReviewModal: () => void;
  handleCloseReviewModal: () => void;
  handleReviewSuccess: () => void;
  setIsReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGatheringReview({
  gatheringId,
  userId,
}: UseGatheringReviewParams): UseGatheringReviewReturn {
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 리뷰 데이터 패칭 (객체 -> 배열 추출)
  const {
    data: myReviewResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.reviews.my.byGathering(Number(gatheringId), userId!),
    queryFn: () =>
      reviewService.getReviews({
        gatheringId: Number(gatheringId),
        userId: userId!,
      }),
    enabled: !!gatheringId && !!userId,
  });

  // 배열만 추출
  const myReviews: IReviewWithRelations[] = myReviewResponse?.data ?? [];

  // 작성 여부
  const isReviewed = myReviews.length > 0;

  // 리뷰 성공 시 캐시 무효화
  const handleReviewSuccess = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.my.byGathering(Number(gatheringId), userId!),
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.my.written(userId!) }),
    ]);
    setIsReviewModalOpen(false);
  };

  return {
    myReviews,
    isReviewed,
    isLoading,
    isError,
    isReviewModalOpen,
    handleOpenReviewModal: () => setIsReviewModalOpen(true),
    handleCloseReviewModal: () => setIsReviewModalOpen(false),
    handleReviewSuccess,
    setIsReviewModalOpen,
  };
}
