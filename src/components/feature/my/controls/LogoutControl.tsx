'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/Modal';

import { useAuthStore } from '@/stores/useAuthStore';

export default function LogoutControl() {
  const [open, setOpen] = useState(false);

  const { logout } = useAuthStore();

  const router = useRouter();
  const qc = useQueryClient();

  const { showToast } = useToast();

  const handleConfirm = () => {
    try {
      logout();
      qc.clear();
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
