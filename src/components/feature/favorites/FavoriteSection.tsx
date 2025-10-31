'use client';

import { useGroupFilters } from '@/hooks/useGroupFilters';
import FavoriteCardList from './FavoriteCardList';
import FavoriteTabs from './FavoriteTabs';

export default function FavoriteSection() {
  const filter = useGroupFilters();

  return (
    <>
      <FavoriteTabs
        activeMain={filter.activeMain}
        handleMainChange={filter.handleMainChange}
        activeSubId={filter.activeSubId}
        activeSubType={filter.activeSubType}
        handleCategoryChange={filter.handleCategoryChange}
      />
      <FavoriteCardList filters={filter.filters} />
    </>
  );
}
