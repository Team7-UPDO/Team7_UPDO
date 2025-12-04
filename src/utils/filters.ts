import { FilterState } from '@/utils/mapping';

export function normalizeFilters(filters: Partial<FilterState>): FilterState {
  return {
    main: filters.main ?? '성장',
    subType: filters.subType && filters.subType !== '전체' ? filters.subType : undefined,
    location: filters.location ?? undefined,
    date: filters.date ?? undefined,
    sortBy: filters.sortBy ?? 'registrationEnd',
    sortOrder: filters.sortOrder ?? 'desc',
    limit: filters.limit ?? 10,
  };
}

export function getCleanFilters(filters: Partial<FilterState>): Record<string, unknown> {
  const normalized = normalizeFilters(filters);
  return Object.fromEntries(Object.entries(normalized).filter(([_, value]) => value !== undefined));
}
