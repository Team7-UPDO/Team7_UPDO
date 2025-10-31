'use client';

import { useGroupFilters } from '@/hooks/useGroupFilters';
import GroupTab from '@/components/feature/group/GroupTab';
import GroupFilters from '@/components/feature/group/GroupFilters';
import GroupCardList from '@/components/feature/group/GroupCardList';
import CreateGatheringButton from '@/components/feature/gathering/CreateGatheringButton';

export default function GatheringSection() {
  const filter = useGroupFilters();

  return (
    <section aria-labelledby="gathering-section-title">
      <h2 id="gathering-section-title" className="sr-only">
        모임 목록
      </h2>
      <GroupTab activeMain={filter.activeMain} handleMainChange={filter.handleMainChange} />
      <GroupFilters {...filter} />
      <GroupCardList filters={filter.filters} />
      <CreateGatheringButton />
    </section>
  );
}
