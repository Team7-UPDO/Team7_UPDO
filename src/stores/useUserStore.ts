'use client';

import { create } from 'zustand';
import type { IUser } from '@/types/auths';
import { authService } from '@/services/auths/authService';

interface UserState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;

  setUser: (u: IUser | null) => void;
  updateUser: (patch: Partial<IUser>) => void;
  patchUser: (patch: Partial<IUser>) => void;
  clear: () => void;

  fetchMe: () => Promise<void>; // 초기 진입 시 1회 호출용
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: u => set({ user: u }),

  // 낙관적 업데이트: 부분 필드(patch) 병합
  updateUser: patch => {
    const cur = get().user;
    if (!cur) return;
    const next: IUser = { ...cur, ...patch } as IUser;
    const isSame = JSON.stringify(cur) === JSON.stringify(next);
    if (!isSame) set({ user: next });
  },

  // 과거 호환용
  patchUser: patch => get().updateUser(patch),

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
