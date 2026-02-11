import { TAG_OPTIONS } from '@/constants';
import type { IGathering, IJoinedGathering, IParticipant } from '@/types/gatherings';
import type { IReviewWithRelations } from '@/types/reviews';
import { isClosed } from '@/utils/date';
import { LocationToTag } from '@/utils/mapping';

export interface UseButtonStateHandlers {
  onJoin?: () => void;
  onLeave?: () => void;
  onWriteReview?: () => void;
  onRequireLogin?: () => void;
}

export interface ButtonState {
  text: string;
  disabled: boolean;
  variant: 'primary' | 'secondary';
  action: 'join' | 'leave' | 'review' | null;
  onClick?: () => void;
}

type TopicType = 'growth' | 'learn' | 'challenge' | 'connect' | 'default';

export function isJoinedGathering(
  joinedGatherings: IJoinedGathering[] | undefined,
  gatheringId: number,
): boolean {
  return (joinedGatherings ?? []).some(g => Number(g.id) === gatheringId);
}

// 모임 상세 상태
interface GetGatheringDetailStateParams {
  gathering?: Partial<IGathering> | null;
  participantsData?: IParticipant[];
  joinedGatherings?: IJoinedGathering[];
  myReviews?: IReviewWithRelations[];
  gatheringId: number | string;
  userId: number | null;
  isAuthenticated: boolean;
  minParticipants?: number;
  handlers?: UseButtonStateHandlers;
  isJoining?: boolean;
  isLeaving?: boolean;
}

export function getGatheringDetailState({
  gathering,
  participantsData,
  joinedGatherings,
  myReviews,
  gatheringId,
  userId,
  isAuthenticated,
  minParticipants = 5,
  handlers,
  isJoining = false,
  isLeaving = false,
}: GetGatheringDetailStateParams) {
  // 참가 여부 확인
  const joinedFromParticipants =
    !!userId && participantsData?.some(p => p.userId === userId) === true;

  const joinedFromJoinedList = isJoinedGathering(joinedGatherings, Number(gatheringId));

  const joined = joinedFromParticipants || joinedFromJoinedList;

  // 참가자 수 계산
  const currentParticipantCount = participantsData?.length ?? gathering?.participantCount ?? 0;
  const capacity = gathering?.capacity ?? 20;

  // 정원 초과 여부
  const isFull = currentParticipantCount >= capacity;
  // 개설 확정 여부 (최소 인원 충족)
  const isOpenConfirmed = currentParticipantCount >= minParticipants;
  // 리뷰 작성 여부
  const isReviewed = (myReviews?.length ?? 0) > 0;

  // 모임 완료 여부 (날짜 지남)
  const isCompleted = isClosed(gathering?.dateTime);

  // 삭제 여부
  const isCanceled = !!gathering?.canceledAt;

  // 모집 마감 여부
  const isRegistrationClosed = isClosed(gathering?.registrationEnd);

  // 버튼 상태 결정
  const getButtonState = (): ButtonState | null => {
    if (!handlers) return null;
    // 삭제 여부
    if (isCanceled) {
      return {
        text: '삭제된 모임',
        disabled: true,
        variant: 'primary',
        action: null,
      };
    }

    if (isCompleted && !isOpenConfirmed) {
      return {
        text: '개설 취소',
        disabled: true,
        variant: 'primary',
        action: null,
      };
    }

    if (isCompleted) {
      if (joined) {
        if (isReviewed) {
          return {
            text: '참여 완료',
            disabled: true,
            variant: 'primary',
            action: null,
          };
        }

        return {
          text: '리뷰 작성하기',
          disabled: false,
          variant: 'primary',
          action: 'review',
          onClick: handlers.onWriteReview,
        };
      }

      return {
        text: '참여 기간 만료',
        disabled: true,
        variant: 'primary',
        action: null,
      };
    }

    if (isRegistrationClosed) {
      return {
        text: '참여 기간 만료',
        disabled: true,
        variant: 'primary',
        action: null,
      };
    }

    if (isFull && !joined) {
      return {
        text: '정원 마감',
        disabled: true,
        variant: 'primary',
        action: null,
      };
    }

    // 비로그인
    if (!isAuthenticated) {
      return {
        text: '참여하기',
        disabled: false,
        variant: 'primary',
        action: null,
        onClick: handlers.onRequireLogin,
      };
    }

    if (joined) {
      return {
        text: '참여 취소하기',
        disabled: isLeaving,
        variant: 'secondary',
        action: 'leave',
        onClick: handlers.onLeave,
      };
    }

    return {
      text: '참여하기',
      disabled: isJoining,
      variant: 'primary',
      action: 'join',
      onClick: handlers.onJoin,
    };
  };

  return {
    joined,
    userId,
    currentParticipantCount,
    capacity,
    minRequired: minParticipants,
    isOpenConfirmed,
    isReviewed,
    isCompleted,
    isRegistrationClosed,
    isFull,
    isCanceled,
    buttonState: getButtonState(),
  };
}

export function getGatheringCardState(
  location: string,
  capacity: number,
  participantCount: number,
  registrationEnd?: string,
) {
  const isFull = participantCount >= capacity;
  const isAllClosed = isClosed(registrationEnd) || isFull;
  const topic = LocationToTag(location) as TopicType;
  const safeCapacity = Math.max(1, capacity);
  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  return { isFull, isAllClosed, topic, safeCapacity, category };
}
