import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/Toast';
import { queryKeys } from '@/constants/queryKeys';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { useUserStore } from '@/stores/useUserStore';
import type { GetJoinedGatheringsResponse } from '@/types/gatherings';
import { copyToClipboard } from '@/utils/clipboard';

interface UseGatheringMutationsParams {
  gatheringId: number;
}

export function useGatheringMutations({ gatheringId }: UseGatheringMutationsParams) {
  const { user } = useUserStore();
  const { removeFavorite } = useFavoriteStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const joinedKey = queryKeys.gatherings.my.joinedGatherings(user?.id ?? null);

  const invalidateGatheringQueries = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.participants(gatheringId) });

    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.my.all(user.id) });
    }

    queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
  };

  // 참여하기
  const joinMutation = useMutation({
    mutationFn: () => gatheringService.joinGathering(gatheringId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: joinedKey });
      const prev = queryClient.getQueryData<GetJoinedGatheringsResponse>(joinedKey);
      return { prev };
    },
    onSuccess: () => {
      showToast('모임에 참여했습니다!', 'success');
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(joinedKey, context.prev);
      }
      showToast('모임 참여 요청에 실패했습니다.', 'error');
    },
    onSettled: () => {
      invalidateGatheringQueries();
    },
  });

  // 참여 취소하기
  const leaveMutation = useMutation({
    mutationFn: () => gatheringService.leaveGathering(gatheringId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: joinedKey });
      const prev = queryClient.getQueryData<GetJoinedGatheringsResponse>(joinedKey);
      return { prev };
    },
    onSuccess: () => {
      showToast('모임 참여를 취소했습니다.', 'info');
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(joinedKey, context.prev);
      }
      showToast('모임 참여 취소가 실패했습니다.', 'error');
    },
    onSettled: () => {
      invalidateGatheringQueries();
    },
  });

  // 모임 삭제
  const cancelMutation = useMutation({
    mutationFn: () => gatheringService.cancelGathering(gatheringId),
    onSuccess: () => {
      removeFavorite(gatheringId);
      showToast('모임이 삭제되었습니다.', 'success');

      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.my.all(user.id) });
      }

      setTimeout(() => router.replace('/gathering'), 1000);
    },
    onError: () => {
      showToast('모임이 삭제되지 않았습니다.', 'error');
    },
  });

  // 공유하기
  const handleShare = async () => {
    const ok = await copyToClipboard(window.location.href);
    showToast(
      ok ? '링크가 복사되었습니다!' : '링크가 복사되지 않았습니다!',
      ok ? 'success' : 'error',
    );
  };

  return {
    joinMutation,
    leaveMutation,
    cancelMutation,

    // 핸들러
    handleJoin: () => joinMutation.mutate(),
    handleLeave: () => leaveMutation.mutate(),
    handleCancel: () => cancelMutation.mutate(),
    handleShare,

    isJoining: joinMutation.isPending,
    isLeaving: leaveMutation.isPending,
    isCanceling: cancelMutation.isPending,
  };
}
