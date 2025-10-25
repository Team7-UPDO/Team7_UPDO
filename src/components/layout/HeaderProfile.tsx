'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';

export default function HeaderProfile() {
  const { user } = useUserStore();
  const { isAuthenticated, checkTokenValidity } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    checkTokenValidity();
    setMounted(true);
  }, [checkTokenValidity]);
  if (!mounted) return null;

  return (
    <Link
      href={isAuthenticated ? '/mypage' : '/login'}
      className="flex-shrink-0 overflow-hidden rounded-full transition-opacity hover:opacity-80">
      <Image
        src={user?.image || '/images/profile.png'}
        alt={user?.name || '프로필'}
        width={43}
        height={43}
        className="h-8 w-8 rounded-full object-cover sm:h-11 sm:w-11 md:mx-[5px]"
      />
    </Link>
  );
}
