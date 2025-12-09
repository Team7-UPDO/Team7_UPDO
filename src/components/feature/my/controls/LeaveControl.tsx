'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Toast';
import { queryKeys } from '@/constants/queryKeys';
import { leaveGathering } from '@/services/gatherings/gatheringService';
import { Button } from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/Modal/ConfirmModal';
import { useUserStore } from '@/stores/useUserStore';

type LeaveControlProps = {
  gatheringId: number;
  className?: string;
  disabled?: boolean;
  onAfter?: () => void;
};

export function LeaveControl({ gatheringId, className, disabled, onAfter }: LeaveControlProps) {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: () => leaveGathering(gatheringId),
    onSuccess: () => {
      showToast('참여 취소가 완료되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.my.all(user?.id ?? null) });
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.participants(gatheringId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.gatherings.all() });
      onAfter?.();
    },
    onError: () => {
      showToast('삭제하기 실패하였습니다.', 'error');
    },
  });

  const confirm = () => {
    deleteMutation.mutate();
    setOpen(false);
  };

  return (
    <>
      <Button
        className={className}
        onClick={() => setOpen(true)}
        disabled={disabled || deleteMutation.isPending}>
        {deleteMutation.isPending ? '취소 중…' : '참여 취소하기'}
      </Button>
      {open && (
        <ConfirmModal
          open={open}
          onOpenChange={setOpen}
          content="이 모임의 참여를 취소하시겠습니까?"
          onConfirm={confirm}
        />
      )}
    </>
  );
}
