'use client';

import { ConfirmModal } from '@/components/ui/Modal';

interface GroupDetailCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function GroupDetailCancelModal({
  open,
  onOpenChange,
  onConfirm,
}: GroupDetailCancelModalProps) {
  const handleConfirm = () => onConfirm();

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      content={`모임을 삭제하시겠습니까?
        삭제 후에는 되돌릴 수 없습니다.`}
      onConfirm={handleConfirm}
    />
  );
}
