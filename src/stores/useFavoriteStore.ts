import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from '@/stores/useUserStore';

interface FavoriteState {
  favorites: Record<string, number[]>;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  getFavoriteCount: () => number;
  getFavorites: () => number[];
}

const getCurrentUserKey = () => {
  const user = useUserStore.getState().user;
  return user?.id?.toString() || 'guest';
};

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: {},

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

      isFavorite: (id: number) => {
        const key = getCurrentUserKey();
        const currentFavorites = get().favorites[key] || [];
        return currentFavorites.includes(id);
      },

      getFavoriteCount: () => {
        const key = getCurrentUserKey();
        return get().favorites[key]?.length || 0;
      },

      getFavorites: () => {
        const key = getCurrentUserKey();
        return get().favorites[key] || [];
      },
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
