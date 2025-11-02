import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from '@/stores/useUserStore';

interface FavoriteState {
  favorites: Record<string, number[]>;
  toggleFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  _hasHydrated: boolean;
  getFavorites: () => number[];
  getFavoriteCount: (userId?: string | number | null) => number;
  setHasHydrated: (state: boolean) => void;
}

const getCurrentUserKey = () => {
  const user = useUserStore.getState().user;
  return user?.id?.toString() || 'guest';
};

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: {},
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      toggleFavorite: (id: number) => {
        const key = getCurrentUserKey();

        set(state => {
          const currentFavorites = state.favorites[key] || [];
          const updatedFavorites = currentFavorites.includes(id)
            ? currentFavorites.filter(favId => favId !== id)
            : [...currentFavorites, id];

          return {
            favorites: {
              ...state.favorites,
              [key]: updatedFavorites,
            },
          };
        });
      },

      // 찜하기 강제 해제
      removeFavorite: (id: number) => {
        const key = getCurrentUserKey();

        set(state => {
          const currentFavorites = state.favorites[key] || [];

          // 이미 찜한 상태가 아니면 아무것도 안 함
          if (!currentFavorites.includes(id)) {
            return state;
          }

          return {
            favorites: {
              ...state.favorites,
              [key]: currentFavorites.filter(favId => favId !== id),
            },
          };
        });
      },

      isFavorite: (id: number) => {
        const key = getCurrentUserKey();
        const currentFavorites = get().favorites[key] || [];
        return currentFavorites.includes(id);
      },
      getFavoriteCount: (userId?: string | number | null) => {
        const key = userId != null ? String(userId) : 'guest';
        return get().favorites[key]?.length ?? 0;
      },
      getFavorites: () => {
        const key = getCurrentUserKey();
        return get().favorites[key] || [];
      },
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
if (typeof window !== 'undefined') {
  useFavoriteStore.persist.rehydrate();
}
