import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getParticipants } from '@/services/gatherings/gatheringService';
import { queryKey } from '@/constants/queryKeys';

export function useParticipants(gatheringId?: number) {
  const numGatheringId = typeof gatheringId === 'number' ? gatheringId : undefined;

  const { data } = useQuery({
    queryKey: queryKey.participants(numGatheringId),
    queryFn: () => getParticipants(numGatheringId!),
    enabled: typeof numGatheringId === 'number',
    staleTime: 1000 * 60 * 3,
  });

  const participantCount = useMemo(() => data?.length ?? 0, [data]);

  return {
    participantCount,
  };
}
