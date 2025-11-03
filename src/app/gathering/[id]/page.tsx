'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

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
import { useGatheringRedirect } from '@/hooks/useGatheringRedirect';
import { useGatheringReview } from '@/hooks/useGatheringReview';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const userId = user?.id ?? null;

  const { gathering, uiData, isLoading, isError } = useGatheringDetail(id, userId);
  const { data: participantsData, participants } = useGatheringParticipants(id);
  const { data: joinedGatherings } = useJoinedGatherings(userId, isAuthenticated);

  const {
    myReviews,
    isReviewed,
    isReviewModalOpen,
    handleOpenReviewModal,
    handleReviewSuccess,
    setIsReviewModalOpen,
  } = useGatheringReview({ gatheringId: id, userId });

  const { handleJoin, handleLeave, handleCancel, handleShare, isJoining, isLeaving, isCanceling } =
    useGatheringHandlers({
      gatheringId: id,
      userId,
      isAuthenticated,
    });

  const {
    joined,
    currentParticipantCount,
    isOpenConfirmed,
    isCompleted,
    isRegistrationClosed,
    isFull,
    isCanceled,
  } = useGatheringButtonState({
    gathering,
    participantsData,
    joinedGatherings,
    myReviews,
    gatheringId: id,
    userId,
    minParticipants: uiData?.minParticipants,
  });

  // 삭제된 모임 리다이렉트
  useGatheringRedirect(isCanceled, isLoading);

  // 로딩/에러 처리
  if (isLoading)
    return (
      <main aria-busy="true">
        <span className="sr-only">모임 정보 로딩 중</span>
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
    return (
      <div className="p-10 text-red-500" role="alert">
        모임 정보를 불러올 수 없습니다.
      </div>
    );

  // 삭제된 모임
  if (isCanceled) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 py-12" role="alert">
          <Image src="/images/empty.webp" alt="" width={171} height={115} className="opacity-70" />
          <p className="text-sm text-gray-400 md:text-base">
            삭제된 모임입니다. 모임 찾기 페이지로 이동합니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-0 py-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-white shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl">
          <Image
            src={uiData?.image || '/images/detail_empty.webp'}
            alt={uiData?.name ? `${uiData.name} 모임 대표 이미지` : '모임 대표 이미지'}
            fill
            className="object-cover"
            priority
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
            isFull={isFull}
            isCanceled={isCanceled}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onCancel={handleCancel}
            onShare={handleShare}
            onWriteReview={handleOpenReviewModal}
            isJoining={isJoining}
            isLeaving={isLeaving}
            isCanceling={isCanceling}
          />

          <GroupDetailParticipation
            current={currentParticipantCount}
            max={uiData.capacity}
            min={uiData.minParticipants}
            participants={participants}
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
