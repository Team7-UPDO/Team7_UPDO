'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import WriteReviewModal from '@/components/feature/review/WriteReviewModal';

type WriteReviewControlProps = {
  gatheringId: number;
  className?: string;
};

export function WriteReviewControl({ gatheringId, className }: WriteReviewControlProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        리뷰 작성하기
      </Button>
      {open && (
        <WriteReviewModal open={open} onOpenChange={setOpen} ApiRequestProps={{ gatheringId }} />
      )}
    </>
  );
}
