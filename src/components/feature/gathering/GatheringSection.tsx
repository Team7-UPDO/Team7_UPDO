'use client';

import CreateGatheringButton from '@/components/feature/gathering/CreateGatheringButton';
import GroupCardList from '@/components/feature/group/GroupCardList';
import GroupFilters from '@/components/feature/group/GroupFilters';
import GroupTab from '@/components/feature/group/GroupTab';
import { useGroupFilters } from '@/hooks/domain/useGroupFilters';
import { FilterState } from '@/utils/mapping';

interface GatheringSectionProps {
  defaultFilters: FilterState;
}
export default function GatheringSection({ defaultFilters }: GatheringSectionProps) {
  const filter = useGroupFilters('gathering', defaultFilters);
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
