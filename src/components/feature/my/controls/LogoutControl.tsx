'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Icon from '@/components/ui/Icon';
import { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LogoutControl() {
  const [open, setOpen] = useState(false);

  const { logout } = useAuthStore();

  const router = useRouter();
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const handleConfirm = () => {
    try {
      logout();
      queryClient.clear();
      showToast('로그아웃에 성공하였습니다.', 'success');
      setOpen(false);
      router.push('/');
    } catch {
      showToast('로그아웃에 실패하였습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
  };

  return (
    <>
      <button aria-label="로그아웃" onClick={() => setOpen(true)} className="cursor-pointer">
        <Icon name="logout" size={24} />
      </button>
      {open && (
        <ConfirmModal
          open={open}
          onOpenChange={setOpen}
          content="로그아웃 하시겠습니까?"
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
