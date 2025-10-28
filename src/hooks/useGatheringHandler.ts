import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Toast';
import { gatheringService } from '@/services/gatherings/gatheringService';
import { copyToClipboard } from '@/utils/clipboard';

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
      queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', gatheringId] });
      queryClient.invalidateQueries({ queryKey: ['joinedGatherings', userId] });
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
      queryClient.invalidateQueries({ queryKey: ['gatheringParticipants', gatheringId] });
      queryClient.invalidateQueries({ queryKey: ['joinedGatherings', userId] });
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
      showToast('모임이 삭제되었습니다.', 'success');

      // 삭제 후: 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['gatherings'] });
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
