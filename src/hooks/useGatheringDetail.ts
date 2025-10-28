import { useQuery } from '@tanstack/react-query';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { mapGatheringToUI } from '@/utils/mapping';

export function useGatheringDetail(gatheringId: string | number, userId: number | null) {
  const {
    data: gathering,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['gatheringDetail', gatheringId],
    queryFn: async () => {
      const res = await gatheringService.getGatheringDetail(Number(gatheringId));
      return res;
    },
    enabled: !!gatheringId,
    staleTime: 1000 * 60 * 3,
  });
  const uiData = gathering ? mapGatheringToUI(gathering, userId) : null;

  return {
    uiData,
    gathering,
    isLoading,
    isError,
  };
}
