'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import GroupDetailCard from '@/components/feature/gathering/detail/GroupDetailCard';
import GroupDetailParticipation from '@/components/feature/gathering/detail/GroupDetailParticipationCard';
import GroupDetailReviewList from '@/components/feature/gathering/detail/GroupDetailReviewList';
import { useGroupDetailModals } from '@/components/feature/gathering/detail/useGroupDetailModals';

import GroupDetailCardSkeleton from '@/components/ui/Skeleton/GroupDetailCardSkeleton';
import GroupDetailParticipationSkeleton from '@/components/ui/Skeleton/GroupDetailParticipationSkeleton';
import GroupDetailReviewListSkeleton from '@/components/ui/Skeleton/GroupDetailReviewListSkeleton';

import { useGatheringDetail } from '@/hooks/queries/gatherings/useGatheringDetail';
import { useGatheringParticipants } from '@/hooks/queries/gatherings/useGatheringParticipants';
import { useJoinedGatherings } from '@/hooks/queries/gatherings/useJoinedGatherings';
import { useGatheringMutations } from '@/hooks/mutations/useGatheringMutations';
import { useGatheringReview } from '@/hooks/mutations/useGatheringReview';
import { useGatheringRedirect } from '@/hooks/domain/useGatheringRedirect';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

interface GroupDetailSectionProps {
  gatheringId: string;
}

export default function GroupDetailSection({ gatheringId }: GroupDetailSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const userId = user?.id ?? null;

  const {
    gathering,
    uiData,
    isLoading: detailLoading,
    isError,
  } = useGatheringDetail(gatheringId, userId);
  const {
    data: participantsData,
    participants,
    isLoading: participantsLoading,
  } = useGatheringParticipants(gatheringId);
  const { data: joinedGatherings } = useJoinedGatherings();

  const { myReviews, handleReviewSuccess } = useGatheringReview({ gatheringId, userId });

  const { handleJoin, handleLeave, handleCancel, handleShare, isJoining, isLeaving, isCanceling } =
    useGatheringMutations({
      gatheringId: Number(gatheringId),
    });

  const { requestLogin, requestCancel, requestReview, modals } = useGroupDetailModals({
    gatheringId: Number(gatheringId),
    onCancel: handleCancel,
    onReviewSuccess: handleReviewSuccess,
  });

  const isCanceled = !!gathering?.canceledAt;
  useGatheringRedirect(isCanceled, detailLoading);

  const currentParticipantCount = useMemo(
    () => participantsData?.length ?? gathering?.participantCount ?? uiData?.participantCount ?? 0,
    [gathering?.participantCount, participantsData?.length, uiData?.participantCount],
  );

  if (detailLoading || participantsLoading)
    return (
      <main className="px-0 py-10" aria-busy="true">
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
            alt={uiData?.name ? `${uiData.name} main image` : 'Gathering main image'}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <GroupDetailCard
            data={uiData}
            isHost={uiData.isHost}
            userId={userId}
            participantsData={participantsData}
            joinedGatherings={joinedGatherings}
            myReviews={myReviews}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onCancel={requestCancel}
            onShare={handleShare}
            onWriteReview={() => {
              requestReview();
            }}
            onRequireLogin={requestLogin}
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

      <section className="mt-6 sm:mt-12 md:mt-16">
        {uiData && <GroupDetailReviewList gatheringId={uiData.id} />}
      </section>

      {modals}
    </main>
  );
}
