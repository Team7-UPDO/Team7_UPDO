'use client';

import { useGroupFilters } from '@/hooks/useGroupFilters';
import GroupTab from '@/components/feature/group/GroupTab';
import GroupFilters from '@/components/feature/group/GroupFilters';
import FavoriteCardList from './FavoriteCardList';

export default function FavoriteSection() {
  const filter = useGroupFilters();

  return (
    <>
      <GroupTab activeMain={filter.activeMain} handleMainChange={filter.handleMainChange} />
      <GroupFilters {...filter} />
      <FavoriteCardList filters={filter.filters} />
    </>
  );
}
