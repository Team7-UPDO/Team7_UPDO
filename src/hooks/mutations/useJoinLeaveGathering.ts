import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinGathering, leaveGathering } from '@/services/gatherings/gatheringService';
import { useUserStore } from '@/stores/useUserStore';
import type { GetJoinedGatheringsResponse } from '@/types/gatherings';
import { queryKey } from '@/constants/queryKeys';

export function useJoinLeaveGathering(gatheringId?: number) {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const joinedKey = queryKey.joinedGatherings(user?.id ?? null);

  const invalidateParticipants = (id?: number) => {
    const targetId = typeof id === 'number' ? id : gatheringId;
    if (typeof targetId === 'number') {
      queryClient.invalidateQueries({ queryKey: queryKey.participants(targetId) });
    }
  };

  // 참여
  const joinMutation = useMutation({
    mutationFn: (id: number) => joinGathering(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: joinedKey });
      const prev = queryClient.getQueryData<GetJoinedGatheringsResponse>(joinedKey);
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(joinedKey, context.prev);
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: joinedKey });
      invalidateParticipants(id);
      queryClient.invalidateQueries({ queryKey: queryKey.gatherings() });
      queryClient.invalidateQueries({ queryKey: queryKey.myMeetings() });
    },
  });

  //  참여 취소
  const leaveMutation = useMutation({
    mutationFn: (id: number) => leaveGathering(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: joinedKey });
      const prev = queryClient.getQueryData<GetJoinedGatheringsResponse>(joinedKey);
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(joinedKey, context.prev);
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: joinedKey });
      invalidateParticipants(id);
      queryClient.invalidateQueries({ queryKey: queryKey.gatherings() });
      queryClient.invalidateQueries({ queryKey: queryKey.myMeetings() });
    },
  });

  return {
    joinMutation,
    leaveMutation,
  };
}
