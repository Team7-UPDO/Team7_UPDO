'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviews/reviewService';
import { queryKey } from '@/constants/queryKeys';
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
    queryKey: ['myReview', Number(gatheringId), userId],
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
      queryClient.invalidateQueries({ queryKey: ['myReview', Number(gatheringId), userId] }),
      queryClient.invalidateQueries({ queryKey: ['reviews', Number(gatheringId)] }),
      queryClient.invalidateQueries({ queryKey: queryKey.myReviewsWritten(userId) }),
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
