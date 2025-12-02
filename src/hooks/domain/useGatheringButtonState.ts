import { isClosed } from '@/utils/date';
import type { IGathering, IJoinedGathering, IParticipant } from '@/types/gatherings';
import type { IReviewWithRelations } from '@/types/reviews';

interface UseGatheringButtonStateParams {
  gathering: IGathering | null | undefined;
  participantsData: IParticipant[] | undefined;
  joinedGatherings: IJoinedGathering[] | undefined;
  myReviews: IReviewWithRelations[] | undefined;
  gatheringId: string | number;
  userId: number | null;
  minParticipants?: number;
}

export function useGatheringButtonState({
  gathering,
  participantsData,
  joinedGatherings,
  myReviews,
  gatheringId,
  userId,
  minParticipants,
}: UseGatheringButtonStateParams) {
  // 참가 여부 확인
  const joined = joinedGatherings?.some(g => g.id === Number(gatheringId)) ?? false;

  // 참가자 수 계산
  const currentParticipantCount = participantsData?.length ?? gathering?.participantCount ?? 0;
  const capacity = gathering?.capacity ?? 20;

  // 정원 초과 여부
  const isFull = currentParticipantCount >= capacity;

  // 개설 확정 여부 (최소 인원 충족)
  const minRequired = minParticipants ?? 5;
  const isOpenConfirmed = currentParticipantCount >= minRequired;

  // 리뷰 작성 여부
  const isReviewed = (myReviews?.length ?? 0) > 0;

  // 모임 완료 여부 (날짜 지남)
  const isCompleted = isClosed(gathering?.dateTime);

  // 모집 마감 여부
  const isRegistrationClosed = isClosed(gathering?.registrationEnd);

  // 삭제 여부
  const isCanceled = !!gathering?.canceledAt;

  return {
    joined,
    userId,
    currentParticipantCount,
    capacity,
    minRequired,
    isOpenConfirmed,
    isReviewed,
    isCompleted,
    isRegistrationClosed,
    isFull,
    isCanceled,
  };
}
