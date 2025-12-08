'use client';

import { cn } from '@/utils/cn';
import { LocationToTag } from '@/utils/mapping';
import { TAG_OPTIONS } from '@/constants/tags';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGatheringButtonState } from '@/hooks/domain/useGatheringButtonState';

import GroupDetailCardHeader from './GroupDetailCardHeader';
import GroupDetailCardTopic from './GroupDetailCardTopic';
import GroupDetailCardAction from './GroupDetailCardAction';

import type { IGathering, IJoinedGathering, IParticipant } from '@/types/gatherings';
import type { IReviewWithRelations } from '@/types/reviews';

interface HeaderData {
  id: number;
  name: string;
  deadlineText: string;
  dateText: string;
  timeText: string;
  location: string;
  type: string;
}

interface GroupDetailCardProps {
  data: HeaderData & Partial<IGathering>;
  userId?: number | null;
  isHost?: boolean;
  participantsData?: IParticipant[];
  joinedGatherings?: IJoinedGathering[];
  myReviews?: IReviewWithRelations[];
  onJoin?: () => void;
  onLeave?: () => void;
  onCancel?: () => void;
  onShare?: () => void;
  onWriteReview?: () => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  isCanceling?: boolean;
}

export default function GroupDetailCard({
  data,
  userId = null,
  isHost = false,
  participantsData,
  joinedGatherings,
  myReviews,
  onJoin,
  onLeave,
  onCancel,
  onShare,
  onWriteReview,
  isJoining = false,
  isLeaving = false,
  isCanceling = false,
}: GroupDetailCardProps) {
  const { isAuthenticated } = useAuthStore();

  const topic = LocationToTag(data.location) as
    | 'growth'
    | 'learn'
    | 'challenge'
    | 'connect'
    | 'default';

  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  const { isCompleted, isRegistrationClosed, isFull, isCanceled, buttonState } =
    useGatheringButtonState({
      gathering: data,
      participantsData,
      joinedGatherings,
      myReviews,
      gatheringId: data.id,
      userId,
      isAuthenticated,
      handlers: { onJoin, onLeave, onWriteReview },
      isJoining,
      isLeaving,
    });

  const isClosed = isRegistrationClosed || isFull || isCompleted || isCanceled;

  return (
    <section
      className={cn(
        'bg-surface isolate flex flex-col gap-6 rounded-md p-5 shadow-md sm:rounded-md md:rounded-2xl md:p-10 lg:p-10',
      )}>
      <GroupDetailCardHeader
        deadlineText={data.deadlineText}
        dateText={data.dateText}
        timeText={data.timeText}
        topic={topic}
        isHost={isHost}
      />

      <GroupDetailCardTopic name={data.name} category={category} topic={topic} />

      <GroupDetailCardAction
        isHost={isHost}
        isClosed={isClosed}
        buttonState={buttonState}
        onCancel={onCancel}
        onShare={onShare}
        isCanceling={isCanceling}
        itemId={data.id}
      />
    </section>
  );
}
