'use client';

import { useState } from 'react';

import WriteReviewModal from '@/components/feature/review/WriteReviewModal';
import { Button } from '@/components/ui/Button';

type WriteReviewControlProps = {
  gatheringId: number;
  btnClassname?: string;
};

export function WriteReviewControl({ gatheringId, btnClassname }: WriteReviewControlProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={btnClassname} onClick={() => setOpen(true)}>
        리뷰 작성하기
      </Button>
      {open && (
        <WriteReviewModal open={open} onOpenChange={setOpen} ApiRequestProps={{ gatheringId }} />
      )}
    </>
  );
}
