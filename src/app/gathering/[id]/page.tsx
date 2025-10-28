'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import GroupDetailCard from '@/components/feature/gathering/detail/GroupDetailCard';
import GroupDetailParticipation from '@/components/feature/gathering/detail/GroupDetailParticipationCard';
import GroupDetailReviewList from '@/components/feature/gathering/detail/GroupDetailReviewList';
import WriteReviewModal from '@/components/feature/review/WriteReviewModal';

import GroupDetailCardSkeleton from '@/components/ui/Skeleton/GroupDetailCardSkeleton';
import GroupDetailParticipationSkeleton from '@/components/ui/Skeleton/GroupDetailParticipationSkeleton';
import GroupDetailReviewListSkeleton from '@/components/ui/Skeleton/GroupDetailReviewListSkeleton';

import { useGatheringDetail } from '@/hooks/useGatheringDetail';
import { useGatheringParticipants } from '@/hooks/useGatheringParticipants';
import { useJoinedGatherings } from '@/hooks/useJoinedGatherings';
import { useGatheringButtonState } from '@/hooks/useGatheringButtonState';
import { useGatheringHandlers } from '@/hooks/useGatheringHandler';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

import { reviewService } from '@/services/reviews/reviewService';

import { IParticipant } from '@/types/gatherings';

export default function GroupDetailPage() {
  // Router & Params
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Auth & User
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const userId = user?.id ?? null;

  // Local State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Data Fetching
  const { gathering, uiData, isLoading, isError } = useGatheringDetail(id, userId);
  const { data: participantsData } = useGatheringParticipants(id);
  const { data: joinedGatherings } = useJoinedGatherings(userId, isAuthenticated);

  // 내 리뷰 조회
  const { data: myReviews } = useQuery({
    queryKey: ['myReview', id, userId],
    queryFn: () =>
      reviewService.getReviews({
        gatheringId: Number(id),
        userId: userId!,
      }),
    enabled: !!id && !!userId,
  });

  // 이벤트 핸들러
  const { handleJoin, handleLeave, handleCancel, handleShare, isJoining, isLeaving, isCanceling } =
    useGatheringHandlers({
      gatheringId: id,
      userId,
      isAuthenticated,
    });

  // 버튼 상태 계산
  const {
    joined,
    currentParticipantCount,
    isOpenConfirmed,
    isReviewed,
    isCompleted,
    isRegistrationClosed,
  } = useGatheringButtonState({
    gathering,
    participantsData,
    joinedGatherings,
    myReviews,
    gatheringId: id,
    userId,
    minParticipants: uiData?.minParticipants,
  });

  // 리뷰 작성하기
  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  // 리뷰 작성 성공 시 콜백 추가
  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['myReview', id, userId] });
    queryClient.invalidateQueries({ queryKey: ['reviews', Number(id)] });
    setIsReviewModalOpen(false);
  };

  // 로딩/에러 처리
  if (isLoading)
    return (
      <main className="space-y-8 px-0 py-10">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <div className="relative h-60 w-full overflow-hidden rounded-md bg-gray-100 shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl" />
          <div className="flex flex-col justify-between gap-4">
            <GroupDetailCardSkeleton />
            <GroupDetailParticipationSkeleton />
          </div>
        </section>

        <section className="mt-6 sm:mt-12 md:mt-16">
          <GroupDetailReviewListSkeleton />
        </section>
      </main>
    );

  if (isError || !uiData)
    return <div className="p-10 text-red-500">모임 정보를 불러올 수 없습니다.</div>;

  return (
    <main className="px-0 py-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-amber-50 shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl">
          <Image
            src={uiData?.image ?? '/images/find_banner.png'}
            alt={'모임 대표이미지'}
            fill
            className="object-cover"
          />
        </div>

        {/* 상세 헤더 */}
        <div className="flex flex-col justify-between gap-4">
          <GroupDetailCard
            data={uiData}
            isHost={uiData.isHost}
            joined={joined}
            isCompleted={isCompleted}
            isReviewed={isReviewed}
            isRegistrationClosed={isRegistrationClosed}
            isOpenConfirmed={isOpenConfirmed}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onCancel={handleCancel}
            onShare={handleShare}
            onWriteReview={handleWriteReview}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isCanceling={isCanceling}
          />

          <GroupDetailParticipation
            current={currentParticipantCount}
            max={uiData.capacity}
            min={uiData.minParticipants}
            participants={
              participantsData?.map((p: IParticipant) => ({
                id: p.User.id,
                image: p.User.image || '/images/avatar-default.png',
              })) ?? []
            }
            showConfirm
          />
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mt-6 sm:mt-12 md:mt-16">
        {uiData && <GroupDetailReviewList gatheringId={uiData.id} />}
      </section>

      {/* 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <WriteReviewModal
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          ApiRequestProps={{ gatheringId: Number(id) }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </main>
  );
}
