import { useState } from 'react';
import { useLeaveControl } from '@/hooks/useLeaveControl';
import { Button } from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/Modal/ConfirmModal';

type LeaveControlProps = {
  gatheringId: number;
  className?: string;
  disabled?: boolean;
  onAfter?: () => void; // 선택: 화면별 후처리 필요 시 사용
};

export function LeaveControl({ gatheringId, className, disabled, onAfter }: LeaveControlProps) {
  const [open, setOpen] = useState(false);
  const { leave, isLeaving } = useLeaveControl();

  const confirm = () => {
    leave(gatheringId);
    setOpen(false);
    onAfter?.();
  };

  return (
    <>
      <Button
        className={className}
        onClick={() => setOpen(true)}
        disabled={disabled || isLeaving(gatheringId)}
        aria-disabled={disabled || isLeaving(gatheringId)}>
        {isLeaving(gatheringId) ? '취소 중…' : '참여 취소하기'}
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
