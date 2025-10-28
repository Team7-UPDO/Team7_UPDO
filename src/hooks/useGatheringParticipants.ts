import { gatheringService } from '@/services/gatherings/gatheringService';
import { useQuery } from '@tanstack/react-query';

export function useGatheringParticipants(gatheringId: string | number) {
  const { data: participantsData } = useQuery({
    queryKey: ['gatheringParticipants', gatheringId],
    queryFn: () => gatheringService.getParticipants(Number(gatheringId)),
    enabled: !!gatheringId,
  });

  return {
    data: participantsData,
  };
}
