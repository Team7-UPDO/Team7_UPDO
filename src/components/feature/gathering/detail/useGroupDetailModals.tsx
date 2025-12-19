'use client';

import { useCallback, useState } from 'react';

import GroupDetailReviewModal from './GroupDetailReviewModal';
import GroupDetailLoginModal from './GroupDetailLoginModal';
import GroupDetailCancelModal from './GroupDetailCancelModal';

interface UseGroupDetailModalsParams {
  gatheringId: number;
  onCancel: () => void;
  onReviewSuccess: () => void;
}

export function useGroupDetailModals({
  gatheringId,
  onCancel,
  onReviewSuccess,
}: UseGroupDetailModalsParams) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const requestLogin = useCallback(() => setLoginModalOpen(true), []);
  const requestCancel = useCallback(() => setCancelModalOpen(true), []);
  const requestReview = useCallback(() => setReviewModalOpen(true), []);

  const handleReviewSuccess = async () => {
    await onReviewSuccess();
    setReviewModalOpen(false);
  };

  const modals = (
    <>
      <GroupDetailReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        gatheringId={gatheringId}
        onSuccess={handleReviewSuccess}
      />

      <GroupDetailLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      <GroupDetailCancelModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        onConfirm={onCancel}
      />
    </>
  );

  return {
    requestLogin,
    requestCancel,
    requestReview,
    modals,
  };
}
