'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  const label = isAuthenticated
    ? `${user?.name ?? '내 계정'} 프로필로 이동`
    : '로그인 또는 회원가입 페이지로 이동';

  return (
    <Link
      href={isAuthenticated ? '/mypage' : '/login'}
      aria-label={label}
      className="flex-shrink-0 overflow-hidden rounded-full transition-opacity hover:opacity-80 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:outline-none md:mx-[5px]">
      <div className="relative h-8 w-8 sm:h-11 sm:w-11">
        <Image
          src={user?.image || '/images/profile.webp'}
          alt=""
          fill
          className="rounded-full object-cover"
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </div>
    </Link>
  );
}
