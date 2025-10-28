import { useQuery } from '@tanstack/react-query';
import { gatheringService } from '@/services/gatherings/gatheringService';

export function useJoinedGatherings(userId: number | null, isAuthenticated: boolean) {
  return useQuery({
    queryKey: ['joinedGatherings', userId],
    queryFn: () => gatheringService.getJoinedGatherings(),
    enabled: !!userId && isAuthenticated,
    staleTime: 1000 * 60 * 3,
  });
}
