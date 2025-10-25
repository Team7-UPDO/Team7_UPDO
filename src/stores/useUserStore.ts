'use client';

import { create } from 'zustand';
import type { IUser } from '@/types/auths';
import { authService } from '@/services/auths/authService';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;

  setUser: (u: IUser | null) => void;
  patchUser: (u: Partial<IUser>) => void;
  clear: () => void;

  fetchMe: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: u => set({ user: u }),
      patchUser: u => {
        const cur = get().user;
        if (!cur) return;
        set({ user: { ...cur, ...u } as IUser });
      },

      clear: () => set({ user: null, isLoading: false, error: null }),

      fetchMe: async () => {
        if (get().user || get().isLoading) return; // 이미 복원된 사용자 정보(local)가 있거나 로딩 중이면 재호출 방지

        set({ isLoading: true, error: null });
        try {
          const me = await authService.getUser();
          set({ user: me as IUser, isLoading: false });
        } catch {
          set({
            user: null,
            isLoading: false,
            error: '사용자 정보를 불러오지 못했어요.',
          });
        }
      },
    }),
    {
      name: 'user-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user }),
    },
  ),
);
