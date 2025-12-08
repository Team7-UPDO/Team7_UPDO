import { useQuery } from '@tanstack/react-query';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { queryKeys } from '@/constants/queryKeys';

export function useJoinedGatherings() {
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  return useQuery({
    queryKey: queryKeys.gatherings.my.joinedGatherings(user?.id ?? null),
    queryFn: () => gatheringService.getJoinedGatherings(),
    enabled: !!user?.id && isAuthenticated,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 1000 * 60 * 30,
  });
}
