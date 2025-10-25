'use client';

import { useGroupFilters } from '@/hooks/useGroupFilters';
import GroupTab from '@/components/feature/group/GroupTab';
import GroupFilters from '@/components/feature/group/GroupFilters';
import GroupCardList from '@/components/feature/group/GroupCardList';
import CreateGatheringButton from '@/components/feature/gathering/CreateGatheringButton';

export default function GatheringSection() {
  const filter = useGroupFilters();

  return (
    <>
      <GroupTab activeMain={filter.activeMain} handleMainChange={filter.handleMainChange} />
      <GroupFilters {...filter} />
      <GroupCardList filters={filter.filters} />
      <CreateGatheringButton />
    </>
  );
}
