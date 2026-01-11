'use client';

import { useMemo } from 'react';

import GroupDetailCanceled from '@/components/feature/gathering/detail/GroupDetailCanceled';
import GroupDetailContent from '@/components/feature/gathering/detail/GroupDetailContent';
import GroupDetailError from '@/components/feature/gathering/detail/GroupDetailError';
import GroupDetailLoading from '@/components/feature/gathering/detail/GroupDetailLoading';
import { useGroupDetailModals } from '@/components/feature/gathering/detail/useGroupDetailModals';

import { useGatheringDetail } from '@/hooks/queries/gatherings/useGatheringDetail';
import { useGatheringParticipants } from '@/hooks/queries/gatherings/useGatheringParticipants';
import { useJoinedGatherings } from '@/hooks/queries/gatherings/useJoinedGatherings';
import { useGatheringMutations } from '@/hooks/mutations/useGatheringMutations';
import { useGatheringReview } from '@/hooks/mutations/useGatheringReview';
import { useGatheringRedirect } from '@/hooks/domain/useGatheringRedirect';

import { useUserStore } from '@/stores/useUserStore';

interface GroupDetailSectionProps {
  gatheringId: string;
}

export default function GroupDetailSection({ gatheringId }: GroupDetailSectionProps) {
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

  const isLoading = detailLoading || participantsLoading;

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

  let content: JSX.Element;
  if (isLoading) {
    content = <GroupDetailLoading />;
  } else if (isError || !uiData) {
    content = <GroupDetailError />;
  } else if (isCanceled) {
    content = <GroupDetailCanceled />;
  } else {
    content = (
      <GroupDetailContent
        uiData={uiData}
        userId={userId}
        participantsData={participantsData}
        participants={participants}
        joinedGatherings={joinedGatherings}
        myReviews={myReviews}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onCancel={requestCancel}
        onShare={handleShare}
        onWriteReview={requestReview}
        onRequireLogin={requestLogin}
        isJoining={isJoining}
        isLeaving={isLeaving}
        isCanceling={isCanceling}
        currentParticipantCount={currentParticipantCount}
        modals={modals}
      />
    );
  }

  return (
    <main className="px-0 py-10" aria-busy={isLoading}>
      {content}
    </main>
  );
}
