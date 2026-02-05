import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { mapGatheringToUI } from '@/utils/mapping';

export function useGatheringDetail(gatheringId: string | number, userId: number | null) {
  const {
    data: gathering,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.gatherings.detail(gatheringId),
    queryFn: async () => {
      const res = await gatheringService.getGatheringDetail(Number(gatheringId));
      return res;
    },
    enabled: !!gatheringId,
    staleTime: 1000 * 30,
  });
  const uiData = gathering ? mapGatheringToUI(gathering, userId) : null;

  return {
    uiData,
    gathering,
    isLoading,
    isError,
  };
}
