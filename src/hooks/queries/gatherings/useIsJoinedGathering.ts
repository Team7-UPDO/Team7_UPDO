import { useQuery } from '@tanstack/react-query';
import { getJoinedGatherings } from '@/services/gatherings/gatheringService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { queryKey } from '@/constants/queryKeys';

export function useIsJoinedGathering(gatheringId?: number) {
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();

  const enabled = isAuthenticated && !!user?.id;

  const joinedGatheringsQuery = useQuery({
    queryKey: queryKey.joinedGatherings(user?.id),
    queryFn: () => getJoinedGatherings(),
    enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 30,
  });

  const joinedGatherings = joinedGatheringsQuery.data ?? [];

  const isJoined =
    enabled && typeof gatheringId === 'number'
      ? joinedGatherings.some(g => g.id === gatheringId)
      : false;

  return {
    isJoined,
  };
}
