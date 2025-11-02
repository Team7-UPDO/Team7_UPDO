'use client';

import { create } from 'zustand';
import type { IUser } from '@/types/auths';
import { authService } from '@/services/auths/authService';

export interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;

  setUser: (u: IUser | null) => void;
  clear: () => void;
  fetchMe: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: u => set({ user: u }),
  clear: () => set({ user: null, isLoading: false, error: null }),

  // 사용자 로딩 (1회만 호출)
  fetchMe: async () => {
    if (get().user || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const me = await authService.getUser();
      set({ user: me as IUser, isLoading: false });
    } catch {
      set({ user: null, isLoading: false, error: '사용자 정보를 불러오지 못했어요.' });
    }
  },
}));
