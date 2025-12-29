'use client';

import WriteReviewModal from '@/components/feature/review/WriteReviewModal';

interface GroupDetailReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gatheringId: number;
  onSuccess: () => void;
}

export default function GroupDetailReviewModal({
  open,
  onOpenChange,
  gatheringId,
  onSuccess,
}: GroupDetailReviewModalProps) {
  if (!open) return null;

  return (
    <WriteReviewModal
      open={open}
      onOpenChange={onOpenChange}
      ApiRequestProps={{ gatheringId }}
      onSuccess={onSuccess}
    />
  );
}
