'use client';

import { useState } from 'react';

import Icon from '@/components/ui/Icon';
import EditProfileModal from '@/components/feature/my/EditProfileModal';

import { IUser } from '@/types/auths';
import { useUserStore } from '@/stores/useUserStore';

interface Props {
  user: IUser;
}

export default function EditProfileControl({ user }: Props) {
  const { setUser } = useUserStore(s => ({ setUser: s.setUser }));

  const [open, setOpen] = useState(false);

  const handleSaved = (next: Partial<IUser>) => {
    const merged = { ...user, ...next } as IUser;
    setUser(merged);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <EditProfileModal user={user} open={open} onOpenChange={setOpen} onSaved={handleSaved} />
      )}
      <button
        className="absolute top-6 right-3 cursor-pointer sm:top-8 md:top-auto"
        aria-label="프로필 수정"
        onClick={() => setOpen(true)}
        type="button">
        <Icon name="edit" />
      </button>
    </>
  );
}
