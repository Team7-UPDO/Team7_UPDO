import Image from 'next/image';
import type { ReactNode } from 'react';

import GroupDetailCard from '@/components/feature/gathering/detail/GroupDetailCard';
import GroupDetailParticipation from '@/components/feature/gathering/detail/GroupDetailParticipationCard';
import GroupDetailReviewList from '@/components/feature/gathering/detail/GroupDetailReviewList';
import type { IJoinedGathering, IParticipant } from '@/types/gatherings';
import type { IReviewWithRelations } from '@/types/reviews';
import type { mapGatheringToUI } from '@/utils/mapping';

interface ParticipantAvatar {
  id: number;
  image: string;
}

type UiData = ReturnType<typeof mapGatheringToUI>;

interface GroupDetailContentProps {
  uiData: UiData;
  userId: number | null;
  participantsData?: IParticipant[];
  participants: ParticipantAvatar[];
  joinedGatherings?: IJoinedGathering[];
  myReviews: IReviewWithRelations[];
  onJoin: () => void;
  onLeave: () => void;
  onCancel: () => void;
  onShare: () => void;
  onWriteReview: () => void;
  onRequireLogin: () => void;
  isJoining: boolean;
  isLeaving: boolean;
  isCanceling: boolean;
  currentParticipantCount: number;
  modals: ReactNode;
}

export default function GroupDetailContent({
  uiData,
  userId,
  participantsData,
  participants,
  joinedGatherings,
  myReviews,
  onJoin,
  onLeave,
  onCancel,
  onShare,
  onWriteReview,
  onRequireLogin,
  isJoining,
  isLeaving,
  isCanceling,
  currentParticipantCount,
  modals,
}: GroupDetailContentProps) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative h-60 w-full overflow-hidden rounded-md bg-white shadow-sm sm:h-auto sm:rounded-md md:rounded-2xl">
          <Image
            src={uiData.image || '/images/detail_empty.webp'}
            alt={uiData.name ? `${uiData.name} main image` : 'Gathering main image'}
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
            onJoin={onJoin}
            onLeave={onLeave}
            onCancel={onCancel}
            onShare={onShare}
            onWriteReview={onWriteReview}
            onRequireLogin={onRequireLogin}
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
        <GroupDetailReviewList gatheringId={uiData.id} />
      </section>

      {modals}
    </>
  );
}
