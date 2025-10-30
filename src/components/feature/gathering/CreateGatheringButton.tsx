'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { IconButton } from '@/components/ui/IconButton';
import CreateGroupModal from '@/components/feature/group/CreateGroupModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { useInView } from 'react-intersection-observer';

export default function CreateGatheringButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      setIsCreateModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div ref={ref} aria-hidden className="pointer-events-none absolute top-[110px] h-px w-px" />
      <IconButton
        label="모임 만들기"
        className={`fixed right-8 bottom-16 shadow-lg transition-opacity duration-300 md:right-24 lg:right-32 ${
          inView ? 'opacity-100' : 'opacity-55 hover:opacity-100'
        }`}
        onClick={handleClick}
      />
      <CreateGroupModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <ConfirmModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        content="로그인 페이지로 이동할까요?"
        onConfirm={() => {
          setIsLoginModalOpen(false);
          router.push('/login');
        }}
      />
    </>
  );
}
