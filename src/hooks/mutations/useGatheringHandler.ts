import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Toast';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { copyToClipboard } from '@/utils/clipboard';
import { queryKeys } from '@/constants/queryKeys';
import { useFavoriteStore } from '@/stores/useFavoriteStore';

interface useGatheringHandlersParams {
  gatheringId: string | number;
  userId: number | null;
  isAuthenticated: boolean;
}

export function useGatheringHandlers({
  gatheringId,
  userId,
  isAuthenticated,
}: useGatheringHandlersParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { removeFavorite } = useFavoriteStore();

  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  // 참여하기
  const handleJoin = async () => {
    if (!isAuthenticated) {
      showToast('로그인 후 이용 가능합니다.', 'error');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }
    setIsJoining(true);
    try {
      await gatheringService.joinGathering(Number(gatheringId));
      showToast('모임에 참여했습니다!', 'success');

      // 모든 관련 쿼리 무효화
      await Promise.all([
        // 모임 상세 정보 갱신 (버튼 상태 변경을 위해)
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.detail(gatheringId),
        }),
        // 참가자 목록 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.participants(Number(gatheringId)),
        }),
        // 내가 참여한 모임 목록 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.my.joinedGatherings(userId),
        }),
        // 내가 참여한 모임 무한스크롤 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.my.joinedGatheringsInfinite(userId),
        }),
      ]);
    } catch {
      showToast('모임 참여 요청에 실패했습니다.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  // 참여 취소하기
  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await gatheringService.leaveGathering(Number(gatheringId));
      showToast('모임 참여를 취소했습니다.', 'info');

      // 모든 관련 쿼리 무효화
      await Promise.all([
        // 모임 상세 정보 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.detail(gatheringId),
        }),
        // 참가자 목록 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.participants(Number(gatheringId)),
        }),
        // 내가 참여한 모임 목록 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.my.joinedGatherings(userId),
        }),
        // 내가 참여한 모임 무한스크롤 갱신
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.my.joinedGatheringsInfinite(userId),
        }),
      ]);
    } catch {
      showToast('모임 참여 취소가 실패했습니다.', 'error');
    } finally {
      setIsLeaving(false);
    }
  };

  // 모임 삭제 (주최자인 경우)
  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      await gatheringService.cancelGathering(Number(gatheringId));

      // 찜하기 해제 (찜한 상태라면 자동 해제)
      removeFavorite(Number(gatheringId));

      showToast('모임이 삭제되었습니다.', 'success');

      // 삭제 후: 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatherings.my.createdGatherings(userId),
        });
      }
      setTimeout(() => router.replace('/gathering'), 1000);
    } catch {
      showToast('모임이 삭제되지 않았습니다.', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  // 공유하기
  const handleShare = async () => {
    const ok = await copyToClipboard(window.location.href);
    showToast(
      ok ? '링크가 복사되었습니다!' : '링크가 복사되지 않았습니다!',
      ok ? 'success' : 'error',
    );
  };

  return {
    handleJoin,
    handleLeave,
    handleCancel,
    handleShare,
    isJoining,
    isLeaving,
    isCanceling,
  };
}
