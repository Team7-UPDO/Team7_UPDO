import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gatheringService } from '@/services/gatherings/gatheringService';
import type { IParticipant } from '@/types/gatherings';
interface ParticipantUI {
  id: number;
  image: string;
}

export function useGatheringParticipants(gatheringId: string | number) {
  const numericId = Number(gatheringId);

  const { data: participantsData, ...rest } = useQuery({
    queryKey: ['gatheringParticipants', numericId],
    queryFn: () => gatheringService.getParticipants(numericId),
    enabled: Number.isFinite(numericId),
  });

  // UI용 데이터 변환
  const participants: ParticipantUI[] = useMemo(
    () =>
      participantsData?.map((p: IParticipant) => ({
        id: p.User.id,
        image: p.User.image || '/images/avatar-default.png',
      })) ?? [],
    [participantsData],
  );

  const count = participantsData?.length ?? 0;

  return {
    data: participantsData,
    participants,
    count,
    ...rest,
  };
}
