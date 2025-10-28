'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import EditProfileControl from '@/components/feature/my/controls/EditProfileControl';

import { useUserStore } from '@/stores/useUserStore';
import { useShallow } from 'zustand/react/shallow';

export default function UserProfileCard() {
  const { user, setUser } = useUserStore(useShallow(s => ({ user: s.user, setUser: s.setUser })));
  const guaranteedUser = user!; // AuthGuard로 null이 아님을 단언
  const { name, companyName, email } = guaranteedUser;

  const DEFAULT_AVATAR_SRC = '/images/avatar-default.png';
  const [avatarSrc, setAvatarSrc] = useState<string>(user?.image ?? DEFAULT_AVATAR_SRC);
  useEffect(() => {
    setAvatarSrc(user?.image ?? DEFAULT_AVATAR_SRC);
  }, [user?.image]);

  return (
    <div className="bg-grad-100-v relative flex w-full overflow-hidden rounded-2xl border border-purple-100 px-4 py-6 shadow-xl sm:rounded-3xl sm:px-6 sm:py-8 md:flex-col md:px-6 md:pt-5 md:pb-10">
      {/* 프로필 수정 버튼 (상단 우측 고정) */}
      <EditProfileControl user={guaranteedUser} setUser={setUser} />

      {/* 이미지 및 이름 */}
      <div className="mr-7 mb-0 flex flex-row items-center gap-3 md:mt-12 md:mr-0 md:mb-7 md:flex-col md:gap-5">
        <Image
          src={avatarSrc}
          alt={`${name ?? '사용자'} 프로필 이미지`}
          width={112}
          height={112}
          className="h-10 w-10 rounded-full object-cover shadow ring-2 ring-gray-100 sm:h-11 sm:w-11 md:h-28 md:w-28"
          onError={() => setAvatarSrc(DEFAULT_AVATAR_SRC)}
          priority
        />
        <div className="label sm:card-title text-center text-gray-900">{name}</div>
      </div>

      {/* 직업 및 이메일 (설명 목록으로 의미 부여) */}
      <div className="typo-body-sm sm:typo-body grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-3 border-l-[1px] border-black/10 pl-4 sm:pl-8 md:border-t-[1px] md:border-l-0 md:pt-8 md:pl-0">
        <div className="flex gap-5">
          <div className="text-gray-500">직업</div>
          <div className="text-gray-700">{companyName}</div>
        </div>

        <div className="flex min-w-0 gap-2">
          <div className="shrink-0 text-gray-500">이메일</div>
          <div className="truncate text-gray-700">{email}</div>
        </div>
      </div>
    </div>
  );
}
