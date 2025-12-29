'use client';

import { useRouter } from 'next/navigation';

import { ConfirmModal } from '@/components/ui/Modal';

interface GroupDetailLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GroupDetailLoginModal({ open, onOpenChange }: GroupDetailLoginModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onOpenChange(false);
    router.push('/login');
  };

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      content={`로그인이 필요한 서비스입니다.
        로그인 페이지로 이동할까요?`}
      onConfirm={handleConfirm}
    />
  );
}
