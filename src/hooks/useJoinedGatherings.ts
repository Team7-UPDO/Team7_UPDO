import { useQuery } from '@tanstack/react-query';
import { gatheringService } from '@/services/gatherings/gatheringService';

export function useJoinedGatherings(userId: number | null, isAuthenticated: boolean) {
  const { data: joinedGatherings } = useQuery({
    queryKey: ['joinedGatherings', userId],
    queryFn: () => gatheringService.getJoinedGatherings(),
    enabled: !!userId && isAuthenticated,
    staleTime: 1000 * 60 * 3,
  });

  return {
    data: joinedGatherings,
  };
}
